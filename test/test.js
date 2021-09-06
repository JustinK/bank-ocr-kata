const assert = require('assert');
const PolicyNumber = require('../PolicyNumber');
const rawDigits = require('../rawDigits');

describe('Testing PolicyNumber methods', function () {
  describe('parseLines()', function () {
    it('should return 012345678', function () {
      const policyNumber = new PolicyNumber();
      const lines = {
        0: '                           ',
        1: ' _     _  _     _  _  _  _ ',
        2: '| |  | _| _||_||_ |_   ||_|',
        3: '|_|  ||_  _|  | _||_|  ||_|',
      };
      const number = policyNumber.parseLines(lines);
      assert.equal(number, '012345678');
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
      assert.equal(number, '008008000');
    });
    it('should return "unable to parse"', function () {
      const policyNumber = new PolicyNumber();
      const lines = {
        0: '                           ',
        1: ' _  _  _  _  _  _  _  _  _', //this line has 26 characters
        2: '| || ||_|| || ||_|| || || |',
        3: '|_||_||_||_||_||_||_||_||_|',
      };
      const number = policyNumber.parseLines(lines);
      assert.equal(number, 'unable to parse');
    });
  });

  describe('parseDigit()', function () {
    const policyNumber = new PolicyNumber();
    it('should return 0', function () {
      let digit = policyNumber.parseDigit(rawDigits.ZERO);
      assert.equal(digit, 0);
    });
    it('should return 1', function () {
      let digit = policyNumber.parseDigit(rawDigits.ONE);
      assert.equal(digit, 1);
    });
    it('should return 2', function () {
      let digit = policyNumber.parseDigit(rawDigits.TWO);
      assert.equal(digit, 2);
    });
    it('should return 3', function () {
      let digit = policyNumber.parseDigit(rawDigits.THREE);
      assert.equal(digit, 3);
    });
    it('should return 4', function () {
      let digit = policyNumber.parseDigit(rawDigits.FOUR);
      assert.equal(digit, 4);
    });
    it('should return 5', function () {
      let digit = policyNumber.parseDigit(rawDigits.FIVE);
      assert.equal(digit, 5);
    });
    it('should return 6', function () {
      let digit = policyNumber.parseDigit(rawDigits.SIX);
      assert.equal(digit, 6);
    });
    it('should return 7', function () {
      let digit = policyNumber.parseDigit(rawDigits.SEVEN);
      assert.equal(digit, 7);
    });
    it('should return 8', function () {
      let digit = policyNumber.parseDigit(rawDigits.EIGHT);
      assert.equal(digit, 8);
    });
    it('should return 9', function () {
      let digit = policyNumber.parseDigit(rawDigits.NINE);
      assert.equal(digit, 9);
    });
  });
});
