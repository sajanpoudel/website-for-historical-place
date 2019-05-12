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

  return { isNotBlank: isNotBlank, isValidEmail: isValidEmail };
});
