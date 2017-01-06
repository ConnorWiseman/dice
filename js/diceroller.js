(function(exports) {
  'use strict';


  const DICE_HISTORY = 'diceHistory';


  /**
   *
   * @constructor
   */
  var DiceRoller = function() {
    if (!localStorage.getItem(DICE_HISTORY)) {
      this.saveHistory([]);
    }
  };


  /**
   * Returns the dice roller history.
   * @return {Array}
   */
  DiceRoller.prototype.getHistory = function() {
    return JSON.parse(localStorage.getItem(DICE_HISTORY));
  };


  DiceRoller.prototype.getHistoryLength = function() {
    return this.getHistory().length;
  };


  DiceRoller.prototype.getHistoryAsString = function(descending) {
    var history = this.getHistory();

    for (var i = 0; i < history.length; i++) {
      var number = parseInt(history[i].number),
          sides = parseInt(history[i].sides),
          modifier = parseInt(history[i].modifier),
          subtract = history[i].subtract,
          results = history[i].results,
          timestamp = history[i].timestamp;

      history[i] = new Dice(number, sides, modifier, subtract, results, timestamp);

      for (var j = 0; j < history[i].results.length; j++) {
        var result = parseInt(history[i].results[j].result);
        history[i].results[j] = new Die(result);
      }
    }

    if (descending === true) {
      history.reverse();
    }

    return '<li>' + history.join('</li><li>') + '</li>';
  };


  /**
   *
   * @param  {Object} object
   */
  DiceRoller.prototype.addToHistory = function(object) {
    var history = this.getHistory();
    history.push(object);
    this.saveHistory(history);
  };


  /**
   *
   * @param  {Array} history
   */
  DiceRoller.prototype.saveHistory = function(history) {
    localStorage.setItem(DICE_HISTORY, JSON.stringify(history));
  };


  /**
   *
   */
  DiceRoller.prototype.clearHistory = function() {
    this.saveHistory([]);
  };


  /**
   *
   * @param  {Number}  number
   * @param  {Number}  sides
   * @param  {Number}  modifier
   * @param  {Boolean} subtract
   * @return {Number}
   */
  DiceRoller.prototype.roll = function(number, sides, modifier, subtract) {
    number = parseInt(number);
    sides = parseInt(sides);
    modifier = parseInt(modifier) || 0;

    var total = (subtract === true) ? (-1 * modifier) : modifier,
        dice  = [];

    for (var i = 0; i < number; i++) {
      var random = Random.real(),
          result = (Math.floor(sides * random) + 1);

      dice.push(new Die(result));
      total += result;
    }

    var timestamp = new Date().getTime();

    dice = new Dice(number, sides, modifier, subtract, dice, timestamp);
    this.addToHistory(dice);
    return (total > 0) ? total : 0;
  };


  exports.DiceRoller = new DiceRoller();
}(window));