'use strict';

const fs = require('fs');
const Mustache = require('mustache');
const jmd = require('./jmd');


var append = function(a, i) {
  a[a.length] = i;
}

var scandir = function(target, type, cb, filter) {
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
        append(r, path);
        if (cb) {
          cb(path);
        }
      }
    }
  }
  return r;
}


var Manifest = function() {
}


var Compiler = function() {
  this.source_root = "source";
  this.templates_root = "templates"
  this.sources = [];
  this.single_sources = [];
  this.unhidden = [];
  this.items = {};
  this.item_counts = {};
  this.item_count = 0;
  this.templates = {};
  this.templates_list = [];
  this.manifests = {};
  this.template_cache = {};
  this.scaffold = {};
  this.scaffold.main = fs.readFileSync('scaffold/index.html.mst', {encoding: 'utf-8'});
  this.scaffold.partials = {};
  this.scaffold.partials.card = fs.readFileSync('scaffold/card.html.mst', {encoding: 'utf-8'});
  this.scaffold.partials.manifest = fs.readFileSync('scaffold/manifest.html.mst', {encoding: 'utf-8'});
  this.scaffold.partials.global_diagnostic = fs.readFileSync('scaffold/global_diagnostic.html.mst', {encoding: 'utf-8'});
  this.idpat = /^(\d+)/;
  this.namepat = /^(.+?)\./;
  this.default_manifest = {
    category: 1,
    template: 'default',
    cardtype: 'list'
  }
  this.default_ss_template = 'single';
};

Compiler.prototype.source_path = function(name) {
  return this.source_root + name;
}

Compiler.prototype.scan_source = function(path) {
  console.log("scanning source "+path)
  this.items[path] = [];
  scandir(path, 'file', (p) => {
    console.log("got item "+p)
    append(this.items[path], p);
  }, /^manifest/);
};

Compiler.prototype.scan_single_sources = function() {
  scandir(this.source_root, 'file', (p) => {
    console.log("got single source "+p);
    append(this.single_sources, p);
  }, /^manifest/);
};

Compiler.prototype.scan_sources = function() {
  scandir(this.source_root, 'dir', (p) => {
    console.log("got source " + p)
    this.scan_source(p);
    append(this.sources, p);
  });
};

Compiler.prototype.scan_templates = function() {
  var p;
  var name;
  scandir(this.templates_root, 'file', (t) => {
    name = t.split("/").splice(-1)[0];
    name = this.namepat.exec(name)[1];
    this.templates[name] = t;
    append(this.templates_list, name);
  });
}

Compiler.prototype.get_item_counts = function() {
  var source;
  var count;
  for (var i = 0; i < this.sources.length; i++) {
    source = this.sources[i];
    count = this.items[source].length;
    this.item_counts[source] = count;
    this.item_count += count;
  }
}

Compiler.prototype.parse_manifests = function() {
  var source;
  var manifest;
  for (var i = 0; i < this.sources.length; i++) {
    source = this.sources[i];
    manifest = source + "/" + "manifest.json.md";
    if (fs.existsSync(manifest)) {
      var data = fs.readFileSync(manifest);
      data = jmd(data);
      data = Object.assign({}, this.default_manifest, data);
      this.manifests[source] = data;
    } else {
      this.manifests[source] = this.default_manifest;
    }
  }
}

Compiler.prototype.write_manifest = function() {
  var manifest = {};
  manifest.single_sources = this.single_sources;
  manifest.sources = this.sources;
  manifest.items = this.items;
  manifest.item_counts = this.item_counts;
  manifest.templates = this.templates;
  manifest.manifests = this.manifests;
  manifest = JSON.stringify(manifest);
  fs.writeFileSync("source/manifest.json", manifest);
};

