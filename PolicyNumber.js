import { RawDigits } from './rawDigits.js';

export default class PolicyNumber {
  statuses = {
    Illegible: 'ILL',
    Error: 'ERR',
    Ambigious: 'AMB',
    Valid: '',
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
    if (status !== this.statuses.Valid) {
      const alternates = this.getAlternateDigits(digits, rawInputDigits);
      let alts =
        status === this.statuses.Illegible
          ? alternates.illegible
          : alternates.ambiguous;
      let res = this.findAlternateNumber(digits, alts, status);
      digits = res.digits;
      status = res.status;
    }

    let returnValue = `${this.getNumber(digits)}`;
    if (status !== this.statuses.Valid) {
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
    return this.statuses.Valid;
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
      case RawDigits.ZERO:
        return 0;
      case RawDigits.ONE:
        return 1;
      case RawDigits.TWO:
        return 2;
      case RawDigits.THREE:
        return 3;
      case RawDigits.FOUR:
        return 4;
      case RawDigits.FIVE:
        return 5;
      case RawDigits.SIX:
        return 6;
      case RawDigits.SEVEN:
        return 7;
      case RawDigits.EIGHT:
        return 8;
      case RawDigits.NINE:
        return 9;
      default:
        return '?';
    }
  };

  getAlternateDigits = (digits, rawInputDigits) => {
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
          ambiguous.push([9, 6]);
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
          ambiguous.push([9, 6, 0]);
          illegible.push([8]);
          break;
        case 9:
          ambiguous.push([8, 5]);
          illegible.push([9]);
          break;
        case '?':
          illegible.push(this.findCloseMatch(rawInputDigits[i]));
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
      if (rawInput[i] === RawDigits.ZERO[i]) {
        matchCount[0] = matchCount[0] + 1;
      }
      if (rawInput[i] === RawDigits.ONE[i]) {
        matchCount[1] = matchCount[1] + 1;
      }
      if (rawInput[i] === RawDigits.TWO[i]) {
        matchCount[2] = matchCount[2] + 1;
      }
      if (rawInput[i] === RawDigits.THREE[i]) {
        matchCount[3] = matchCount[3] + 1;
      }
      if (rawInput[i] === RawDigits.FOUR[i]) {
        matchCount[4] = matchCount[4] + 1;
      }
      if (rawInput[i] === RawDigits.FIVE[i]) {
        matchCount[5] = matchCount[5] + 1;
      }
      if (rawInput[i] === RawDigits.SIX[i]) {
        matchCount[6] = matchCount[6] + 1;
      }
      if (rawInput[i] === RawDigits.SEVEN[i]) {
        matchCount[7] = matchCount[7] + 1;
      }
      if (rawInput[i] === RawDigits.EIGHT[i]) {
        matchCount[8] = matchCount[8] + 1;
      }
      if (rawInput[i] === RawDigits.NINE[i]) {
        matchCount[9] = matchCount[9] + 1;
      }
    }

    let closeMatches = [];
    Object.keys(matchCount).forEach((key) => {
      if (matchCount[key] === 8) {
        closeMatches.push(parseInt(key));
      }
    });
    return closeMatches.length >= 1 ? closeMatches : ['?'];
  };

  findAlternateNumber = (digits, ambiguous, currentStatus) => {
    // example:
    // digits => [4, 9, 1, 5, 0, 8, 0, 0, 0]
    // ambiguous/illegible digits => [[4], [8, 5], [7], [9], [8], [9, 6], [8], [8], [8]]
    // loop through digits
    // check if index has ambiguous options
    // loop through options and test if resulting policy number is valid
    let validPolicyNumbers = [];
    let res = {
      digits: digits,
      status: currentStatus,
    };
    // For illegible digits find all possible permutations and find valid policy numbers
    if (currentStatus === this.statuses.Illegible) {
      let possibleNumbers = this.findAllCombinations(ambiguous);
      possibleNumbers.forEach((p) => {
        if (this.isValid(p)) {
          validPolicyNumbers.push(p);
        }
      });
    }
    // For ambigious digits only replace one digit at a time
    if (currentStatus === this.statuses.Error) {
      for (let i = 0; i < digits.length; i++) {
        if (!ambiguous[i].includes(digits[i])) {
          for (let j = 0; j < ambiguous[i].length; j++) {
            let tempDigits = [...digits];
            tempDigits[i] = ambiguous[i][j];
            if (this.isValid(tempDigits)) {
              validPolicyNumbers.push(tempDigits);
            }
          }
        }
      }
    }

    if (validPolicyNumbers.length > 1) {
      res.digits = digits;
      res.status = this.statuses.Ambigious;
      return res;
    } else if (validPolicyNumbers.length === 1) {
      res.digits = validPolicyNumbers[0];
      res.status = this.statuses.Valid;
      return res;
    }
    res.status = currentStatus;
    res.digits = digits;
    return res;
  };

  findAllCombinations = (arr) => {
    /* returns cartesian product of arrays to get all possible policy numbers
       For example:
       this input: [[4], [8, 5], [7], [9], [8], [9, 6], [8], [8], [8]]
       will return [ [ 4, 8, 7, 9, 8, 9, 8, 8, 8 ], 
                     [ 4, 8, 7, 9, 8, 6, 8, 8, 8 ], 
                     [ 4, 5, 7, 9, 8, 9, 8, 8, 8 ], 
                     [ 4, 5, 7, 9, 8, 6, 8, 8, 8 ] ]
    */
    return arr.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
  };
}
