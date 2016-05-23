import assert from '../node_modules/fl-assert/dist/assert.js';

export default class FlForm {
  constructor(xdiv, config = {}) {
    assert(xdiv && xdiv.nodeName, 'No x-div element provided.');
    this.xdiv = xdiv;

    // Apply configurations
    this.config = config;
    this.setConfigurations(config);

    // Setup event listeners
    this.setupEventListeners();

    // trigger load event
    this.loadInitialContent()
    .then(() => {
      this.config.onLoad(xdiv);
    });
  }

  loadInitialContent(config = this.config) {
    const url = typeof config.load === 'string' ? config.load : undefined;

    if (!url) { return Promise.resolve(); }

    return this.sendRequest(url, 'get')
    .then(res => this.processFormResponse(res))
    .catch(err => assert.warn(false, err));
  }

  /**
   * @method submitForm
   * @param  {HTMLElement} form - The form element to be submitted.
   * @return {Promise}  - A promise to be resolved with the response content
   * 												when the form submission response arrive
   * 												or with null if there is no submission URL.
   */
  submitForm(form) {
    // Check that a valid element triggered the submit event.
    assert(form.tagName === 'FORM', 'Submit event was fired without a form element.');

    const url = form.getAttribute('action');
    if (!url) { return Promise.reject('No target url in form.'); }

    // Prepare request options
    const method = form.getAttribute('method') || 'GET';
    const body = method.toUpperCase() === 'POST' ? new FormData(form) : undefined;

    return this.sendRequest(url, method, body);
  }

  processFormResponse(response, status) {
    // If we have a response object rather than plain text,
    // then come back when we have plain text.
    if (response instanceof Response) {
      response.text()
        .then(text => {
          this.processFormResponse(text, response.status);
        });
      return;
    }

    // Render to the DOM
    this.renderContent(response);

    // Announce that we are finished.
    this.config.onResponse(response, status, this.xdiv);
  }

  setConfigurations(config = this.config) {
    assert(typeof config === 'object', 'Invalid configuration object');

    this.config.onLoad = (typeof config.onLoad !== 'function')
      ? () => null
      : this.config.onLoad;

    this.config.onResponse = (typeof config.onResponse !== 'function')
      ? () => null
      : this.config.onResponse;

    this.config.credentials = config.credentials ? 'include' : '';
    this.config.mode = config.credentials ? 'cors' : 'same-origin';
  }

  setupEventListeners(xdiv = this.xdiv) {
    xdiv.addEventListener('submit', (e) => {
      // Let's not allow the page to reload
      e.preventDefault();

      // Now we just submit and process the reponse
      const form = e.target;
      this.submitForm(form)
        .then(res => this.processFormResponse(res))
        .catch(err => assert.warn(false, err));
    });
  }

  renderContent(content, xdiv = this.xdiv) {
    xdiv.innerHTML = content;
  }

  sendRequest(url, method, body, config = this.config) {
    // Prepare request options
    const headers = new Headers({ 'X-Requested-With': 'fetch' });
    const fetchOptions = {
      method,
      body,
      headers,
      cache: 'default',
      mode: config.mode,
      credentials: config.credentials,
    };

    // Send request
    return fetch(url, fetchOptions);
  }
}
