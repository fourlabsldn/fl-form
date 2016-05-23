// ============================================================================
//
//
//    This file is deprecated.
//    The new version uses ES6 and is in the dist folder.
//
//
// ============================================================================


/*globals FormData,  fetch, xController, Promise*/

//TODO: get Polyfills for all dependencies
xController(function (rootEl) {
  var configDefaults = {
    onLoad: function () {},
    onResponse: function () {},
    credentials: 'omit',
  };
  var config;

  /**
   * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
   * @param obj1
   * @param obj2
   * @returns {Object} a new object based on obj1 and obj2
   */
  function mergeOptions(obj1, obj2) {
    var obj3 = {};

    for (var attrname in obj1) {
      obj3[attrname] = obj1[attrname];
    }

    for (var attrname in obj2) {
      obj3[attrname] = obj2[attrname];
    }

    return obj3;
  }

  /**
  * Insert content into a container
  * @function render
   * @param  {String} content
   * @param  {HTMLElement} container
   * @return {void}
   */
  function render(content, container) {
    if (!container) {
      console.error('render(): No container provided');
      return;
    }

    container.innerHTML = content;
  }

  /**
   * Sends the content of a form to a url endpoint
   * @function sendForm
   * @param  {String} url
   * @param  {HTMLElement} form
   * @return {Promise}      will resolve with the text content of the response.
   */
  function sendForm(url, form) {
    if (typeof url !== 'string') {
      throw Error('sendForm: Invalid url parameter.');
    } else if (!form || form.tagName !== 'FORM') {
      throw Error('sendForm: Form parameter invalid.');
    }

    var target = form.getAttribute('action');

    var fetchOptions = {
      method: form.getAttribute('method') || 'GET',
      mode: config.credentials === 'omit' ? 'cors' : 'same-origin',
      credentials: config.credentials,
      cache: 'default',
    };

    if (fetchOptions.method.toUpperCase() === 'POST') {
      fetchOptions.body = new FormData(form);
    }

    return fetch(target, fetchOptions)
      .catch(function (err) {
        console.error('sendForm: Error submitting form:' + err);
        return Promise.reject(err);
      })
    ;
  }

  /**
   * Loads an html content fetched from a url into a target element.
   * @function load
   * @param  {String} url    [description]
   * @param  {HTMLElement} target [description]
   * @return {void}        [description]
   */
  function load(url, target) {

    // get content
    return fetch(url, { method: 'GET' })
      .then(function (response) {
        render(response.text(), target);
      })
      .catch(function () {
        console.err('load(): Error fetching URL.');
      })
    ;
  }

  //Set event listeners and merge config
  function init(el) {
    // Grab optional config object
    let configOverride = window[el.dataset.config];
    if (typeof configOverride !== 'object') {
      configOverride = {};
    }
    config = mergeOptions(configDefaults, configOverride);

    if(['omit', 'same-origin'].indexOf(config.credentials) === -1) {
      throw new Error('Invalid value for credentials');
    }

    el.addEventListener('submit', function (e) {
      e.preventDefault();

      var form = e.target;
      if (form.tagName !== 'FORM') {
        throw new Error('Submit event was fired without a form element.');
      }

      sendForm(form.getAttribute('action'), form)
        .then(function (response) {

          if(typeof response === 'object') {
            response.text().then((html) => {
              render(html, el)
              config.onResponse(html, response.status, el);
            });
          } else {
            render(text, el);
            config.onResponse(text, response.status, el);
          }
        })
      ;

    }, true);

    config.onLoad(el);
  }

  init(rootEl);
});