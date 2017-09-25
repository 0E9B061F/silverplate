'use strict';

var template;

var REQUESTS = 0;
var LOADED = 0;
var TOTALTIME = 0;
var STARTSIZE = 0;
var STARTBYTES = "0 B";

var set_template = function(t) {
  template = t;
}

var load_template = function() {
  var data;
  $.ajax({
    url: "templates/default.html.mst",
    type: "GET",
    success: function(d) {
      set_template(d);
    },
    error: function(request, error) {
      console.log(request);
    }
  });
  return data;
}

var get_object = function(s, a) {
  return $("[aesource="+s+"] [aeid="+a+"]");
}

var fs = function(obj) {
  if (obj.hasClass("fullscreen")) {
    console.log("closing fs");
    obj.css({"height":  ""});
    obj.removeClass("fullscreen");
    obj.find('.badge .inset .inset-body').removeClass("inner-body");
    obj.find('.badge .label .label-body').removeClass("inner-body");
    obj.find('.badge').css({
      "clip-path":  "",
      "height": ""
    });
    obj.find('.badge .inset').css({
      "clip-path":  "",
      "height": ""
    });
    obj.find('.badge .inset .contents').css({
      "height": ""
    });
    obj.find('.badge .label .label-controls').css({"display": "none"});
    $(".top-bar").removeClass("tinted");
  } else {
    var lh = 50;
    obj.addClass("fullscreen");
    var wh = $(window).height();
    var ww = $(window).width();
    var hc = ww - 50;
    var vc = 50;
    var ch = wh - 50;
    if ($("body[ae-has-pages='true']").length > 0) {
      ch -= 20;
    }
    var ih = ch - lh;
    obj.css({"height":  ch});
    obj.find('.badge').css({
      "clip-path":  "polygon(0px 0px, 100% 0px, 100% 0px, 100% 100%, 0px 100%)",
      "height": ch
    });
    obj.find('.badge .inset').css({
      "clip-path":  "polygon(0px 0px, 100% 0px, 100% 0px, 100% 100%, 0px 100%)",
      "height": ih
    });
    obj.find('.badge .inset .contents').css({
      "height": ih - lh
    });
    obj.find('.badge .inset .inset-body').addClass("inner-body");
    obj.find('.badge .label .label-body').addClass("inner-body");
    obj.find('.badge .label .label-controls').css({"display": "block"});
    $(".top-bar").addClass("tinted");
  }
}

var hide_contents = function(s) {
  var source  = $("[aesource="+s+"]");
  source.css({"display": "none"});
  source.removeClass("displayed");
}

var word_count = function(text) {
  return text.replace(/\s+/g, ' ').trim().split(' ').length;
}

var load_content = function(s, a, toggle) {
  var source_path = anchor_path(s, a) + ".json.md";
  var req_start = Date.now();
  $.ajax({
    url: source_path,
    type: "GET",
    success: function(raw) {
      var req_total = Date.now() - req_start;
      var parse_start = Date.now();
      var data = parse_jmd(raw);
      data.source_path = source_path;
      data.anchor_path = anchor_path(s, a);
      data.hash_path = "#/" + anchor_path(s, a);
      data.source = s;
      data.id = a;
      data.origin = "dynamically rendered";
      data.req_time = req_total;
      var html = Mustache.render(template, data);
      var parse_total = Date.now() - parse_start;
      var total_time = req_total + parse_total;
      TOTALTIME += total_time;
      var source  = $("[aesource="+s+"]");
      source.append(html);
      var obj = get_object(s, a);
      obj.find(".diagnostic .parse-time").append(parse_total);
      obj.find(".diagnostic .total-time").append(total_time);
      var wc = word_count(obj.find('.readable').text());
      obj.find(".diagnostic .word-count").append(wc);
      obj.find(".diagnostic .read-time").append(wpm(wc));
      obj.find(".page-count").append(pages(wc));
      if (toggle) {
        tc_inner(s, a);
      }
      prepend_links();
      adjust_card_title();
    },
    error: function(request, error) {
      console.log(request);
    }
  });
  REQUESTS++;
  LOADED++;
}

var loaded = function(s, a) {
  var source = $("[aesource="+s+"]");
  var anchor = source.find("[aeid="+a+"]");
  return anchor.length !== 0;
}

var not_loaded = function(s, a) {
  return !loaded(s, a);
}

var tc_inner = function(s, a) {
  var source  = $("[aesource="+s+"]");
  var sources = $("[aesource]");
  var anchors = source.find("[aeid]");
  var active  = get_object(s, a);
  console.log(active);
  if (a) {
    anchors.css({"display": "none"});
    anchors.removeClass("displayed focused");
    active.css({"display": "block"});
    active.addClass("displayed focused");
  } else {
    anchors.removeClass("focused displayed");
    anchors.addClass("displayed")
    anchors.css({"display": "block"});
  }
  source.css({"display": "block"});
  sources.removeClass("displayed");
  source.addClass("displayed");
}

