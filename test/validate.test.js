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
