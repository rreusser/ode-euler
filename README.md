ode-euler
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Integrate a system of ordinary differential equations using the explicit Euler method.


## Installation

``` bash
$ npm install compute-ode-euler
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var foo = require( 'compute-ode-euler' );
```

#### foo( arr )

What does this function do?


## Examples

``` javascript
var foo = require( 'compute-ode-euler' );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. The [Compute.io](https://github.com/compute-io) Authors.


[npm-image]: http://img.shields.io/npm/v/compute-ode-euler.svg
[npm-url]: https://npmjs.org/package/compute-ode-euler

[travis-image]: http://img.shields.io/travis/compute-io/ode-euler/master.svg
[travis-url]: https://travis-ci.org/compute-io/ode-euler

[coveralls-image]: https://img.shields.io/coveralls/compute-io/ode-euler/master.svg
[coveralls-url]: https://coveralls.io/r/compute-io/ode-euler?branch=master

[dependencies-image]: http://img.shields.io/david/compute-io/ode-euler.svg
[dependencies-url]: https://david-dm.org/compute-io/ode-euler

[dev-dependencies-image]: http://img.shields.io/david/dev/compute-io/ode-euler.svg
[dev-dependencies-url]: https://david-dm.org/dev/compute-io/ode-euler

[github-issues-image]: http://img.shields.io/github/issues/compute-io/ode-euler.svg
[github-issues-url]: https://github.com/compute-io/ode-euler/issues
