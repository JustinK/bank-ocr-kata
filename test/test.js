import { equal } from 'assert';
import PolicyNumber from '../PolicyNumber.js';
import { RawDigits } from '../RawDigits.js';

describe('Testing PolicyNumber methods', function () {
  describe('parseLines()', function () {
    it('should return 012345688 ERR', function () {
      const policyNumber = new PolicyNumber();
      const lines = {
        0: '                           ',
        1: ' _     _  _     _  _  _  _ ',
        2: '| |  | _| _||_||_ |_ |_||_|',
        3: '|_|  ||_  _|  | _||_||_||_|',
      };
      const number = policyNumber.parseLines(lines);
      equal(number, '012345688 ERR');
    });
    it('should return 008008000', function () {
      const policyNumber = new PolicyNumber();
      const lines = {
        0: '                           ',
        1: ' _  _  _  _  _  _  _  _  _ ',
        2: '| || ||_|| || ||_|| || || |',
        3: '|_||_||_||_||_||_||_||_||_|',
      };
      const number = policyNumber.parseLines(lines);
      equal(number, '008008000');
    });
    it('should return 008008000', function () {
      const policyNumber = new PolicyNumber();
      const lines = {
        0: '                           ',
        1: ' _     _  _  _  _  _     _ ',
        2: '| || ||_|| || ||_|| || || |',
        3: '|_||_||_||_||_||_||_||_||_|',
      };
      const number = policyNumber.parseLines(lines);
      equal(number, '008008000');
    });
    it('should return 0?80080?8 ILL', function () {
      const policyNumber = new PolicyNumber();
      const lines = {
        0: '                           ',
        1: ' _     _  _  _  _  _     _ ',
        2: '| || ||_|| || ||_|| || ||_|',
        3: '|_||_||_||_||_||_||_||_||_|',
      };
      const number = policyNumber.parseLines(lines);
      equal(number, '0?80080?8 ILL');
    });
    it('should return ?????????', function () {
      const policyNumber = new PolicyNumber();
      const lines = {
        0: '                           ',
        1: ' _  _  _  _  _  _  _  _  _', //this line has 26 characters
        2: '| || ||_|| || ||_|| || || |',
        3: '|_||_||_||_||_||_||_||_||_|',
      };
      const number = policyNumber.parseLines(lines);
      equal(number, '?????????');
    });

    it('should return 457508000', function () {
      const policyNumber = new PolicyNumber();
      const lines = {
        0: '                           ',
        1: '    _  _  _  _  _  _  _  _ ',
        2: '|_||_   ||_ | ||_|| || || |',
        3: '  | _|  | _||_||_||_||_||_|',
      };
      const number = policyNumber.parseLines(lines);
      equal(number, '457508000');
    });

    it('457908000 parsed should be corrected and returned 457508000', function () {
      const policyNumber = new PolicyNumber();
      const lines = {
        0: '                           ',
        1: '    _  _  _  _  _  _  _  _ ',
        2: '|_||_   ||_|| ||_|| || || |',
        3: '  | _|  | _||_||_||_||_||_|',
      };
      const number = policyNumber.parseLines(lines);
      equal(number, '457508000');
    });
  });

  describe('parseDigit()', function () {
    const policyNumber = new PolicyNumber();
    it('should return 0', function () {
      let digit = policyNumber.parseDigit(RawDigits.ZERO);
      equal(digit, 0);
    });
    it('should return 1', function () {
      let digit = policyNumber.parseDigit(RawDigits.ONE);
      equal(digit, 1);
    });
    it('should return 2', function () {
      let digit = policyNumber.parseDigit(RawDigits.TWO);
      equal(digit, 2);
    });
    it('should return 3', function () {
      let digit = policyNumber.parseDigit(RawDigits.THREE);
      equal(digit, 3);
    });
    it('should return 4', function () {
      let digit = policyNumber.parseDigit(RawDigits.FOUR);
      equal(digit, 4);
    });
    it('should return 5', function () {
      let digit = policyNumber.parseDigit(RawDigits.FIVE);
      equal(digit, 5);
    });
    it('should return 6', function () {
      let digit = policyNumber.parseDigit(RawDigits.SIX);
      equal(digit, 6);
    });
    it('should return 7', function () {
      let digit = policyNumber.parseDigit(RawDigits.SEVEN);
      equal(digit, 7);
    });
    it('should return 8', function () {
      let digit = policyNumber.parseDigit(RawDigits.EIGHT);
      equal(digit, 8);
    });
    it('should return 9', function () {
      let digit = policyNumber.parseDigit(RawDigits.NINE);
      equal(digit, 9);
    });
  });
  describe('isValid()', function () {
    it('345882865 should return true', function () {
      const policyNumber = new PolicyNumber();
      equal(policyNumber.isValid('345882865'.split('')), true);
    });
    it('457508000 should return true', function () {
      const policyNumber = new PolicyNumber();
      equal(policyNumber.isValid('457508000'.split('')), true);
    });
    it('457508001 should return false', function () {
      const policyNumber = new PolicyNumber();
      equal(policyNumber.isValid('457508001'.split('')), false);
    });
    it('008008000 should return true', function () {
      const policyNumber = new PolicyNumber();
      equal(policyNumber.isValid('008008000'.split('')), true);
    });
  });
});
