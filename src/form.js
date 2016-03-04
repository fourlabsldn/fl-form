xController(function (rootEl) {
  rootEl.style.minWidth = '50px';
  rootEl.style.minHeight = '50px';
  rootEl.style.backgroundColor = 'red';

  rootEl.addEventListener('submit', function (e) {
    e.preventDefault();

    var form = e.target || rootEl.querySelector('form');
    if (!form) {
      throw new Error('Submit event was fired without a form element.');
    }

    var target = '/api/' + form.getAttribute('action') || '/api/test';

    var config = {};
    config.method = form.getAttribute('method') || 'POST';
    if (config.method.toUpperCase() === 'POST') {
      config.body = new FormData(form);
    }

    fetch(target, config)
    .then(function (response) {
      response.json();
    })
    .then(function (text) {
      console.log(text);
    })
    .catch(function (err) {
      console.error('Error submitting form:' + err);
    });
  }, true);
});