var toggle_contents = function(s, a) {
  if (a && not_loaded(s, a)) {
    console.log("trying to toggle unloaded content");
    load_content(s, a, true);
  } else {
    tc_inner(s, a);
  }
}

var anchor_path = function(s, a) {
  var p = "source/" + s;
  if (a) {
    p = p + "/" + a;
  }
  return p;
}

var parse_hash = function() {
  return window.location.hash.split("/").slice(1);
}

var current_anchor = function() {
  var [r, s, a] = parse_hash();
  return a;
}

var current_anchor_obj = function() {
  var [r, s, a] = parse_hash();
  if (a) {
    return $("[aesource="+s+"] [aeid="+a+"]");
  } else {
    return false;
  }
}

var current_source = function() {
  var [r, s, a] = parse_hash();
  return s;
}

var clear_class = function(obj) {
  var cat = obj.attr("aesetcat");
  if (cat) {
    obj.removeClass(cat);
    obj.attr("aesetcat", "");
  }
}

var adjust_class = function(obj, classbase) {
  var fsc = $(".fullscreen");
  if (fsc) {
    clear_class(obj);
    var c = fsc.attr("aecategory");
    obj.addClass(classbase+c);
    obj.attr("aesetcat", classbase+c)
  } else {
    clear_class(obj);
  }
}

var adjust_textmark_color = function() {
  adjust_class($(".ae"), "tm-c");
}

var adjust_diag_color = function() {
  adjust_class($(".global-diagnostic"), "diag-c");
}

var change_state = function(data, url, restore) {
  if (!restore) {
    history.pushState(data, url, url);
  }
  adjust_card_title();
  adjust_textmark_color();
  adjust_diag_color();
}

var adjust_card_title = function() {
  if (current_anchor()) {
    var cao = current_anchor_obj();
    var title = cao.attr("aetitle");
    var slug = cao.attr("aeslug");
    var cardtitle;
    if (slug) {
      cardtitle = slug;
    } else {
      cardtitle = title;
    }
    $(".fullscreen .badge .label .subtitle").html('<span class="icon ion-arrow-right-a seperator"></span>'+cardtitle);
  } else if (current_source()) {
    $(".fullscreen .badge .label .subtitle").html('<span class="icon ion-arrow-right-a seperator"></span><span class="icon ion-asterisk"></span>');
  } else {
    $(".badge .label .subtitle").html('');
  }
}

var return_to_root = function(restore) {
  var source = $(".fullscreen").attr("aeparent");
  console.log("fs card: "+source)
  hide_contents(source);
  var parent = $("[aeparent="+source+"]");
  fs(parent);
  var nurl = window.location.origin + window.location.pathname;
  console.log(nurl);
  change_state({"source": "", "anchor": ""}, nurl, restore);
  console.log(window.location);
}

var go_up = function() {
  if (current_anchor()) {
    activate_card(current_source());
  } else if (current_source()) {
    return_to_root();
  }
}

var activate_card_or_page = function(s, a, restore) {
  if (s) {
    console.log(`trying to activate ${s}/${a}`);
    var type = $(`[ae-source-name=${s}]`).attr("ae-manifest-type");
    if (type == 'source') {
      deactivate_page(() => {
        if (a) {
          $("body").attr("ae-mode", 'item');
          $("body").attr("ae-active-anchor", a);
        } else {
          $("body").attr("ae-mode", 'source');
          $("body").attr("ae-active-anchor", "");
        }
        $("body").attr("ae-active-page", "");
        $("body").attr("ae-active-source", s);
        var m = $(`div[ae-manifest-type="source"][ae-source-name="${s}"]`);
        $("body").attr("ae-category", m.attr("ae-category"));
        activate_card(s, a, restore);
      });
    } else if (type == 'single-source') {
      var opened = $("body").attr("ae-mode") != 'page';
      var os = $("body").attr("ae-active-source");
      var oa = $("body").attr("ae-active-anchor");
      $("body").attr("ae-mode", 'page');
      $("body").attr("ae-active-page", s);
      $("body").attr("ae-active-source", "");
      $("body").attr("ae-active-anchor", "");
      activate_page(s, os, oa, restore, opened);
    }
  } else {
    console.log("returning to root");
    deactivate_page(() => {
      $("body").attr("ae-mode", 'root');
      $("body").attr("ae-active-page", "");
      $("body").attr("ae-active-source", "");
      $("body").attr("ae-active-anchor", "");
      $("body").attr("ae-category", "");
      return_to_root(restore);
    });
  }
}

