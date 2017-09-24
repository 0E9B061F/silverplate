'use strict';

if (typeof window === 'undefined') {
  var marked = require('marked');
}


var parse_md = function(text) {
  console.log("parsed markdown");
  return marked(text);
}

var parse_sections = function(body) {
  var e = true;
  var spat = /^!!! (.+)$([\s\S]*?)(?=^!!!)/gm;
  var list = [];
  var hash = {};
  var rc = 0;
  var has_sections = false;
  var body_section = "";
  while (e) {
    var e = spat.exec(body);
    if (e) {
      has_sections = true;
      var name = e[1];
      var parsed = parse_md(e[2]);
      if (name == "body") {
        body_section = parsed;
      } else {
        hash[name] = parsed;
        list[rc] = {"name": name, "text": parsed};
        rc++;
      }
    }
  }
  if (has_sections) {
    return [body_section, list, hash];
  } else {
    body = parse_md(body);
    return [body, list, hash];
  }
}

var parse_jmd = function(text) {
  var fmpat = /^\{\{\{$([\s\S]*?)^\}\}\}$/m;
  var bpat = /^\}\}\}$([\s\S]*)$/m;
  var data = {};
  var e = fmpat.exec(text);
  if (e) {
    console.log("got frontmatter");
    data = "{\n" + e[1] + "\n}";
    data = JSON.parse(data);
    var b = bpat.exec(text);
    if (b) {
      var [body, section_list, sections] = parse_sections(b[1]);
      data.body = body;
      data.section_list = section_list;
      data.sections = sections;
    }
  } else {
    console.log("no frontmatter: "+ e);
    data.body = text;
  }
  return data;
}

if (typeof window === 'undefined') {
  module.exports = parse_jmd;
}
