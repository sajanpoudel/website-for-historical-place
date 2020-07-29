const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter((name) => name.endsWith('.html'));

// Local targets of href and src attributes, without anchors, queries and absolute URLs.
function localTargets(html) {
  const targets = [];
  const pattern = /(?:href|src)="([^"]+)"/g;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const value = match[1].split('#')[0].split('?')[0];
    if (value && !/^(?:[a-z]+:|\/\/)/i.test(value)) targets.push(value);
  }
  return targets;
}

// Images are not part of the repository, so only pages, scripts and styles are checked.
const checked = (target) => /\.(?:html|js|css)$/.test(target);

for (const page of pages) {
  test(`${page} links to files that exist`, () => {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    for (const target of localTargets(html).filter(checked)) {
      assert.ok(fs.existsSync(path.join(root, target)), `${page} points to missing ${target}`);
    }
  });
}

test('every page can be reached from the home page navigation', () => {
  const home = fs.readFileSync(path.join(root, 'lumbini.html'), 'utf8');
  const linked = new Set(localTargets(home));
  for (const page of pages) {
    if (page === 'login.html') continue;
    assert.ok(linked.has(page), `${page} is not linked from lumbini.html`);
  }
});