Compiler.prototype.write_index = function() {
  var c = {};
  c.cards = [];
  c.unhidden = [];
  c.manifest = {};
  c.manifest.sources = [];
  c.manifest.single_sources = [];
  c.manifest.templates = [];
  c.manifest.stats = [];
  c.manifest.flags = [];
  var source;
  var source_name;
  var items;
  var item;
  var data;
  var html;
  var links;
  var precompiled;
  var item_id;
  var anchor;
  var unhidden_pages = false;
  for (var i = 0; i < this.sources.length; i++) {
    source = this.sources[i];
    source_name = source.split("/").slice(-1)[0];
    items = this.items[source].slice(0, 5);
    links = [];
    precompiled = [];
    for (var n = 0; n < items.length; n++) {
      item = items[n];
      item_id = item.split("/").slice(-1)[0];
      item_id = this.idpat.exec(item_id)[1];
      anchor = item.split("/").slice(0, -1);
      anchor = `#/${anchor.join('/')}/${item_id}`
      console.log("item anchor: "+anchor);
      data = this.preparse(item);
      if (!data.slug) {data.slug = data.title;}
      data.id = item_id;
      data.origin = 'preloaded';
      data.source_path = item;
      data.hash_path = anchor;
      html = this.prerender(data, this.manifests[source].template);
      append(precompiled, {item: html});
    }
    items = this.items[source];
    for (var n = 0; n < items.length; n++) {
      item = items[n];
      item_id = item.split("/").slice(-1)[0];
      item_id = this.idpat.exec(item_id)[1];
      data = this.preparse(item);
      if (!data.slug) {data.slug = data.title;}
      append(links, {
        source: source_name,
        id: item_id,
        slug: data.slug
      });
    }
    append(c.cards, {
      path: source,
      source_name: source_name,
      source_title: this.manifests[source].title,
      category: this.manifests[source].category,
      links: links,
      precompiled: precompiled
    });
    append(c.manifest.sources, {
      category: this.manifests[source].category,
      item_count: this.item_counts[source],
      source_name: source_name,
      source_path: source,
      cardtype: this.manifests[source].cardtype,
      template: this.manifests[source].template
    });
  }
  var single_source;
  var single_source_name;
  for (var i = 0; i < this.single_sources.length; i++) {
    single_source = this.single_sources[i];
    single_source_name = single_source.split("/").slice(-1)[0];
    single_source_name = this.namepat.exec(single_source_name)[1];
    data = this.preparse(single_source);
    if (!data.template) {data.template = this.default_ss_template;}
    data.name = single_source_name;
    if (!data.hidden) {
      unhidden_pages = true;
      append(c.unhidden, {
        name: single_source_name,
        link: single_source
      });
    }
    html = this.prerender(data, data.template);
    append(c.manifest.single_sources, {
      source_name: single_source_name,
      source_path: single_source,
      template: data.template,
      html: html
    });
  }
  var template_path;
  var template_name;
  for (var i = 0; i < this.templates_list.length; i++) {
    template_name = this.templates_list[i];
    template_path = this.templates[template_name];
    append(c.manifest.templates, {
      template_path: template_path,
      template_name: template_name
    });
  }
  var comptime = Date.now() - this.start_time;
  append(c.manifest.stats, {
    name: "total_pages",
    value: this.single_sources.length
  });
  append(c.manifest.stats, {
    name: "total_sources",
    value: this.sources.length
  });
  append(c.manifest.stats, {
    name: "total_items",
    value: this.item_count
  });
  append(c.manifest.stats, {
    name: "compile_time",
    value: comptime
  });
  append(c.manifest.flags, {
    name: "unhidden_pages",
    value: unhidden_pages
  });
  c.stats = {
    total_pages: this.single_sources.length,
    total_sources: this.sources.length,
    total_items: this.item_count,
    compile_time: comptime
  };
  c.flags = {
    unhidden_pages: unhidden_pages
  };

  var index = Mustache.render(this.scaffold.main, c, this.scaffold.partials);
  fs.writeFileSync("index.html", index);
}

Compiler.prototype.get_template = function(template) {
  console.log("getting template: "+template);
  if (!this.templates[template]) {throw new Error("No such template: "+template);}
  var data = this.template_cache[template];
  if (!data) {
    var path = this.templates[template];
    data = fs.readFileSync(path, {encoding: 'utf-8'});
    this.template_cache[template] = data;
  }
  return data;
}

Compiler.prototype.preparse = function(path) {
  var data = fs.readFileSync(path);
  data = jmd(data);
  return data;
}

Compiler.prototype.prerender = function(data, template) {
  var html = Mustache.render(this.get_template(template), data);
  return html;
};

Compiler.prototype.scan = function() {
  this.scan_single_sources();
  this.scan_sources();
  this.scan_templates();
  this.get_item_counts();
  this.parse_manifests();
}

Compiler.prototype.compile = function() {
  this.start_time = Date.now();
  this.scan();
  console.log(this.templates);
  this.write_manifest();
  this.write_index();
};

var c = new Compiler;
c.compile();

module.exports = Compiler;
