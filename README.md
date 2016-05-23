# fl-form
## Goals of fl-form
- Send a form and receive response without reloading the page.
- Be able to intercept a form submission.
- Be able to intercept a response from a form submission.

## Usage

``` html
  <x-div
    data-controller="path/to/fl-form"
    data-config="flFormConfig">
  </x-div>

  <script>
    var flFormConfig = {
      load: '/path/to/myForm.html', // Will be fetched when element is created
      onLoad: function (xdiv) {}, // Called when it is loaded for the first time
      onResponse: function (text, statusCode, xdiv) {}, // Called whenever a response from a submit event arrives
      credentials: false, //If set to true, credentials (cookies) are sent with fetch request
    }
  </script>
```

Run **npm start** to see the demo in action.

The `data-config` attribute is optional.

## Developing
### Dev with livereload
```
npm start dev
```

### Demo with livereload
```
npm start demo
```
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
