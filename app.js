'use strict';

const debug = require('debug')('egg-passport-github');
const assert = require('assert');
const Strategy = require('./lib').Strategy;

module.exports = app => {
  const config = app.config.passportGithub;
  config.passReqToCallback = true;
  assert(config.key, '[egg-passport-github] config.passportGithub.key required');
  assert(config.secret, '[egg-passport-github] config.passportGithub.secret required');
  config.clientID = config.key;
  config.clientSecret = config.secret;

  // must require `req` params
  app.passport.use('feishu', new Strategy(config, (accessToken, refreshToken, profile, done) => {
    // format user
    const user = {
      provider: 'feishu',
      id: profile.id,
      name: profile.mobile,
      displayName: profile.name,
      photo: profile.avatar.icon,
      accessToken,
      refreshToken,
      // params,
      profile,
    };

    if (profile.email) {
      user.emails = [{ value: profile.email }];
    }

    // debug('%s %s get user: %j', req.method, req.url, user);

    // let passport do verify and call verify hook
    app.passport.doVerify(req, user, done);
  }));
};
