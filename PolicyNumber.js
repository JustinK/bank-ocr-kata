const rawDigits = require('./rawDigits');

module.exports = class PolicyNumber {
  statuses = {
    Illegal: 'ILL',
    Error: 'ERR',
  };

  constructor() {}

  parseLines = (lines) => {
    if (!this.isInputValid(lines)) {
      return '?????????';
    }
    let digits = [];
    for (let i = 0; i <= 24; i += 3) {
      let top = lines['1'].substring(i, i + 3);
      let middle = lines['2'].substring(i, i + 3);
      let bottom = lines['3'].substring(i, i + 3);
      let rawInput = `${top}${middle}${bottom}`;
      let digit = this.parseDigit(rawInput);
      digits.push(digit);
    }
    const status = this.getStatus(digits);
    let returnValue = `${this.getNumber(digits)}`;
    if (status !== '') {
      returnValue = `${returnValue} ${status}`;
    }
    return returnValue;
  };
  isInputValid = (lines) => {
    // adding basic input validation
    // TODO: add additional validation to check that only valid characters are included
    if (
      lines['1'].length !== 27 ||
      lines['2'].length !== 27 ||
      lines['3'].length !== 27
    ) {
      return false;
    }
    return true;
  };

  getNumber = (digits) => {
    return digits.join('');
  };
  getStatus = (digits) => {
    if (digits.includes('?')) {
      return this.statuses.Illegal;
    }
    if (!this.isValid(digits)) {
      return this.statuses.Error;
    }
    return '';
  };
  isValid = (digits) => {
    return (
      digits.reduce((prev, curr, i) => {
        return (9 - i) * curr + prev;
      }, 0) %
        11 ===
      0
    );
  };

  parseDigit = (input) => {
    switch (input) {
      case rawDigits.ZERO:
        return 0;
      case rawDigits.ONE:
        return 1;
      case rawDigits.TWO:
        return 2;
      case rawDigits.THREE:
        return 3;
      case rawDigits.FOUR:
        return 4;
      case rawDigits.FIVE:
        return 5;
      case rawDigits.SIX:
        return 6;
      case rawDigits.SEVEN:
        return 7;
      case rawDigits.EIGHT:
        return 8;
      case rawDigits.NINE:
        return 9;
      default:
        return '?';
    }
  };
};
