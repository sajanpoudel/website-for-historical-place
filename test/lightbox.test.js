const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const read = (file) => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

function load() {
  const dom = new JSDOM(read('gallery.html'), { runScripts: 'outside-only' });
  dom.window.eval(read('js/lightbox.js'));
  dom.window.eval('Lightbox.attach(document, ".row-img")');
  return dom.window;
}

test('clicking an image opens the overlay with the same picture', () => {
  const window = load();
  const overlay = window.document.querySelector('.lightbox');
  assert.equal(overlay.hidden, true);
  const image = window.document.querySelector('.row-img');
  image.dispatchEvent(new window.Event('click'));
  assert.equal(overlay.hidden, false);
  assert.equal(overlay.querySelector('img').alt, image.alt);
});

test('clicking the overlay or pressing Escape closes it', () => {
  const window = load();
  const overlay = window.document.querySelector('.lightbox');
  const image = window.document.querySelector('.row-img');
  image.dispatchEvent(new window.Event('click'));
  overlay.dispatchEvent(new window.Event('click'));
  assert.equal(overlay.hidden, true);
  image.dispatchEvent(new window.Event('click'));
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(overlay.hidden, true);
});

test('neighbour wraps around at both ends', () => {
  const window = load();
  const { neighbour } = window.Lightbox;
  assert.equal(neighbour(0, 5, 1), 1);
  assert.equal(neighbour(4, 5, 1), 0);
  assert.equal(neighbour(0, 5, -1), 4);
  assert.equal(neighbour(2, 0, 1), -1);
});

test('the arrow keys move to the next and the previous photo', () => {
  const window = load();
  const overlay = window.document.querySelector('.lightbox');
  const images = window.document.querySelectorAll('.row-img');
  images[0].dispatchEvent(new window.Event('click'));
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight' }));
  assert.equal(overlay.querySelector('img').alt, images[1].alt);
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  assert.equal(overlay.querySelector('img').alt, images[images.length - 1].alt);
});

test('the arrow keys do nothing while the lightbox is closed', () => {
  const window = load();
  const overlay = window.document.querySelector('.lightbox');
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight' }));
  assert.equal(overlay.hidden, true);
});
