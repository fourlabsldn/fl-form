/*global describe, it, expect, Exposer*/
describe('An fl-form should', function () {
  var formResponses = {
    success: {
      status: 200,
      responseText: "Oh yeah!",
    },
    failure: {
      status: 404,
      responseText: "Oh no",
    }
  };

  var fetchPromise;
  var request;
  onSuccess = jasmine.createSpy('onSuccess');
  onFailure = jasmine.createSpy('onFailure');


  beforeEach(function (done) {
    jasmine.Ajax.install();

    req = fetch('http://localhost/test')
    .then(onSuccess)
    .catch(onFailure);

    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(formResponses.success);
    done();
  });

  it("calls onSuccess with an array of Locations", function(done) {

    console.log(request.url);
    expect(request.url).toBe('http://localhost/test');
    expect(request.method).toBe('GET');
    
    req.then(function () {
      expect(onSuccess).toHaveBeenCalled();
      var onSuccessArgs = onSuccess.calls.mostRecent().args[0];
      done();
    })
  });
})
