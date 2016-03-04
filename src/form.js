xController(function (rootEl) {
  src = rootEl.dataset.src;

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
   * @return {Promise}      will resolve with the content of the response.
   */
  function sendForm(url, form) {
    if (typeof url !== 'string') {
      throw Error('sendForm: Invalid url parameter.');
    } else if (!form || form.tagName !== 'FORM') {
      throw Error('sendForm: Form parameter invalid.');
    }

    var target = form.getAttribute('action');

    //------------ TEST CODE ------------------//
    target = '/api/' + (target || ''); //jscs ignore:line
    //-------- END OF TEST CODE ---------------//


    var config = {
      method: form.getAttribute('method') || 'GET',
      mode: 'cors',
      cache: 'default',
    };

    if (config.method.toUpperCase() === 'POST') {
      config.body = new FormData(form);
    }

    return fetch(target, config)
      .then(function (response) {
        response.json();
      })
      .then(function (text) {
      return  console.log(text);
      })
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
    fetch(url, { method: 'GET' })
    .then(function (res) {

      //add it to the target element.
      return res.text();
    })
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
    if (!el.dataset.content) {
      console.error('init(): No content parameter found.');
      return;
    }

    load(contentUrl, el);

    el.addEventListener('submit', function (e) {
      e.preventDefault();

      var form = e.target;
      if (container.tagName !== 'FORM') {
        throw new Error('Submit event was fired without a form element.');
      }
    }, true);
  }

  init(rootEl);
});
