var utils = require('./utils');

function Histogram() {
  this.points = [];
};

module.exports = Histogram;

Histogram.prototype.addPoints = function(newPoints) {
  for(var lc=0; lc<newPoints.length; lc++) {
    var point = newPoints[lc];
    this.points.push(point);
  }
};

Histogram.prototype.build = function() {
  var sortedPoints = this.points.sort(function(a, b) {
    return a - b;
  });

  var binSize = this._getBinSize(sortedPoints);
  var bins = [];

  sortedPoints.forEach(function(point) {
    var currentBin = bins[bins.length -1];
    if(!currentBin) {
      currentBin = createBin(point);
    } else if((currentBin[0] + binSize) <= point) {
      currentBin = createBin(point);
    }

    currentBin[1]++;
  });

  return {
    bins: bins,
    binSize: binSize
  };

  function createBin(startValue) {
    startValue = Math.floor(startValue);
    var bin = [startValue, 0];
    bins.push(bin);
    return bin;
  }
};

Histogram.prototype._getBinSize = function(sortedPoints, percentiles) {
  // uses Freedman–Diaconis rule: http://goo.gl/8K8mwB
  var p25 = this._getPercentile(sortedPoints, 25);
  var p75 = this._getPercentile(sortedPoints, 75);
  var iqr = p75 - p25;
  var n = sortedPoints.length;
  return utils.freedmanDiaconis(iqr, n);
};

Histogram.prototype._getPercentile = function getPercentile(sortedPoints, p) {
  var nthValue = (sortedPoints.length / 100 * p);
  var beforeIndex = Math.floor(nthValue) - 1;
  // to getting negative indexes
  beforeIndex = beforeIndex < 0 ? 0 : beforeIndex;
  var afterIndex = Math.ceil(nthValue) - 1;

  var percentile = (sortedPoints[beforeIndex] + sortedPoints[afterIndex]) / 2;
  return percentile;
}