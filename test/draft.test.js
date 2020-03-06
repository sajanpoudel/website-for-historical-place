const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const read = (file) => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value); },
    removeItem: (key) => { delete data[key]; },
    data,
  };
}

function load(storage) {
  const dom = new JSDOM(read('contact.html'), { runScripts: 'outside-only' });
  dom.window.eval(read('js/draft.js'));
  dom.window.storage = storage;
  dom.window.eval('Draft.attach(document.querySelector(".form1"), storage)');
  return dom.window;
}

test('typing saves the fields as a draft', () => {
  const storage = memoryStorage();
  const window = load(storage);
  const name = window.document.getElementById('full-name');
  name.value = 'Ada';
  name.dispatchEvent(new window.Event('input'));
  const { Draft } = window;
  assert.equal(Draft.load(storage)['full-name'], 'Ada');
});

test('a saved draft fills the form again', () => {
  const draft = JSON.stringify({ 'full-name': 'Ada', address: 'Kathmandu' });
  const window = load(memoryStorage({ 'lumbini-contact-draft': draft }));
  assert.equal(window.document.getElementById('full-name').value, 'Ada');
  assert.equal(window.document.getElementById('address').value, 'Kathmandu');
});

test('submitting the form clears the draft', () => {
  const storage = memoryStorage({ 'lumbini-contact-draft': '{"address":"x"}' });
  const window = load(storage);
  window.document.querySelector('.form1').dispatchEvent(new window.Event('submit', { cancelable: true }));
  assert.equal(storage.getItem('lumbini-contact-draft'), null);
});

test('broken storage content is ignored', () => {
  const storage = memoryStorage({ 'lumbini-contact-draft': '{not json' });
  const window = load(storage);
  assert.equal(window.document.getElementById('full-name').value, '');
});
