# passport-feishu

[Passport](http://passportjs.org/) strategy for authenticating with [Feishu](https://www.feishu.cn/).

To learn more details about Feishu's OAuth strategy, please refer to its online docs ([English version](https://open.feishu.cn/document/uQTO24CN5YjL0kjN/uEzN44SM3gjLxcDO), [Chinese version](https://open.feishu.cn/document/ukTMukTMukTM/ukzN4UjL5cDO14SO3gTN)).

__This project is an imitation of Jared Hanson's works, such as [`passport-facebook`](https://github.com/jaredhanson/passport-facebook) and [`passport-google-oauth2`](https://github.com/jaredhanson/passport-google-oauth2).__

## Install

```bash
$ npm install passport-feishu
```

## Usage

#### Configure Strategy

```javascript
const FeishuStrategy = require('passport-feishu').Strategy;

passport.use(new FeishuStrategy({
    clientID: FEISHU_APP_ID,
    clientSecret: FEISHU_APP_SECRET,
    callbackURL: "http://www.example.com/auth/feishu/callback",
    appType: "public",
    appTicket: "the-ticket-received-from-feishu-service"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ feishuUserId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'feishu'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/feishu',
  passport.authenticate('feishu'));

app.get('/auth/feishu/callback', 
  passport.authenticate('feishu', { session: true, successReturnToOrRedirect: '/' })
);
```

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2020 Jiamin Zhao