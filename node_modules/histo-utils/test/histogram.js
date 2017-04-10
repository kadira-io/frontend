var Histogram = require('../lib/histogram');
var assert = require('assert');

suite('Histogram', function() {
  suite('._getPercentile', function() {
    test('get percentile with direct index', function() {
      var h = new Histogram();
      var soretedPoints = [1, 2, 3, 4, 5, 6, 7,8, 9, 10];
      assert.equal(h._getPercentile(soretedPoints, 30), 3);
    });

    test('get percentile with not direct index', function() {
      var h = new Histogram();
      var soretedPoints = [1, 2, 3, 4, 5, 6, 7,8, 9, 10];
      assert.equal(h._getPercentile(soretedPoints, 25), 2.5);
    });

    test('get percentile with not direct index (but non full numbers)', function() {
      var h = new Histogram();
      var soretedPoints = [1, 2, 3, 4, 5, 6, 7,8, 9, 10];
      assert.equal(h._getPercentile(soretedPoints, 33), 3.5);
    });

    test('get the maximum percentile', function() {
      var h = new Histogram();
      var soretedPoints = [1, 2, 3, 4, 5, 6, 7,8, 9, 10];
      assert.equal(h._getPercentile(soretedPoints, 100), 10);
    });

    test('get the minimum percentile', function() {
      var h = new Histogram();
      var soretedPoints = [1, 2, 3, 4, 5, 6, 7,8, 9, 10];
      assert.equal(h._getPercentile(soretedPoints, 1), 1);
    });
  });

  suite('._getBinSize', function() {
    test('normal data set', function() {
      var h = new Histogram();
      var soretedPoints = [1, 2, 3, 4, 5, 6, 7,8, 9, 10];
      assert.equal(h._getBinSize(soretedPoints), 5);
    });

    test('data set of 500', function() {
      var h = new Histogram();
      var soretedPoints = [];
      for(var lc=1; lc<=500; lc++) {
        soretedPoints.push(lc);
      }
      assert.equal(h._getBinSize(soretedPoints), 63);
    });

    test('a huge data set', function() {
      var h = new Histogram();
      var soretedPoints = [];
      for(var lc=1; lc<=100000; lc++) {
        soretedPoints.push(lc);
      }
      assert.equal(h._getBinSize(soretedPoints), 2155);
    });

    test('a huge data set, but similar data', function() {
      var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      var h = new Histogram();
      var points = [];
      for(var lc=1; lc<=100000; lc++) {
        var point = lc % 10;
        points.push(data[point]);
      }

      var soretedPoints = points.sort(function(a, b) {
        return a - b;
      });

      assert.equal(h._getBinSize(soretedPoints), 1);
    });

    test('with some outliers', function() {
      var h = new Histogram();
      var soretedPoints = [1, 2, 3, 4, 5, 6, 7,8, 9, 10, 10000];
      assert.equal(h._getBinSize(soretedPoints), 6);
    });
  });

  suite('.build', function() {
    test('basic data set (sorted)', function() {
      var h = new Histogram();
      var points = [1, 2, 3, 4, 5, 6, 7,8, 9, 10];
      h.addPoints(points);
      var builtHistogram = h.build();
      assert.deepEqual(builtHistogram, {
        bins: [[1, 5], [6, 5]],
        binSize: 5
      });
    });

    test('basic data set (unsorted)', function() {
      var h = new Histogram();
      var points = [1, 2, 3, 4, 5, 6, 7,8, 9, 10].sort(function() {
        return Math.random() > 0.5 ? 1 : -1;
      });
      h.addPoints(points);
      var builtHistogram = h.build();
      assert.deepEqual(builtHistogram, {
        bins: [[1, 5], [6, 5]],
        binSize: 5
      });
    });

    test('data set with some outliers', function() {
      var h = new Histogram();
      var points = [0.00001, 1, 2, 3, 4, 5, 6, 7,8, 9, 10, 9999999].sort(function() {
        return Math.random() > 0.5 ? 1 : -1;
      });
      h.addPoints(points);
      var builtHistogram = h.build();
      assert.deepEqual(builtHistogram, {
        bins: [[0, 6], [6, 5], [9999999, 1]],
        binSize: 6
      });
    });
  });
});