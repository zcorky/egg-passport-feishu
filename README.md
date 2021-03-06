# egg-passport-github

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-passport-feishu.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-passport-feishu
[travis-image]: https://img.shields.io/travis/eggjs/egg-passport-feishu.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-passport-feishu
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-passport-feishu.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-passport-feishu?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-passport-feishu.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-passport-feishu
[snyk-image]: https://snyk.io/test/npm/egg-passport-feishu/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-passport-feishu
[download-image]: https://img.shields.io/npm/dm/egg-passport-feishu.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-passport-feishu

feishu passport plugin for egg

## Install

```bash
$ npm i egg-passport-feishu --save
```

## Usage

```js
// config/plugin.js
exports.passportFeishu = {
  enable: true,
  package: 'egg-passport-feishu',
};
```

## Configuration

```js
// config/config.default.js
exports.passportFeishu = {
  key: 'your oauth key',
  secret: 'your oauth secret',
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Questions & Suggestions

Please open an issue [here](https://github.com/zcorky/egg-passport-feishu/issues).

## License

[MIT](LICENSE.txt)
