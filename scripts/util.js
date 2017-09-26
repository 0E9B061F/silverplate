'use strict';

const fs = require('fs-extra');


var util = {};


util.read = function(path)  {
  return fs.readFileSync(path, {encoding: 'utf-8'});
}

util.append = function(a, i) {
  a[a.length] = i;
}

util.scandir = function(target, type, cb, filter) {
  var files = fs.readdirSync(target);
  var file;
  var path;
  var r = [];
  for (var i = 0; i < files.length; i++) {
    file = files[i];
    path = target + "/" + file;
    var stats = fs.statSync(path);
    if ((type == "dir" && stats.isDirectory()) || (type == "file" && stats.isFile())) {
      if (!filter || !filter.test(file)) {
        util.append(r, path);
        if (cb) { cb(path); }
      }
    }
  }
  return r;
}


module.exports = util;
