/**
 * A rudimentary implementation of Takuji Nishimura and Makoto Matsumoto's
 * Mersenne Twister algorithm. Lacking features; only intended for use as a
 * pseudorandom number generator for JavaScript to make up for Math.random's
 * lack of seeding abilities.
 *
 * {@link http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/MT2002/CODES/mt19937ar.c}
 */


(function(exports) {
  'use strict';


  // Period parameters
  const N = 624;
  const M = 397;
  const MATRIX_A   = 0x9908b0df; // Constant vector a
  const UPPER_MASK = 0x80000000; // Most significant w-r bits
  const LOWER_MASK = 0x7fffffff; // Least significant r bits


  /**
   * @param  {Number} [seed]
   * @constructor
   */
  var MersenneTwister = function(seed) {
    this.seed = parseInt(seed) || new Date().getTime();
    this._mt = new Array(N);
    this._mti;

    this.init(this.seed);
  };


  /**
   * Seeds this._mt with pseudorandom values.
   * @param  {Number} seed
   */
  MersenneTwister.prototype.init = function(seed) {
    this.seed = seed;

    this._mt[0] = seed >>> 0;

    for (this._mti = 1; this._mti < N; this._mti++) {
      this._mt[this._mti] = (1812433253 * this._mt[this._mti - 1] ^ (this._mt[this._mti - 1] >>> 30)) + this._mti;
      this._mt[this._mti] >>>= 0;
    }
  };


  MersenneTwister.prototype.step = function(steps) {
    for (var i = 0; i < parseInt(steps); i++) {
      this._int32();
    }
  };


  /**
   * Generates a random number on the [0,0xffffffff]-interval.
   * @return {Number}
   */
  MersenneTwister.prototype._int32 = function() {
    var y,
        mag01 = new Array(0, MATRIX_A);

    if (this._mti >= N) {
      if (this._mti === (N + 1)) {
        this.seed = new Date().getTime();
        this.init(this.seed);
      }

      var kk;

      for (kk = 0; kk < (N - M); kk++) {
        y = (this._mt[kk] & UPPER_MASK) | (this._mt[kk + 1] & LOWER_MASK);
        this._mt[kk] = this._mt[kk + M] ^ (y >>> 1) ^ mag01[y & 1];
      }
      while (kk < (N - 1)) {
        y = (this._mt[kk] & UPPER_MASK) | (this._mt[kk + 1] & LOWER_MASK);
        this._mt[kk] = this._mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 1];
        kk++;
      }
      y = (this._mt[N - 1] & UPPER_MASK) | (this._mt[0] & LOWER_MASK);
      this._mt[kk] = this._mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 1];

      this._mti = 0;
    }

    y = this._mt[this._mti++];

    y ^= (y >>> 11);
    y ^= (y << 7)  & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >>> 18);

    return y >>> 0;
  };


  /**
   * Generates a random number on the [0,1]-real-interval.
   * @return {Number}
   */
  MersenneTwister.prototype.real = function() {
    return this._int32() * (1.0 / (4294967296.0 - 1.0));
  };


  exports.Random = new MersenneTwister();
}(window));