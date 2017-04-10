var _ = require('underscore');
var utils = require('./utils');
var Histogram = require('./histogram');

var HistoUtils = module.exports = {};
HistoUtils.create = function create() {
  return new Histogram();
};

HistoUtils.merge = function(histograms) {
  var mergedBins = HistoUtils._mergeBins(histograms);
  // here, we turn off perBinCalculation.
  // Which is fine since, we only need to pick IRQ
  var percentiles = HistoUtils.getPercentiles(mergedBins, [25, 75], true);
  var irq = percentiles["75"] - percentiles["25"];
  var binSize = utils.freedmanDiaconis(irq, mergedBins.count);

  var mergedHistogram = {
    bins: [],
    binSize: binSize
  };

  mergedBins.bins.forEach(function(bin) {
    var currentBin = mergedHistogram.bins[mergedHistogram.bins.length -1];
    if(!currentBin) {
      currentBin = createBin(bin[0]);
    } else if((currentBin[0] + binSize) <= bin[0]) {
      currentBin = createBin(bin[0]);
    }

    currentBin[1] += bin[1];
  });

  return mergedHistogram;

  function createBin(startValue) {
    startValue = Math.floor(startValue);
    var bin = [startValue, 0];
    mergedHistogram.bins.push(bin);
    return bin;
  }
};

HistoUtils._mergeBins = function _mergeBins(histograms) {
  // this is a set of bins with duplicate bins
  var tempBinMap = {};
  var count = 0;
  histograms.forEach(function(histogram) {
    histogram.bins.forEach(function(item) {
      var bin = item[0] + (histogram.binSize) / 2;
      var val = item[1];

      if(!tempBinMap[bin]) {
        tempBinMap[bin] = val;
      } else {
        tempBinMap[bin] += val;
      }

      count += val;
    });
  });

  var tempBins = [];
  var tempBinKeys = _.keys(tempBinMap).sort(function(a, b) {
    return a - b;
  });

  tempBinKeys.forEach(function(key) {
    tempBins.push([parseInt(key), tempBinMap[key]])
  });

  return {
    bins: tempBins,
    count: count
  };
};

/*
  noPerbinCalculation:
    if true, we get the starting point of the bin as the percentile.
    if false (default), we assume all the values in the bin spread equally.
      Then we'll find the binSize taken by per item and use that to calculate
      the percentile. 
      (We can later improve by storing the IQR distribution as an integer)
*/
HistoUtils.getPercentiles = 
function getPecentiles(histogram, percentiles, noPerbinCalculation) {
  var totalItems = 0;
  histogram.bins.forEach(function(item) {
    totalItems += item[1];
  });

  var percentileMapper = [];
  var donePercentiles = {};
  percentiles.forEach(function(percentile) {
    percentileMapper.push({
      p: percentile,
      i: Math.ceil((percentile/100) * totalItems)
    });
  });

  var itemsUpto = 0;
  histogram.bins.forEach(function(item) {
    var beginItems = itemsUpto;
    var endItems = itemsUpto = itemsUpto + item[1];

    checkForPercentile();
    function checkForPercentile() {
      var p = percentileMapper.shift();
      if(!p) {
        return;
      }

      if(p.i > beginItems && p.i <= endItems) {
        var percentileValue = item[0];
        if(!noPerbinCalculation) {
          var diff = p.i - beginItems;
          // assuming values are distributed equally inside the bin
          var binsPerItem = histogram.binSize / item[1];
          percentileValue = item[0] + (diff * binsPerItem);
        }

        donePercentiles[p.p] = percentileValue;
        checkForPercentile();
      } else {
        percentileMapper.unshift(p);
      }
    }

  });

  return donePercentiles;
};