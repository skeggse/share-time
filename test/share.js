var share = require('..');

// does nothing if duration === undefined
function hang(duration) {
  for (var end = Date.now() + duration; Date.now() < end; );
}

describe('share', function() {
  it('should finish immediately', function(done) {
    var initial = true;
    share(new Array(8), 100, function(n, i, array) {
      expect(n).to.equal(undefined);
      expect(array).to.be.an.instanceof(Array);
    }, function(time) {
      expect(initial).to.be.ok;
      done();
    });
    initial = false;
  });

  it('should set the context', function() {
    var obj = {}, first = false, second = false;

    share([,], 100, function() {
      expect(this).to.equal(obj);
      first = true;
    }, obj);

    share([,], 100, function() {
      expect(this).to.equal(global);
      second = true;
    });

    expect(first).to.be.ok;
    expect(second).to.be.ok;
  });

  it('should run one at a time', function(done) {
    var already = false, next = 0;
    share(new Array(8), 5, function(n, index) {
      expect(index).to.equal(next++);
      expect(already).to.not.be.ok;
      already = true;
      process.nextTick(function() {
        already = false;
      });
      hang(8);
    }, function() {
      expect(next).to.equal(8);
      done();
    });
  });

  it('should run two at a time', function(done) {
    var current = false, next = 0, start = Date.now();
    share(new Array(8), 8, function(n, index) {
      expect(index).to.equal(next++);
      expect(current).to.be.within(0, 1);
      (current++) &&
      process.nextTick(function() {
        current = 0;
      });
      hang(5);
    }, function(time) {
      expect(next).to.equal(8);
      expect(time).to.be.at.least(5 * 8).and.to.be.at.most(Date.now() - start);
      done();
    });
  });
});
