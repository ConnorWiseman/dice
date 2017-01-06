(function(exports) {
  'use strict';


  const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec'
  ];


  /**
   * [Dice description]
   * @param {Number}  number    The number of dice rolled.
   * @param {Number}  sides     The number of sides on each die.
   * @param {Number}  modifier  The static roll modifier.
   * @param {Boolean} subtract  Whether to add or subtract the modifier.
   * @param {Array}   results   The result of the die roll.
   * @param {Number}  timestamp A timestamp representing when the dice were rolled.
   * @constructor
   */
  var Dice = function(number, sides, modifier, subtract, results, timestamp) {
    this.number    = parseInt(number);
    this.sides     = parseInt(sides);
    this.modifier  = parseInt(modifier);
    this.subtract  = subtract;
    this.results   = results;
    this.timestamp = timestamp;
  };


  /**
   * @return {String}
   */
  Dice.prototype.toString = function() {
    var string = '<span class="die">' + this.number + 'd' + this.sides;
    if (this.modifier > 0) {
      string += (this.subtract === true) ? '-' : '+';
      string += this.modifier;
    }
    string += ': </span>';

    var result = this.results.reduce(function(previousValue, currentValue) {
      return previousValue + currentValue;
    }, 0);

    if (this.modifier > 0 && this.subtract === true) {
      if (this.modifier > result) {
        result = 0;
      }
      else result -= this.modifier;
    }
    else {
      result += this.modifier;
    }

    var date = new Date(this.timestamp);
    var month = MONTHS[date.getMonth()];
    var day = date.getDate();
    var hours = date.getHours();
    var period = (hours >= 12) ? 'PM' : 'AM';
    hours = ((hours + 11) % 12 + 1);
    var minutes = date.getMinutes();
    minutes = (minutes > 9) ? minutes : '0' + minutes;

    var timestamp = month + ' ' + day + ', ' + hours + ':' + minutes + ' ' + period;

    string += '<strong class="result" title="' + timestamp + '">' + result;
    string += '</strong> ';
    string += '<span class="rolls">' + this.results.join(', ') + '</span>';

    return string;
  };


  exports.Dice = Dice;
}(window));