/* Adds a button that scrolls back to the top once the visitor has scrolled down a bit. */
(function (root) {
  'use strict';

  var THRESHOLD = 400;

  function shouldShow(scrollY) {
    return scrollY > THRESHOLD;
  }

  function attach(win) {
    var doc = win.document;
    var button = doc.createElement('button');
    button.type = 'button';
    button.className = 'back-to-top';
    button.textContent = 'Top';
    button.setAttribute('aria-label', 'Back to the top of the page');
    button.hidden = true;
    doc.body.appendChild(button);

    function update() {
      button.hidden = !shouldShow(win.scrollY);
    }

    win.addEventListener('scroll', update);
    button.addEventListener('click', function () {
      win.scrollTo(0, 0);
    });
    update();
    return button;
  }

  root.BackToTop = { attach: attach, shouldShow: shouldShow, THRESHOLD: THRESHOLD };
  if (typeof module === 'object' && module.exports) module.exports = root.BackToTop;
})(typeof window !== 'undefined' ? window : this);
