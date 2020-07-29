const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'backtotop.js'), 'utf8');

function load() {
  const dom = new JSDOM('<!doctype html><html><body><p>Page</p></body></html>', { runScripts: 'outside-only' });
  dom.window.eval(source);
  return dom.window;
}

test('the button only shows after scrolling past the threshold', () => {
  const { BackToTop } = load();
  assert.equal(BackToTop.shouldShow(0), false);
  assert.equal(BackToTop.shouldShow(BackToTop.THRESHOLD), false);
  assert.equal(BackToTop.shouldShow(BackToTop.THRESHOLD + 1), true);
});

test('attach adds a hidden button that scrolls to the top when clicked', () => {
  const window = load();
  let target;
  window.scrollTo = (x, y) => { target = [x, y]; };
  const button = window.BackToTop.attach(window);
  assert.equal(button.hidden, true);
  button.dispatchEvent(new window.Event('click'));
  assert.deepEqual(target, [0, 0]);
});
