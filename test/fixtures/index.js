'use strict';

module.exports = function(v) {
  if (v > 0) {
    return v;
  }
  if (v < 0) {
    return -v;
  }
  return 0;
};
