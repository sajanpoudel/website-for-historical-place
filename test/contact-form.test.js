const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'contact.html'), 'utf8');

function load() {
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  const { window } = dom;
  const read = (file) => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  window.eval(read('js/validate.js'));
  window.eval(read('js/form.js'));
  window.eval('ContactForm.attach(document.querySelector(".form1"), Validate)');
  return window;
}

function submit(window) {
  const event = new window.Event('submit', { cancelable: true, bubbles: true });
  window.document.querySelector('.form1').dispatchEvent(event);
  return event;
}

function fill(window, values) {
  for (const [id, value] of Object.entries(values)) window.document.getElementById(id).value = value;
}

test('an empty form is blocked and every field shows a message', () => {
  const window = load();
  const event = submit(window);
  assert.equal(event.defaultPrevented, true);
  for (const id of ['full-name', 'address', 'phone', 'email']) {
    assert.notEqual(window.document.getElementById(`${id}-error`).textContent, '', id);
  }
});

test('a complete form is not blocked', () => {
  const window = load();
  fill(window, { 'full-name': 'Ada', address: 'Lumbini', phone: '9866656576', email: 'ada@example.com' });
  assert.equal(submit(window).defaultPrevented, false);
});
