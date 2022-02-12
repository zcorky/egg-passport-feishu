'use strict';

const OAuth2Strategy = require('passport-oauth2');
const request = require('request-promise');
const util = require('util');
const Profile = require('./profile');

/**
 * `Strategy` constructor.
 *
 * Feishu's OAuth strategy. Please refer to:
 *   Chinese: https://open.feishu.cn/document/ukTMukTMukTM/ukzN4UjL5cDO14SO3gTN
 *   English: https://open.feishu.cn/document/uQTO24CN5YjL0kjN/uEzN44SM3gjLxcDO
 *
 * Options:
 *   - `clientID`      your Feishu application's app id
 *   - `clientSecret`  your Feishu application's app secret
 *   - `callbackURL`   URL to which Feishu will redirect the user after granting authorization
 *   - `appType`       application type, 'public'(default) or 'internal'
 *   - `appTicket`     application ticket, required if `appType` is 'public'
 *
 * Examples:
 *
 *     passport.use(new FeishuStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret',
 *         callbackURL: 'https://www.example.net/auth/feishu/callback',
 *         appType: 'public',
 *         appTicket: 'an-app-ticket'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         cb(null, profile);
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://open.feishu.cn/open-apis/authen/v1/index';
  options.tokenURL = options.tokenURL || 'https://open.feishu.cn/open-apis/authen/v1/access_token';
  options.appType = options.appType || 'public';
  if (options.appType === 'public' && !options.appTicket) {
    throw new TypeError('A public Feishu app requires a `appTicket` option');
  }

  OAuth2Strategy.call(this, options, verify);

  this.name = 'feishu';
  this._appTokenURL = options.appTokenURL || (
    options.appType === 'public' ?
    'https://open.feishu.cn/open-apis/auth/v3/app_access_token/' :
    'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal'
  );
  this._appType = options.appType;
  this._userProfileURL = options.userProfileURL || 'https://open.feishu.cn/open-apis/authen/v1/user_info';
  if (options.appType === 'public') {
    this._appTicket = options.appTicket;
  }

  // Override OAuth2's `getOAuthAccessToken` in accordance to Feishu's OAuth protocol
  const self = this;
  this._oauth2.getOAuthAccessToken = function(code, params, callback) {
    self.getAppAccessToken()
    .then(token => {
      const data = {};
      // data['app_access_token'] = token;
      data['grant_type'] = 'authorization_code';
      data['code'] = code;
      request.post(self._oauth2._getAccessTokenUrl(), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }).json(data)
      .then(results => {
        const {access_token, refresh_token} = results.data;
        delete results.data['refresh_token'];
        callback(null, access_token, refresh_token, results.data);
      })
      .catch(callback);
    })
    .catch(callback);
  }; // end of `this._oauth2.getOAuthAccessToken`
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

/**
 * Return extra Feishu-specific parameters to be included in the authorization
 * request.
 *
 * @param {object} options
 * @return {string}
 * @access protected
 */
Strategy.prototype.authorizationParams = function(options) {
  const params = {};

  // Feishu's authorization query string uses `app_id` instead of `clien_id`
  params['app_id'] = this._oauth2._clientId;

  return params;
}

/**
 * Get `app_access_token` required by Feishu's authentication.
 *
 * @param {function} callback
 * @access protected
 */
Strategy.prototype.getAppAccessToken = function() {
  const data = {};
  data['app_id'] = this._oauth2._clientId;
  data['app_secret'] = this._oauth2._clientSecret;
  if (this._appType === 'public') {
    data['app_ticket'] = this._appTicket;
  }

  return new Promise((resolve, reject) => {
    request.post(this._appTokenURL).json(data)
    .then(results => {
      if (results.code !== 0) {
        throw new Error(`[code: ${results.code}] ${results.msg}`);
      }

      resolve(results['tenant_access_token'] || results['app_access_token']);
    })
    .error(reject);
  });
};

/**
 * Retrieve user profile from Feishu.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `feishu`
 *   - `id`               the user's Feishu ID
 *   - `name`             the user's Feishu name
 *   - `email`            the email address of the user if authorized
 *   - `mobile`           the mobile number of the user if authorized
 *   - `avatar.icon`      the URL of the user's avatar - icon size
 *   - `avatar.thumb`     the URL of the user's avatar - thumb size
 *   - `avatar.middle`    the URL of the user's avatar - middle size
 *   - `avatar.big`       the URL of the user's avatar - big size
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  request.get({
    uri: this._userProfileURL,
    headers: {'Authorization': `Bearer ${accessToken}`},
    json: true
  })
  .then(results => {
    const profile = Profile.parse(results.data);
    profile.provider = 'feishu';
    done(null, profile);
  })
  .error(done);
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;