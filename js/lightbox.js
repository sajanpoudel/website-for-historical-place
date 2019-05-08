/* Opens a gallery image in a full screen overlay. Click the overlay or press Escape to close it,
 * and use the arrow keys to move to the neighbouring photo. */
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
    var images = Array.prototype.slice.call(doc.querySelectorAll(selector));
    var current = -1;

    function show(index) {
      if (index < 0) return;
      current = index;
      var image = images[index];
      box.open(image.currentSrc || image.src, image.alt);
    }

    images.forEach(function (image, index) {
      image.addEventListener('click', function () {
        show(index);
      });
    });

    doc.addEventListener('keydown', function (event) {
      if (box.element.hidden) return;
      if (event.key === 'ArrowRight') show(neighbour(current, images.length, 1));
      if (event.key === 'ArrowLeft') show(neighbour(current, images.length, -1));
    });
    return box;
  }

  root.Lightbox = { create: create, attach: attach, neighbour: neighbour };
  if (typeof module === 'object' && module.exports) module.exports = root.Lightbox;
})(typeof window !== 'undefined' ? window : this);
