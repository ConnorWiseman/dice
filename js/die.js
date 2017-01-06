(function(exports) {
  'use strict';


  /**
   * [Die description]
   * @param {Number} result
   * @constructor
   */
  var Die = function(result) {
    this.result  = parseInt(result);
  };


  /**
   * @return {String}
   */
  Die.prototype.toString = function() {
    return this.result;
  };


  exports.Die = Die;
}(window));