var activate_card = function(s, a, restore) {
  if (s) {
    var parent = $("[aeparent="+s+"]");
    if (!parent.hasClass("fullscreen")) {
      fs(parent);
    }
    toggle_contents(s, a);
    if (a) {
      var o = get_object(s, a);
      if (o.attr("aeorigin") == "preloaded" && o.attr("aeinjected") != "true") {
        o.attr("aeinjected", "true");
        var wc = word_count(o.find('.readable').text());
        o.find(".word-count").append(wc);
        o.find(".read-time").append(wpm(wc));
        o.find(".page-count").append(pages(wc));
      }
    }
    var base = window.location.href.split("/").slice(0,-1).join("/");
    var url = URI();
    url.search({});
    url.hash(`/${anchor_path(s, a)}`);
    console.log(url.toString());
    change_state({"source": s, "anchor": a}, url.toString(), restore);
  }
}

var deactivate_page = function(cb) {
  if ($('.top-bar').hasClass("unfolded")) {
    $('.top-bar').css({"height": ""});
    window.setTimeout(function() {
      $('.top-bar').removeClass("unfolded").addClass("folded")
      $('.top-bar .ae').css({"padding-top":  0});
      $('[ae-page]').removeClass("displayed");
      cb();
    }, 500);
  } else {
    cb();
  }
}

var activate_page = function(s, os, oa, restore, opened) {
  var url = URI('');
  var curl = URI(window.location.toString());
  var data = curl.search(true);
  var w = {};
  if (opened && data.os) {
    console.log("restoring disturbed page + source state");
    activate_card(data.os, data.oa, restore);
    w.os = data.os;
    if (data.oa) {w.oa = data.oa;}
  } else if (opened) {
    if (os) {w.os = os;}
    if (oa) {w.oa = oa;}
  } else {
    if (data.os) {w.os = data.os;}
    if (data.oa) {w.oa = data.oa;}
  }
  $('[ae-page]').removeClass("displayed");
  $(`[ae-page="${s}"]`).addClass("displayed");
  if ($('.top-bar').hasClass("folded")) {
    var wh = $(window).height();
    $('.top-bar').css({"height":  wh});
    $('.top-bar .ae').css({"padding-top":  wh, "bottom": wh});
    $('.top-bar').removeClass("folded").addClass("unfolded");
  }
  url.hash(`#/${anchor_path(s)}`);
  url.search(w);
  console.log(w);
  change_state({source: s, anchor: null, was: w}, url.toString(), restore);
}

var close_page = function() {
  if ($('body').attr('ae-mode') == 'page') {
    var curl = URI(window.location.toString());
    var data = curl.search(true);
    activate_card_or_page(data.os, data.oa);
  }
}

$('.full-link').click(function() {
  fs($(this));
});

$("[aedest]").click(function() {
  var dest = $(this).attr("aedest");
  if (dest == "..") {
    console.log("hit up button");
    go_up();
  } else if (dest == "!!") {
    console.log("hit page close button (!!)");
    close_page();
  } else {
    console.log("hit link button");
    var anchor = $(this).attr("aeanchor");
    activate_card_or_page(dest, anchor);
  }
});

var prepend_links = function() {
  var bare = $(".contents a:not([aeprepended])").not("li a");
  bare.prepend('<span class="icon ion-link link-decorator"></span>&thinsp;');
  bare.attr("aeprepended", "true");
}

var early_init = function() {
  load_template();
  var [r, s, a] = parse_hash();
  $(".border").removeClass("dynamic");
  $(".top-bar").removeClass("dynamic");
  activate_card_or_page(s, a);
}

var init_content = function() {
  prepend_links();
  new Clipboard('.copyable');
  $(".border").addClass("dynamic");
  $(".top-bar").addClass("dynamic");
  STARTSIZE = $("html").html().length;
  STARTBYTES = bytes(STARTSIZE);
  var update_id = setInterval(function () {
    var dl = $("html").html().length;
    var b  = bytes(dl);
    var bd = dl - STARTSIZE;
    bd = bytes(bd);
    var wc = word_count($("html").text());
    var imgc = $("img").length;
    var ic = $("[aeid]").length;
    var awt;
    if (LOADED > 0) {awt = ms(TOTALTIME/LOADED)} else {awt = '0ms'}
    $(".global-diagnostic .start-size").text(STARTBYTES);
    $(".global-diagnostic .size-change").text(bd);
    $(".global-diagnostic .html-size").text(b);
    $(".global-diagnostic .word-count").text(wc);
    $(".global-diagnostic .image-count").text(imgc);
    $(".global-diagnostic .request-count").text(REQUESTS);
    $(".global-diagnostic .item-count").text(ic);
    $(".global-diagnostic .wait-time").text(ms(TOTALTIME));
    $(".global-diagnostic .average-wait-time").text(awt);
    console.log("update");
  }, 2500);
}

window.onpopstate = function(e) {
  activate_card_or_page(e.state.source, e.state.anchor, true);
};

$(document).ready(init_content);

early_init();
