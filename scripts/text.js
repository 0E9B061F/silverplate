'use strict';

const AVGWPM  = 200;
const AVGPAGE = 300;

module.exports = {
  wpm: function(words) {
    var minutes = words / AVGWPM;
    var string;
    if (minutes < 2) {
      string = "Very short";
    } else if (minutes < 5) {
      string = "Short";
    } else if (minutes < 60) {
      console.log(minutes)
      var minutes = Math.round(minutes / 5) * 5;
      if (minutes < 1) {
        minutes = 5;
      }
      string = "About "+minutes+" minutes";
    } else {
      var hours = minutes / 60;
      hours = hours.toFixed(1);
      var tz = /0+$/;
      var td = /\.$/;
      string = "About "+hours+" hours";
    }
    return string;
  },

  pages: function(words) {
    var pg = words / AVGPAGE;
    pg = pg.toFixed(1)
    if (pg == 1) {
      pg = `~${pg} page`
    } else {
      pg = `~${pg} pages`
    }
    return pg;
  }
}
