# fl-form

## Usage

``` html
  <x-div
    data-controller="path/to/fl-form"
    data-content="path/to/form.html"
    data-options="optionsObj">
  </x-div>

  <script>
    var optionsObj = {
      onLoad: function () {}, //Called when it is loaded for the first time
      onResponse: function (responseText) {}, //Called whenever a response from a submit event arrives.
    }
  </script>
```

Run **npm start** to see the demo in action.

The `data-options` attribute is optional.

## Installation

**Download**

Just copy the `src/fl-form.js` file, and get [this](https://raw.githubusercontent.com/fourlabsldn/x-div/master/js/x-div.js) one as a dependency. Done.


The dependency is a Web Component, so check the [browser support](http://caniuse.com/#search=Custom%20Elements)
if you are taking it to production. You may need to use a [polyfill](http://webcomponents.org/polyfills/).
