/*global describe, it*/
'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var should = require('should');
var gutil = require('gulp-util');
var ngJson2js = require('../');

describe('lingon-ng-json2js', function() {
  describe('when file is provided via buffer', function() {
    it('should generate the angular module', function(done) {
      var fixtureFile = 'test/fixtures/example.json';
      var expectedFile = new gutil.File({
        path: 'test/expected/example.js',
        cwd: 'test/',
        base: 'test/expected',
        contents: fs.readFileSync('test/expected/example.js')
      });

      testBufferedFile(null, fixtureFile, expectedFile, done);
    });

    it('should use options.base to resolve the relative file path for the url in the generated file', function(done) {
      var fixtureFile = 'test/fixtures/example.json';
      var expectedFile = new gutil.File({
        path: 'test/expected/exampleWithBase.js',
        cwd: 'test/',
        base: 'test/expected',
        contents: fs.readFileSync('test/expected/exampleWithBase.js')
      });

      var params = {
        base: 'other_test_folder'
      };

      testBufferedFile(params, fixtureFile, expectedFile, done);
    });

    it('should use options.moduleName when provided', function(done) {
      var fixtureFile = 'test/fixtures/example.json';
      var expectedFile = new gutil.File({
        path: 'test/expected/exampleWithModuleName.js',
        cwd: 'test/',
        base: 'test/expected',
        contents: fs.readFileSync('test/expected/exampleWithModuleName.js')
      });

      var params = {
        moduleName: 'templatesCustom'
      };

      testBufferedFile(params, fixtureFile, expectedFile, done);
    });

    it('should add options.prefix to the url in the generated file', function(done) {
      var fixtureFile = 'test/fixtures/example.json';
      var expectedFile = new gutil.File({
        path: 'test/expected/exampleWithPrefix.js',
        cwd: 'test/',
        base: 'test/expected',
        contents: fs.readFileSync('test/expected/exampleWithPrefix.js')
      });

      var params = {
        prefix: '/partials/'
      };

      testBufferedFile(params, fixtureFile, expectedFile, done);
    });

    it('should subtract options.stripPrefix from the url in the generated file', function(done) {
      var fixtureFile = 'test/fixtures/example.json';
      var expectedFile = new gutil.File({
        path: 'test/expected/exampleWithStripPrefix.js',
        cwd: 'test/',
        base: 'test/expected',
        contents: fs.readFileSync('test/expected/exampleWithStripPrefix.js')
      });

      var params = {
        stripPrefix: 'fixtures/'
      };

      testBufferedFile(params, fixtureFile, expectedFile, done);
    });

    it('should subtract options.stripPrefix from the url in the generated file', function(done) {
      var fixtureFile = 'test/fixtures/example_invalid.json';
      var expectedFile = new gutil.File({
        path: 'test/expected/exampleInvalid.js',
        cwd: 'test/',
        base: 'test/expected',
        contents: fs.readFileSync('test/expected/exampleInvalid.js')
      });

      testBufferedFile(null, fixtureFile, expectedFile, done);
    });

    function testBufferedFile(params, fixtureFile, expectedFile, done) {
      var srcFile = new gutil.File({
        path: fixtureFile,
        cwd: 'test/',
        base: 'test',
        contents: fs.readFileSync(fixtureFile)
      });

      var stream = ngJson2js(params);

      stream.on('data', function(newFile) {
        should.exist(newFile);
        path.extname(newFile.path).should.equal('.js');

        should.exist(newFile.contents);
        String(expectedFile.contents).should.equal(String(newFile.contents));

        done();
      });

      stream.write(srcFile);
      stream.end();
    }
  });

  it('should pass on files which are null', function(done) {
    var srcFile = new gutil.File({
      path: 'test/fixtures/example.json',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: null
    });

    var stream = ngJson2js();

    stream.on('data', function(newFile) {
      should.not.exist(newFile.contents);
      done();
    });

    stream.write(srcFile);
    stream.end();
  });

  it('should message on invalid JSON input on stream', function(done) {
    var srcFile = new gutil.File({
      path: 'test/fixtures/example.json',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.createReadStream('test/fixtures/example_invalid.json')
    });

    var stream = ngJson2js();

    stream.on('error', function(err) {
      should.exist(err);
      done();
    });

    stream.on('data', function(newFile) {
      newFile.contents.pipe(es.wait(function(err, data) {
        done(err);
      }));
    });

    stream.write(srcFile);
    stream.end();
  });

  it('should error on stream', function(done) {
    var srcFile = new gutil.File({
      path: 'test/fixtures/example.json',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.createReadStream('test/fixtures/example.json')
    });

    var stream = ngJson2js();

    stream.on('error', function(err) {
      should.exist(err);
      done();
    });

    stream.on('data', function(newFile) {
      newFile.contents.pipe(es.wait(function(err, data) {
        done(err);
      }));
    });

    stream.write(srcFile);
    stream.end();
  });
});
