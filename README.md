# fl-form

## Usage

``` html
  <x-div
    data-controller="path/to/fl-form"
    data-config="flFormConfigObj">
  </x-div>

  <script>
    var flFormConfigObj = {
      onLoad: function () {}, // Called when it is loaded for the first time
      onResponse: function (text, statusCode) {}, // Called whenever a response from a submit event arrives
      credentials: false, //If set to true, credentials are sent with fetch request
    }
  </script>
```

Run **npm start** to see the demo in action.

The `data-config` attribute is optional.

## Installation

**bower**

```
bower install fl-form --save
```

**npm**
```
npm install fl-form --save
```
**Download**

Just copy the `src/fl-form.js` file, and get [this](https://raw.githubusercontent.com/fourlabsldn/x-div/master/js/x-div.js) one as a dependency. Done.


The dependency is a Web Component, so check the [browser support](http://caniuse.com/#search=Custom%20Elements)
if you are taking it to production. You may need to use a [polyfill](http://webcomponents.org/polyfills/).
