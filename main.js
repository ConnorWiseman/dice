(function() {
  'use strict';


  const NO_RESULTS = '<li class="no-results">No results to display.</li>';


  document.addEventListener('DOMContentLoaded', function(event) {
    if (!localStorage.getItem('diceSeed')) {
      localStorage.setItem('diceSeed', Random.seed);
    }
    else {
      Random.init(localStorage.getItem('diceSeed'));
      Random.step(DiceRoller.getHistoryLength());
    }

    var seed = document.getElementById('current-seed');
    seed.value = Random.seed;

    var diceHistory = document.getElementById('dice-history');
    if (DiceRoller.getHistoryLength()) {
      var sort = JSON.parse(document.getElementById('history').elements['sort'].value);
      diceHistory.innerHTML = DiceRoller.getHistoryAsString(sort);
    }


    document.getElementById('edit-seed').addEventListener('click', function(event) {
      event.preventDefault();

      if (this.innerHTML === 'Edit') {
        seed.removeAttribute('disabled');
        this.innerHTML = 'Save';
      }
      else {
        seed.setAttribute('disabled', 'disabled');

        if (Random.seed !== parseInt(seed.value)) {
          DiceRoller.clearHistory();
          diceHistory.innerHTML = NO_RESULTS;
        }

        Random.init(parseInt(seed.value));
        Random.step(DiceRoller.getHistoryLength());
        localStorage.setItem('diceSeed', Random.seed);
        this.innerHTML = 'Edit';
      }
    });


    document.getElementById('copy-seed').addEventListener('click', function(event) {
      event.preventDefault();

      var temp = document.createElement('input');
      temp.style.textIndent = '-99999em';
      document.body.appendChild(temp);
      temp.value = seed.value;
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    });


    document.getElementById('reset-seed').addEventListener('click', function(event) {
      event.preventDefault();

      DiceRoller.clearHistory();
      diceHistory.innerHTML = NO_RESULTS;
      Random.init(new Date().getTime());
      localStorage.setItem('diceSeed', Random.seed);
      seed.value = Random.seed;
    });


    document.getElementById('ascending').addEventListener('click', function(event) {
      if (DiceRoller.getHistoryLength()) {
        diceHistory.innerHTML = DiceRoller.getHistoryAsString(false);
        diceHistory.scrollTop = diceHistory.scrollHeight;
      } else {
        diceHistory.innerHTML = NO_RESULTS;
      }
    });


    document.getElementById('descending').addEventListener('click', function(event) {
      if (DiceRoller.getHistoryLength()) {
        diceHistory.innerHTML = DiceRoller.getHistoryAsString(true);
        diceHistory.scrollTop = 0;
      } else {
        diceHistory.innerHTML = NO_RESULTS;
      }
    });


    document.getElementById('roll-dice').addEventListener('click', function(event) {
      event.preventDefault();
      var form = document.getElementById('dice-roller');

      var number = parseInt(document.getElementById('number').value),
          sides = parseInt(document.getElementById('sides').value),
          subtract = (form.elements['subtract'].value == 'true') ? true : false,
          modifier = parseInt(document.getElementById('modifier').value);

      if (!number || !sides) {
        throw new ReferenceError('Required values missing.');
      }

      var result = DiceRoller.roll(number, sides, modifier, subtract);
      document.getElementById('result').value = result;

      var sort = JSON.parse(document.getElementById('history').elements['sort'].value);
      diceHistory.innerHTML = DiceRoller.getHistoryAsString(sort);
      diceHistory.scrollTop = (sort === false) ? diceHistory.scrollHeight : 0;
    });


    document.getElementById('clear-history').addEventListener('click', function(event) {
      event.preventDefault();
      DiceRoller.clearHistory();
      diceHistory.innerHTML = NO_RESULTS;
      Random.init(Random.seed);
    });
  });
}());