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

test('isValidEmail rejects broken addresses', () => {
  for (const bad of ['', 'plain', 'a@b', '@x.com', 'a b@x.com', 'a@x.c']) {
    assert.equal(Validate.isValidEmail(bad), false, bad);
  }
});

test('isValidPhone accepts local and international numbers', () => {
  assert.equal(Validate.isValidPhone('9866656576'), true);
  assert.equal(Validate.isValidPhone('+977 986-665-6576'), true);
  assert.equal(Validate.isValidPhone('(064) 580 123'), true);
});

test('isValidPhone rejects short numbers and letters', () => {
  assert.equal(Validate.isValidPhone('12345'), false);
  assert.equal(Validate.isValidPhone('98666abc76'), false);
  assert.equal(Validate.isValidPhone(''), false);
  assert.equal(Validate.isValidPhone(null), false);
});

test('isValidPhone rejects numbers that are too long', () => {
  assert.equal(Validate.isValidPhone('1234567890123456'), false);
  assert.equal(Validate.isValidPhone('123456789012345'), true);
});

test('validateContact returns no errors for a complete form', () => {
  const errors = Validate.validateContact({
    name: 'Ada Lovelace',
    address: 'Lumbini, Nepal',
    phone: '9866656576',
    email: 'ada@example.com',
  });
  assert.deepEqual(errors, {});
});

test('validateContact reports every missing field', () => {
  const errors = Validate.validateContact({});
  assert.deepEqual(Object.keys(errors).sort(), ['address', 'email', 'name', 'phone']);
});
