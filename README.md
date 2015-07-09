# lingon-ng-json2js [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> A Lingon plugin which generates AngularJS modules, which pre-load your JSON files into a $cacheFactory.
> A plugin for [Lingon](https://github.com/spotify/lingon) which generates AngularJS modules, which pre-load
your JSON files into a [$cacheFactory](http://docs.angularjs.org/api/ng.$cacheFactory).

## Usage

First, install `lingon-ng-json2js` as a development dependency:

```shell
npm install --save-dev lingon-ng-json2js
```

Then, add it to your `lingon.js`:

```javascript
var ngJson2Js = require("lingon-ng-json2js");

lingon.preProcessor('json').add(function(params) {
  return ngJson2js({
    moduleName: 'templates',
    base: 'source'
  });
});
```

The main reason to use this module would be to bundle json files. By bundling JSON files you can spare requests and
loading time when the files are actually needed. When you are optimizing, you should do it properly. So, we should add
the following plugin: `gulp-uglify`:

```javascript
var ngJson2js = require("lingon-ng-json2js");
var uglify = require("gulp-uglify");

lingon.preProcessor('json').add(function(params) {
  return ngJson2js({
    moduleName: 'templates',
    base: 'source'
  });
});

lingon.postProcessor('js').add(function(params) {
  // only run minification for build task
  if(lingon.task == 'build') {
    return uglify({
      outSourceMap: true
    });
  }
});
```

This way you end up with 1 single, minified Javascript file, which bundles all the (minified) JSON files.

## API

### ngJson2Js(options)

#### options.moduleName
Type: `String`

The name of the generated AngularJS module. Uses the `templates` if omitted.

#### options.prefix
Type: `String`

The prefix which should be prepended to the file path to generate the file url.

#### options.stripPrefix
Type: `String`

The prefix which should be subtracted from the file path to generate the file url.

#### options.base
Type: `String`

The base directory used for resolving the relative file path to generate the file url. Falls back to regular file.base if unset.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/lingon-ng-json2js
[npm-image]: https://badge.fury.io/js/lingon-ng-json2js.png

[travis-url]: http://travis-ci.org/philipvonbargen/lingon-ng-json2js
[travis-image]: https://secure.travis-ci.org/philipvonbargen/lingon-ng-json2js.png?branch=master

[depstat-url]: https://david-dm.org/philipvonbargen/lingon-ng-json2js
[depstat-image]: https://david-dm.org/philipvonbargen/lingon-ng-json2js.png
