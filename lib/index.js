/**
*
*	COMPUTE: ode-euler
*
*
*	DESCRIPTION:
*		- Integrates a system of ordinary differentials equations using the
*		 explicit Euler method
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2015. Ricky Reusser.
*
*
*	AUTHOR:
*		Ricky Reusser. rsreusser@gmail.com. 2015.
*
*/

'use strict';

// MODULES //

var isFunction = require( 'validate.io-function' );
var isInteger = require( 'validate.io-integer' );
var isNumber = require( 'validate.io-number' );
var isArray = require( 'validate.io-array' );
var isTypedArray = require( 'validate.io-typed-array' );

// FUNCTIONS //

/**
 * FUNCTION: Integrator( y0, deriv, t, dt )
 *			 A constructor for an object which integrates a system of
 *			 ODEs using the explicit Euler method.
 *
 * @param {Array} y0 - an array containing the initial conditions.
 *	 Result is overwritten into this array.
 *
 * @param {function( yp, y, t )} deriv - a function which receives
 *	 an array yp into which it must place the derivative, the
 *	 current state vector y, and time t.
 *
 * @param {Number} t - Initial time t.
 *
 * @param {Number} dt - Time step dt.
 *
 * @returns {Object} an object which may step the constructed
 *	 integrator.
 */
var Integrator = function Integrator( y0, deriv, t, dt ) {

	if ( !isArray( y0 ) && !isTypedArray( y0 ) ) {
		throw new TypeError( 'ode-euler()::invalid input argument for y0. Must provide an Array or typed array.' );
	}

	if ( !isFunction( deriv ) ) {
		throw new TypeError( 'ode-euler()::invalid input argument for deriv. Must provide a function.' );
	}

	if ( !isNumber( t ) ) {
		throw new TypeError( 'ode-euler()::invalid input argument for t. Must provide a function.' );
	}

	if ( !isNumber( dt ) ) {
		throw new TypeError( 'ode-euler()::invalid input argument for dt. Must provide a function.' );
	}

	this.deriv = deriv;
	this.y = y0;
	this.dt = dt;
	this.t = t;

	this.n = this.y.length;

	// Create a scratch array into which we compute the derivative:
	this._ctor = this.y.constructor;
	this._yp = new this._ctor( this.n );
};

Integrator.prototype.step = function() {

	this.deriv( this._yp, this.y, this.t );

	for(var i=0; i<this.n; i++) {
		this.y[i] += this._yp[i] * this.dt;
	}

	this.t += this.dt;
	return this;
};

Integrator.prototype.steps = function( n ) {
	if ( !isInteger( n ) ) {
		throw new TypeError( 'ode-euler()::steps()::step count n must be an integer.' );
	}

	for(var step=0; step<n; step++) {
		this.step();
	}
	return this;
};


/**
* FUNCTION: IntegratorFactory()
*				A function that simply executes the constructor and returns
*				an object with integration methods.
*/
function IntegratorFactory( y0, deriv, t, dt ) {
	return new Integrator( y0, deriv, t, dt );
}



// EXPORTS //

module.exports = IntegratorFactory;
