exports.freedmanDiaconis = function freedmanDiaconis(iqr, n) {
  return Math.ceil(2 * iqr * Math.pow(n,-1/3));
};