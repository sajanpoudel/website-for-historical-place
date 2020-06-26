/* Connects Validate to a form: shows a message under every field that has a problem. */
(function (root) {
  'use strict';

  function readValues(doc, ids) {
    var values = {};
    ids.forEach(function (id) {
      var field = doc.getElementById(id);
      values[id === 'full-name' ? 'name' : id] = field ? field.value : '';
    });
    return values;
  }

  function showErrors(doc, ids, errors) {
    ids.forEach(function (id) {
      var key = id === 'full-name' ? 'name' : id;
      var slot = doc.getElementById(id + '-error');
      if (slot) slot.textContent = errors[key] || '';
    });
  }

  function attach(form, validate) {
    var doc = form.ownerDocument;
    var ids = validate.fieldIds;
    form.addEventListener('submit', function (event) {
      var errors = validate.validateContact(readValues(doc, ids));
      showErrors(doc, ids, errors);
      if (Object.keys(errors).length > 0) event.preventDefault();
    });
  }

  root.ContactForm = { attach: attach, readValues: readValues, showErrors: showErrors };
  if (typeof module === 'object' && module.exports) module.exports = root.ContactForm;
})(typeof window !== 'undefined' ? window : this);
