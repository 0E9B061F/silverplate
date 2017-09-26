'use strict';

const fs = require('fs-extra');
const _path = require('path');
const pj = _path.join;
const Mustache = require('mustache');
const jmd = require('./jmd');
const u = require('./util');
const env = require('./env');


const Manifest = function() {
}


var Compiler = function(target = "source", output = "build") {
  this.source_root = target;

  this.output_source_name = 'source';
  this.user_templates_name = '_templates_';

  this.path = {};
  this.path.templates = {};
  this.path.templates.root = "templates";
  this.path.templates.user = pj(this.source_root, this.user_templates_name);
  this.path.templates.index = {};
  this.path.templates.index.root = pj(this.path.templates.root, 'index');
  this.path.templates.index.main = pj(this.path.templates.index.root, 'index.html.mst');
  this.path.templates.index.card = pj(this.path.templates.index.root, 'card.html.mst');
  this.path.templates.index.diag = pj(this.path.templates.index.root, 'global_diagnostic.html.mst');
  this.path.templates.index.manifest = pj(this.path.templates.index.root, 'manifest.html.mst');
  this.path.templates.content = pj(this.path.templates.root, 'content');
  this.path.output = {};
  this.path.output.root = output;
  this.path.output.index = pj(this.path.output.root, 'index.html');
  this.path.output.source = pj(this.path.output.root, this.output_source_name);
  this.path.output.vendor = pj(this.path.output.root, 'vendor');
  this.path.output.templates = pj(this.path.output.root, 'templates');

  this.scaffold = {};
  this.scaffold.main = u.read(this.path.templates.index.main);
  this.scaffold.partials = {};
  this.scaffold.partials.card = u.read(this.path.templates.index.card);
  this.scaffold.partials.manifest = u.read(this.path.templates.index.manifest);
  this.scaffold.partials.global_diagnostic = u.read(this.path.templates.index.diag);

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

  this.idpat = /^(\d+)/;
  this.namepat = /^(.+?)\./;
  this.uspat = /^_.+_$/;

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
  u.scandir(path, 'file', (p) => {
    console.log("got item "+p)
    u.append(this.items[path], p);
  }, /^manifest/);
};

Compiler.prototype.scan_single_sources = function() {
  u.scandir(this.source_root, 'file', (p) => {
    console.log("got single source "+p);
    u.append(this.single_sources, p);
  }, /^manifest/);
};

Compiler.prototype.scan_sources = function() {
  u.scandir(this.source_root, 'dir', (p) => {
    console.log("got source " + p)
    this.scan_source(p);
    u.append(this.sources, p);
  }, this.uspat);
};

Compiler.prototype.scan_templates = function() {
  var p;
  var name;
  u.scandir(this.path.templates.content, 'file', (t) => {
    name = t.split("/").splice(-1)[0];
    name = this.namepat.exec(name)[1];
    this.templates[name] = t;
    u.append(this.templates_list, name);
  });
  u.scandir(this.path.templates.user, 'file', (t) => {
    name = t.split("/").splice(-1)[0];
    name = this.namepat.exec(name)[1];
    this.templates[name] = t;
    u.append(this.templates_list, name);
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
      var data = u.read(manifest);
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
      u.append(precompiled, {item: html});
    }
    items = this.items[source];
    for (var n = 0; n < items.length; n++) {
      item = items[n];
      item_id = item.split("/").slice(-1)[0];
      item_id = this.idpat.exec(item_id)[1];
      data = this.preparse(item);
      if (!data.slug) {data.slug = data.title;}
      u.append(links, {
        source: source_name,
        id: item_id,
        slug: data.slug
      });
    }
    u.append(c.cards, {
      path: source,
      source_name: source_name,
      source_title: this.manifests[source].title,
      category: this.manifests[source].category,
      links: links,
      precompiled: precompiled
    });
    u.append(c.manifest.sources, {
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
      u.append(c.unhidden, {
        name: single_source_name.toUpperCase(),
        link: single_source_name
      });
    }
    html = this.prerender(data, data.template);
    u.append(c.manifest.single_sources, {
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
    u.append(c.manifest.templates, {
      template_path: template_path,
      template_name: template_name
    });
  }
  var comptime = Date.now() - this.start_time;
  u.append(c.manifest.stats, {
    name: "total_pages",
    value: this.single_sources.length
  });
  u.append(c.manifest.stats, {
    name: "total_sources",
    value: this.sources.length
  });
  u.append(c.manifest.stats, {
    name: "total_items",
    value: this.item_count
  });
  u.append(c.manifest.stats, {
    name: "compile_time",
    value: comptime
  });
  u.append(c.manifest.flags, {
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
  c.env = env;

  var index = Mustache.render(this.scaffold.main, c, this.scaffold.partials);

  fs.ensureDirSync(this.path.output.root);
  fs.writeFileSync(this.path.output.index, index);
  fs.copySync(this.source_root, this.path.output.source, {filter: (src, dest) => {
    src = _path.basename(src);
    console.log(`src: ${src} match _???_: ${src.match(this.uspat)} match manifest: ${src.match(/^manifest/)}`)
    return !src.match(this.uspat) && !src.match(/^manifest/);
  }});
  fs.copySync(this.path.templates.content, 'build/templates');
  fs.copySync(this.path.templates.user, 'build/templates');
}

Compiler.prototype.get_template = function(template) {
  console.log("getting template: "+template);
  if (!this.templates[template]) {throw new Error("No such template: "+template);}
  var data = this.template_cache[template];
  if (!data) {
    var path = this.templates[template];
    data = u.read(path);
    this.template_cache[template] = data;
  }
  return data;
}

Compiler.prototype.preparse = function(path) {
  var data = u.read(path);
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
  //this.write_manifest();
  this.write_index();
};


module.exports = Compiler;
