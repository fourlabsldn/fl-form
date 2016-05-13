/* globals xController */
import FlForm from './FlForm';
import assert from '../node_modules/fl-assert/dist/assert.js';

xController((xdiv) => {
  assert(xdiv && xdiv.nodeName, 'Invalid x-div element given.');
  const configGlobalName = xdiv.dataset.config;
  const config = window[configGlobalName];
  const flForm = new FlForm(xdiv, config); // eslint-disable-line no-unused-vars
});
