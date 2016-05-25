/* eslint-env jasmine */
import FlForm from '../../src/FlForm';

describe('An instance of FlForm should', () => {
  it('be created without throwing an error', () => {
    expect(() => {
      return new FlForm(document.createElement('div'));
    }).not.toThrow();
  });
});
