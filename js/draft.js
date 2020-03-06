/* Keeps what a visitor typed in the contact form, so a reload or a closed tab does not lose it. */
(function (root) {
  'use strict';

  var KEY = 'lumbini-contact-draft';

  function save(storage, values) {
    try {
      storage.setItem(KEY, JSON.stringify(values));
    } catch (error) {
      // Storage can be full or blocked. The form still works without a draft.
    }
  }

  function load(storage) {
    try {
      var text = storage.getItem(KEY);
      var values = text ? JSON.parse(text) : {};
      return values && typeof values === 'object' ? values : {};
    } catch (error) {
      return {};
    }
  }

  function clear(storage) {
    try {
      storage.removeItem(KEY);
    } catch (error) {
      // Nothing to remove.
    }
  }

  // Fills the fields from the saved draft and saves again whenever one of them changes.
  function attach(form, storage) {
    var fields = Array.prototype.slice.call(form.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]'));
    var saved = load(storage);
    fields.forEach(function (field) {
      if (typeof saved[field.id] === 'string') field.value = saved[field.id];
      field.addEventListener('input', function () {
        var values = {};
        fields.forEach(function (f) {
          values[f.id] = f.value;
        });
        save(storage, values);
      });
    });
    form.addEventListener('submit', function () {
      clear(storage);
    });
  }

  root.Draft = { save: save, load: load, clear: clear, attach: attach, KEY: KEY };
  if (typeof module === 'object' && module.exports) module.exports = root.Draft;
})(typeof window !== 'undefined' ? window : this);
