/* Opens a gallery image in a full screen overlay. Click the overlay or press Escape to close it. */
(function (root) {
  'use strict';

  // Index of the neighbour of position `index` in a list of `length` items, wrapping around at both ends.
  function neighbour(index, length, step) {
    if (length <= 0) return -1;
    return (index + step + length) % length;
  }

  function create(doc) {
    var overlay = doc.createElement('div');
    overlay.className = 'lightbox';
    overlay.hidden = true;
    var big = doc.createElement('img');
    big.alt = '';
    overlay.appendChild(big);
    doc.body.appendChild(overlay);

    function close() {
      overlay.hidden = true;
    }

    function open(source, text) {
      big.src = source;
      big.alt = text || '';
      overlay.hidden = false;
    }

    overlay.addEventListener('click', close);
    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') close();
    });
    return { open: open, close: close, element: overlay };
  }

  function attach(doc, selector) {
    var box = create(doc);
    Array.prototype.forEach.call(doc.querySelectorAll(selector), function (image) {
      image.addEventListener('click', function () {
        box.open(image.currentSrc || image.src, image.alt);
      });
    });
    return box;
  }

  root.Lightbox = { create: create, attach: attach, neighbour: neighbour };
  if (typeof module === 'object' && module.exports) module.exports = root.Lightbox;
})(typeof window !== 'undefined' ? window : this);
