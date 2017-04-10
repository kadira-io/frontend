var HistoUtils = require('../lib/index');
var assert = require('assert');

suite('HistoUtils.create', function() {
  test('create and build', function() {
    var h = new HistoUtils.create();
    var points = [1, 2, 3, 4, 5, 6, 7,8, 9, 10];
    h.addPoints(points);
    var builtHistogram = h.build();
    assert.deepEqual(builtHistogram, {
      bins: [[1, 5], [6, 5]],
      binSize: 5
    });
  }); 
});

suite('HistoUtils.merge', function() {
  test('merge histograms with same bins', function() {
    var a = {
      bins: [[100, 200], [200, 400], [300, 500]],
      binSize: 100
    };
    var b = {
      bins: [[100, 400], [200, 300], [300, 100]],
      binSize: 100
    };
    var expected = {
      bins: [[150, 600], [250, 700], [350, 600]],
      binSize: 33
    };

    var merged = HistoUtils.merge([a, b]);
    assert.deepEqual(merged, expected);
  }); 

  test('merge histograms with different bins', function() {
    var a = {
      bins: [[100, 200], [200, 400], [300, 500]],
      binSize: 100
    };
    var b = {
      bins: [[100, 400], [500, 344], [900, 844]],
      binSize: 100
    };
    var expected = {
      bins: [[150, 1000], [350, 500], [550, 344], [950, 844]],
      binSize: 101
    };

    var merged = HistoUtils.merge([a, b]);
    assert.deepEqual(merged, expected);
  }); 

  test("merge bins temporarly", function() {
    var a = {
      bins: [[100, 200], [200, 400], [300, 500]],
      binSize: 10
    };
    var b = {
      bins: [[100, 5500], [200, 300], [300, 100]],
      binSize: 100
    };
    var expectedBins = {
      bins: [ 
        [ 105, 200 ],
        [ 150, 5500 ],
        [ 205, 400 ],
        [ 250, 300 ],
        [ 305, 500 ],
        [ 350, 100 ] 
      ],
      count: 7000
    };

    var mergedBins = HistoUtils._mergeBins([a, b]);
    assert.deepEqual(mergedBins, expectedBins);
  });

  test("merge histograms with multiple bin sizes", function() {
    var a = {
      bins: [[100, 200], [200, 400], [300, 500]],
      binSize: 10
    };
    var b = {
      bins: [[100, 500], [200, 300], [300, 100]],
      binSize: 100
    };
    var expectedHistogram = {
      bins: [
        [105, 200], [150, 500], [205, 400],
        [250, 300], [305, 500], [350, 100]
      ],
      binSize: 25
    };

    var mergedHistogram = HistoUtils.merge([a, b]);
    assert.deepEqual(mergedHistogram, expectedHistogram);
  });
});

suite('HistoUtils.getPercentiles', function() {
  test('get one percentile', function() {
    var histogram = {
      bins: [[100, 200], [200, 400], [400, 200]],
      binSize: 100
    };
    var percentiles = HistoUtils.getPercentiles(histogram, [50]);
    assert.deepEqual(percentiles, {"50": 250});
  });

  test('get multiple percentile', function() {
    var histogram = {
      bins: [[100, 10], [200, 80], [300, 8], [400, 2]],
      binSize: 100
    };
    var percentiles = HistoUtils.getPercentiles(histogram, [50, 95, 99]);
    assert.deepEqual(percentiles, {
      "50": 250,
      "95": 362.5,
      "99": 450
    });
  });

  test('no perBin calculation', function() {
    var histogram = {
      bins: [[100, 200], [200, 400], [400, 200]],
      binSize: 100
    };
    var percentiles = HistoUtils.getPercentiles(histogram, [50], true);
    assert.deepEqual(percentiles, {"50": 200});
  });
});