/* Small form checks shared by the contact and login pages.
 * Works in the browser (global Validate) and in Node (module.exports) so it can be tested. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.Validate = api;
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  function isNotBlank(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function isValidEmail(value) {
    return typeof value === 'string' && EMAIL.test(value.trim());
  }

  function isValidPhone(value) {
    if (typeof value !== 'string') return false;
    var digits = value.replace(/[\s().-]/g, '');
    return /^\+?[0-9]{7,15}$/.test(digits);
  }

  // Returns an object that maps a field name to its error message. It is empty when all is fine.
  function validateContact(values) {
    var errors = {};
    if (!isNotBlank(values.name)) errors.name = 'Please enter your full name.';
    if (!isNotBlank(values.address)) errors.address = 'Please enter your address.';
    if (!isValidPhone(values.phone)) errors.phone = 'Please enter a valid phone number.';
    if (!isValidEmail(values.email)) errors.email = 'Please enter a valid email address.';
    return errors;
  }

  return { isNotBlank: isNotBlank, isValidEmail: isValidEmail, isValidPhone: isValidPhone, validateContact: validateContact };
});
