'use strict';

// MODULES //

var isFunction = require( 'validate.io-function' ),
	isInteger = require( 'validate.io-integer-primitive' ),
	isNumber = require( 'validate.io-number-primitive' ),
	isArray = require( 'validate.io-array' ),
	isTypedArray = require( 'validate.io-typed-array' );


// INTEGRATOR //

/**
* FUNCTION: Integrator( y0, deriv, t, dt )
*	A constructor for an object which integrates a system of
*	ODEs using the explicit Euler method.
*
* @constructor
* @param {Array} y0 - an array containing the initial conditions.
*	 Result is overwritten into this array.
* @param {Function} deriv - a function which receives
*	 an array yp into which it must place the derivative, the
*	 current state vector y, and time t.
* @param {Number} t - Initial time t.
* @param {Number} dt - Time step dt.
* @returns {Integrator} instance which may step the constructed
*	 integrator.
*/
function Integrator( y0, deriv, t, dt ) {

	if( !( this instanceof Integrator ) ) {
		return new Integrator( y0, deriv, t, dt );
	}

	if ( !isArray( y0 ) && !isTypedArray( y0 ) ) {
		throw new TypeError( 'invalid input argument for y0. First argument must be an Array or typed array. Value: `' + y0 + '`' );
	}

	if ( !isFunction( deriv ) ) {
		throw new TypeError( 'invalid input argument for deriv. Second argument must be a function. Value: `' + deriv + '`' );
	}

	if ( !isNumber( t ) ) {
		throw new TypeError( 'invalid input argument for t. Third agument must be a number primitive. Value: `' + t + '`' );
	}

	if ( !isNumber( dt ) ) {
		throw new TypeError( 'invalid input argument for dt. Fourth argument must be a number primitive. Value: `' + dt + '`' );
	}

	this.deriv = deriv;
	this.y = y0;
	this.dt = dt;
	this.t = t;

	this.n = this.y.length;

	// Create a scratch array into which we compute the derivative:
	this._ctor = this.y.constructor;
	this._yp = new this._ctor( this.n );
} // end FUNCTION Integrator()


/**
* FUNCTION: step()
*	Takes a single step of the Euler integrator and
*	stores the result in-place in the y property.
*
* @returns {Integrator} integrator instance
*/
Integrator.prototype.step = function step() {
	var i;

	this.deriv( this._yp, this.y, this.t );

	for ( i = 0; i < this.n; i++ ) {
		this.y[i] += this._yp[i] * this.dt;
	}

	this.t += this.dt;
	return this;
}; // end FUNCTION step()


/**
* FUNCTION: steps( n )
*	Takes n steps of the Euler integrator, storing the result in-place in the y property.
*
* @param {Number} n - number of steps
* @returns {Integrator} integrator instance
*/
Integrator.prototype.steps = function steps( n ) {
	var step;

	if ( !isInteger( n ) ) {
		throw new TypeError( 'step count n must be an integer. Value: `' + n + '`' );
	}
	for ( step = 0; step < n; step++ ) {
		this.step();
	}
	return this;
}; // end FUNCTION steps()


// EXPORTS //

module.exports = Integrator;
