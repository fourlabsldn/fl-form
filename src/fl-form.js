/*globals FormData,  fetch, xController, Promise*/

//TODO: get Polyfills for all dependencies
xController(function (rootEl) {
  var config;

  require('moment');

  /**
   * @function getText
   * @param  {Response Object} res [https://developer.mozilla.org/en-US/docs/Web/API/Response]
   * @return {String}
   */
  function getText(res) {
    return res.text();
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

    var config = {
      method: form.getAttribute('method') || 'GET',
      mode: 'cors',
      cache: 'default',
    };

    if (config.method.toUpperCase() === 'POST') {
      config.body = new FormData(form);
    }

    return fetch(target, config)
      .then(getText)
      .catch(function (err) {
        console.error('sendForm: Error submitting form:' + err);
        return Promise.reject(err);
      });
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
    .then(getText)
    .then(function (res) {
      render(res, target);
    })
    .catch(function () {
      console.err('load(): Error fetching URL.');
    });
  }

  //Set event listeners
  function init(el) {
    var contentUrl = el.dataset.content;
    config = el.dataset.config || {};

    if (!el.dataset.content) {
      console.error('init(): No content parameter found.');
      return;
    }

    load(contentUrl, el)
    .then(function () {
      if (config.onLoad) {
        config.onLoad();
      }
    });

    el.addEventListener('submit', function (e) {
      e.preventDefault();

      var form = e.target;
      if (form.tagName !== 'FORM') {
        throw new Error('Submit event was fired without a form element.');
      }

      sendForm(form.getAttribute('action'), form)
      .then(function (text) {
        render(text, el);
        if (config.onResponse) {
          config.onResponse(text);
        }
      });

    }, true);
  }

  init(rootEl);
});
