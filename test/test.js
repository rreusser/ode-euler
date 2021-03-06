/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	euler = require( './../lib' ),
	richardson = require( 'richardson-extrapolation' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert,
	ctors = {
		'float32 typed array': Float32Array,
		'float64 typed array': Float64Array,
		'Array': function(){ return arguments[0]; }
	};


// TESTS //

describe( 'compute-ode-euler', function tests() {
	it( 'exports a function', function test() {
		expect( euler ).to.be.a( 'function' );
	});

	it( 'throws an error if y0 is not array-like', function test() {
		assert.throws( function () {
			euler( 'invalid', function() {}, 0, 0 );
		});
	});

	it( 'throws an error if deriv is not a function', function test() {
		assert.throws( function () {
			euler( [1,2,3], 'invalid', 0, 0 );
		});
	});

	it( 'throws an error if t is not a Number', function test() {
		assert.throws( function () {
			euler( [1,2,3], function() {}, 'invalid', 0 );
		});
	});

	it(' throws an error if dt is not a Number', function test() {
		assert.throws( function () {
			euler( [1,2,3], function() {}, 0, 'invalid' );
		});
	});

	it( 'throws an error if step count is not an integer', function test() {
		var integrator = euler( [1,2,3], function() { return [0, 0, 0]; }, 1, 0 );

		assert.doesNotThrow(function () {
			integrator.steps( 1 );
		});

		assert.throws( function () {
			integrator.steps( 1.5 );
		});
	});
});

Object.keys( ctors ).forEach( function( dtype ) {
	var Ctor = ctors[dtype];

	describe( 'compute-ode-euler (' + dtype + ')', function tests() {

		describe( 'integration of one variable', function test() {
			var integrator, f, y0, t0, n;

			beforeEach(function() {
				f = function(dydt, y) { dydt[0] = -y[0]; };
				t0 = 1.5;
				y0 = new Ctor([1]);
				n = 100;

				integrator = euler( y0, f, t0, 1/n );
			});

			it( 'creates work arrays of the same type as the input', function test() {
				assert.equal( integrator._yp.constructor, y0.constructor );
			});

			it( 'creates work arrays of the same length as the input', function test() {
				assert.equal( integrator._yp.length, y0.length );
			});

			it( 'takes multiple timesteps', function test() {
				integrator.steps(n);
				assert.closeTo(integrator.y[0], Math.exp(-1), 1e-2 );
			});
		});

		describe( 'integration of two variables', function tests() {
			var integrator, f, y0, t0;

			beforeEach(function() {
				f = function(dydt, y) {
					dydt[0] = -y[1];
					dydt[1] = y[0];
				};

				t0 = 1.5;
				y0 = new Ctor([1,0]);

				integrator = euler( y0, f, t0, 1 );
			});

			it( 'creates work arrays of the same type as the input', function test() {
				assert.equal( integrator._yp.constructor, y0.constructor );
			});

			it( 'creates work arrays of the same length as the input', function test() {
				assert.equal( integrator._yp.length, y0.length );
			});


			it( 'takes a single timestep', function test() {
				integrator.step();
				assert.closeTo( integrator.y[0], 1, 1e-4 );
				assert.closeTo( integrator.y[1], 1, 1e-4 );
			});

			it( 'increments the time', function test() {
				integrator.step();
				assert.closeTo( integrator.t, t0 + integrator.dt, 1e-4 );
				integrator.step();
				assert.closeTo( integrator.t, t0 + 2*integrator.dt, 1e-4 );
			});

			it( 'takes multiple timesteps', function test() {
				integrator.steps(2);
				assert.closeTo(integrator.y[0], 0, 1e-4 );
				assert.closeTo(integrator.y[1], 2, 1e-4);
			});

		});

		describe( 'euler integration with binding of extra data (' + dtype + ')', function tests() {
			var integrator, f, y0;

			beforeEach( function() {
				var data = {
					scale: 2
				};

				f = function(dydt, y) {
					dydt[0] = -y[1] * this.scale;
					dydt[1] = y[0] * this.scale;
				}.bind(data);

				y0 = new Ctor([1,0]);

				integrator = euler( y0, f, 0, 1 );
			});

			it( 'takes a single timestep', function test() {
				integrator.step();
				assert.closeTo( integrator.y[0], 1, 1e-4 );
				assert.closeTo( integrator.y[1], 2, 1e-4 );
			});

			it( 'takes multiple timesteps', function test() {
				integrator.steps(2);
				assert.closeTo(integrator.y[0], -3, 1e-4 );
				assert.closeTo(integrator.y[1], 4, 1e-4);
			});
		});

		describe( 'convergence', function tests() {

			it( 'local truncation error is ~ O(h^2) in time', function test() {
				// Integrate an exponential: dy/dt = -y --> y = exp(-t)
				var result = richardson(function(h) {
					var f = function(dydt, y) { dydt[0] = -y[0]; };
					return euler( new Ctor([1]), f, 0, h ).step().y[0] - Math.exp(-h);
				}, [0.06,0.01], { f: 0 } );

				assert.closeTo( result.n, 2, 1e-2, 'n ~ 2' );
			});

			it( 'local truncation error is order O(h^2)', function test() {
				var result = richardson(function(h) {

					// Integrate along a sector of a circle:
					var f = function(dydt, y) { dydt[0] = -y[1]; dydt[1] =	y[0]; };
					var i = euler( new Ctor([1,0]), f, 0, h ).step();

					// Return the distance from the expected endpoint:
					return Math.sqrt( Math.pow(i.y[0]-Math.cos(h),2) + Math.pow(i.y[1]-Math.sin(h),2) );

				}, 2*Math.PI/100, { f: 0 } );

				assert.closeTo( result.n, 2, 1e-2, 'n ~ 2' );
			});

			it( 'total accumulated error is order O(h^1)', function test() {

				var result = richardson(function(h) {

					// Integrate around a circle with this step size:
					var f = function(dydt, y) { dydt[0] = -y[1]; dydt[1] =	y[0]; };
					var i = euler( new Ctor([1,0]), f, 0, h ).steps( Math.floor(2*Math.PI/h + 0.5) );

					// Return the distance from the expected endpoint:
					return Math.sqrt( Math.pow(i.y[0]-1,2) + Math.pow(i.y[1],2) );

				}, 2*Math.PI/100, { f: 0 } );

				assert.closeTo( result.n, 1, 1e-1, 'n ~ 1' );
			});

			it( 'total accumulated error is order O(h^1) in all variables', function test() {

				var result = richardson( function( h ) {
					// Integrate around a circle at an accelerating rate
					var f = function(dydt, y, t) {
						var s = Math.sin(t * Math.PI) * Math.PI / 2;
						dydt[0] = -y[1]* 2 * Math.PI * s;
						dydt[1] = y[0]* 2 * Math.PI * s;
					};
					var i = euler( new Ctor([1,0]), f, 0, h ).steps( Math.floor(1/h+0.5));

					// Return the distance from the expected endpoint:
					return Math.sqrt( Math.pow(i.y[0]-1,2) + Math.pow(i.y[1],2) );

				}, 0.001, { f: 0 } );

				assert.closeTo( result.n, 1, 1e-2, 'n ~ 1' );
			});
		});
	});
});
