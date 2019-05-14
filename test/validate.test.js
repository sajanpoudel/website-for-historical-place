const test = require('node:test');
const assert = require('node:assert/strict');
const Validate = require('../js/validate.js');

test('isNotBlank accepts text', () => {
  assert.equal(Validate.isNotBlank('Ada'), true);
});

test('isNotBlank rejects empty and whitespace only values', () => {
  assert.equal(Validate.isNotBlank(''), false);
  assert.equal(Validate.isNotBlank('   '), false);
});

test('isNotBlank rejects values that are not text', () => {
  assert.equal(Validate.isNotBlank(null), false);
  assert.equal(Validate.isNotBlank(undefined), false);
  assert.equal(Validate.isNotBlank(42), false);
});

test('isValidEmail accepts normal addresses', () => {
  assert.equal(Validate.isValidEmail('techguys@gmail.com'), true);
  assert.equal(Validate.isValidEmail(' first.last@mail.example.org '), true);
});
