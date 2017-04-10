# histo-utils

A set of utilities to create, merge and manage histograms.

## Installaton

~~~js
npm i --save histo-utils
~~~

## Building a histogram

~~~js
var HistoUtil = require('histo-utils');
var histoBuilder = HistoUtils.create();
histoBuilder.addPoints([10, 20]);
histoBuilder.addPoints([30, 40, 50]);

// build the histogram
var histogram = histoBuilder.build();
console.log(histogram);
// output => { bins: [ [ 10, 3 ], [ 40, 2 ] ], binSize: 24 }
~~~

## Merging Histograms

Merging Histograms. This don't gives us perfect histogram compared with a one generated with rawData. But still, this works pretty well if you can't store raw data.

~~~js
var histogramOne = { 
    bins: [ [ 10, 3 ], [ 40, 2 ] ], 
    binSize: 24 
};
var histogramTwo = { 
    bins: [ [ 10, 4 ], [ 50, 2 ] ], 
    binSize: 32 
};

var merged = HistoUtils.merge([histogramOne, histogramTwo]);
console.log(merged);
// output => { bins: [ [ 22, 7 ], [ 52, 4 ] ], binSize: 27 }
~~~

## Calculating Percentiles

Currently, percentile is the starting point of the bin. But, we can improve this once we stored the skewness for each bin along with the frequency.

~~~js
var histogram = { 
    bins: [ [ 10, 30 ], [20, 40], [ 40, 20 ], [80, 20], [99999, 1] ], 
    binSize: 24 
};

var percentiles = HistoUtils.getPercentiles(histogram, [50, 95, 99]);
console.log(percentiles);
// output => { '50': 20, '95': 80, '99': 80 }
~~~
