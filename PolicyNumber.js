const rawDigits = require('./rawDigits');

module.exports = class PolicyNumber {
  statuses = {
    Illegible: 'ILL',
    Error: 'ERR',
    Ambigious: 'AMB',
  };

  constructor() {}

  parseLines = (lines) => {
    if (!this.isInputValid(lines)) {
      return '?????????';
    }
    let digits = [];
    let rawInputDigits = [];
    for (let i = 0; i <= 24; i += 3) {
      let top = lines['1'].substring(i, i + 3);
      let middle = lines['2'].substring(i, i + 3);
      let bottom = lines['3'].substring(i, i + 3);
      let rawInput = `${top}${middle}${bottom}`;
      let digit = this.parseDigit(rawInput);
      rawInputDigits.push(rawInput);
      digits.push(digit);
    }
    let status = this.getStatus(digits);

    // If status is 'ILL' or 'ERR' attempt to find a valid alternative
    if (status === this.statuses.Illegible || status === this.statuses.Error) {
      const alternates = this.getAlternates(digits, rawInputDigits);
      digits = this.findAlternateIll(digits, alternates.illegible);
      status = this.getStatus(digits);
    }
    let returnValue = `${this.getNumber(digits)}`;
    if (status !== '') {
      returnValue = `${returnValue} ${status}`;
    }
    return returnValue;
  };
  isInputValid = (lines) => {
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
      return this.statuses.Illegible;
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

  getAlternates = (digits, rawInputDigits) => {
    let illegible = [];
    let ambiguous = [];
    for (let i = 0; i <= digits.length; i++) {
      switch (digits[i]) {
        case 0:
          ambiguous.push([8]);
          illegible.push([0]);
          break;
        case 1:
          ambiguous.push([7]);
          illegible.push([1]);
          break;
        case 2:
          ambiguous.push([2]);
          illegible.push([2]);
          break;
        case 3:
          ambiguous.push([9]);
          illegible.push([3]);
          break;
        case 4:
          ambiguous.push([4]);
          illegible.push([4]);
          break;
        case 5:
          ambiguous.push([9]);
          illegible.push([5]);
          break;
        case 6:
          ambiguous.push([8, 5]);
          illegible.push([6]);
          break;
        case 7:
          ambiguous.push([1]);
          illegible.push([7]);
          break;
        case 8:
          ambiguous.push([9, 6]);
          illegible.push([8]);
          break;
        case 9:
          ambiguous.push([8, 5]);
          illegible.push([9]);
          break;
        case '?':
          let alt = this.findCloseMatch(rawInputDigits[i]);
          illegible.push([alt]);
          break;
        default:
          break;
      }
    }
    return { ambiguous, illegible };
  };
  findCloseMatch = (rawInput) => {
    // this function will compare illegible input against known valid inputs
    // count all number of matches between input and digits 0-9
    // if only one close match is found - return it, otherwise return '?'
    let matchCount = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };
    for (let i = 0; i < rawInput.length; i++) {
      if (rawInput[i] === rawDigits.ZERO[i]) {
        matchCount[0] = matchCount[0] + 1;
      }
      if (rawInput[i] === rawDigits.ONE[i]) {
        matchCount[1] = matchCount[1] + 1;
      }
      if (rawInput[i] === rawDigits.TWO[i]) {
        matchCount[2] = matchCount[2] + 1;
      }
      if (rawInput[i] === rawDigits.THREE[i]) {
        matchCount[3] = matchCount[3] + 1;
      }
      if (rawInput[i] === rawDigits.FOUR[i]) {
        matchCount[4] = matchCount[4] + 1;
      }
      if (rawInput[i] === rawDigits.FIVE[i]) {
        matchCount[5] = matchCount[5] + 1;
      }
      if (rawInput[i] === rawDigits.SIX[i]) {
        matchCount[6] = matchCount[6] + 1;
      }
      if (rawInput[i] === rawDigits.SEVEN[i]) {
        matchCount[7] = matchCount[7] + 1;
      }
      if (rawInput[i] === rawDigits.EIGHT[i]) {
        matchCount[8] = matchCount[8] + 1;
      }
      if (rawInput[i] === rawDigits.NINE[i]) {
        matchCount[9] = matchCount[9] + 1;
      }
    }

    let closeMatches = [];
    Object.keys(matchCount).forEach((key) => {
      if (matchCount[key] === 8) {
        closeMatches.push(parseInt(key));
      }
    });
    return closeMatches.length === 1 ? closeMatches[0] : '?';
  };
  findAlternateIll = (digits, illegible) => {
    let illDigits = illegible.map((el) => el[0]);
    if (this.isValid(illDigits)) {
      return illDigits;
    } else {
      return digits;
    }
  };
};
