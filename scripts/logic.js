'use strict';

var template;
var standard_meta = ["title", "class", "slug"];

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

load_template();
console.log("data "+template);

$('.about-link').click(function() {
  if ($('.top-bar').hasClass("unfolded")) {
    $('.top-bar').css({"height": ""});
    window.setTimeout(function() {
      $('.top-bar').removeClass("unfolded").addClass("folded")
      $('.top-bar .ae').css({"padding-top":  0});
    }, 500);
  } else if ($('.top-bar').hasClass("folded")) {
    var wh = $(window).height();
    $('.top-bar').css({"height":  wh});
    $('.top-bar .ae').css({"padding-top":  wh, "bottom": wh});
    $('.top-bar').removeClass("folded").addClass("unfolded")
  }
});

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
    var lh = obj.find('.badge .label').height();
    obj.addClass("fullscreen");
    var wh = $(window).height();
    var ww = $(window).width();
    var hc = ww - 50;
    var vc = 50;
    var ch = wh - 50;
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

var load_content = function(s, a) {
  $.ajax({
    url: anchor_path(s, a) + ".json.md",
    type: "GET",
    success: function(raw) {
      var data = parse_jmd(raw);
      data.id = a;
      var html = Mustache.render(template, data);
      var source  = $("[aesource="+s+"]");
      source.append(html);
    },
    error: function(request, error) {
      console.log(request);
    }
  });
}

var toggle_contents = function(s, a) {
  var source  = $("[aesource="+s+"]");
  var anchors = source.find("[aeid]");
  var active  = source.find("[aeid="+a+"]");
  console.log(active.attr("aeid"));
  if (active.length === 0) {
    console.log("trying to toggle unloaded content");
    load_content(s, a);
  }
  if (a) {
    anchors.css({"display": "none"});
    active.css({"display": "block"});
  } else {
    anchors.css({"display": "block"});
  }
  source.css({"display": "block"});
  source.addClass("displayed");
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

var seperate_top_bar = function() {
  var bc = $(".top-bar").css("background-color");
  var cc = $(".fullscreen")
  if (cc) {
    cc = cc.find(".inset").css("background-color");
    console.log("got cc: "+cc+" bc: "+bc)
    if (bc == cc) {
      console.log("same color")
      $(".top-bar").addClass("seperated");
    } else {
      $(".top-bar").removeClass("seperated");
    }
  } else {
    $(".top-bar").removeClass("seperated");
  }
}

var clear_textmark_color = function() {
  var ae  = $(".ae");
  var cat = ae.attr("aesetcat");
  if (cat) {
    ae.removeClass(cat);
    ae.attr("aesetcat", "");
  }
}

var adjust_textmark_color = function() {
  var fsc = $(".fullscreen");
  if (fsc) {
    clear_textmark_color();
    var c = fsc.attr("aecategory");
    console.log("fullscreen! "+c)
    $(".ae").addClass("tm-c"+c);
    $(".ae").attr("aesetcat", "tm-c"+c)
  } else {
    clear_textmark_color();
  }
}

var change_state = function(data, url, restore) {
  if (!restore) {
    history.pushState(data, url, url);
  }
  adjust_card_title();
  seperate_top_bar();
  adjust_textmark_color();
}

var activate_card = function(s, a, restore) {
  if (s) {
    var parent = $("[aeparent="+s+"]");
    if (!parent.hasClass("fullscreen")) {
      fs(parent);
    }
    toggle_contents(s, a);
    var base = window.location.href.split("/").slice(0,-1).join("/");
    var nurl = "#/" + anchor_path(s, a);
    console.log(nurl);
    change_state({"source": s, "anchor": a}, nurl, restore);
  }
}

var adjust_card_title = function() {
  if (current_anchor()) {
    var title = current_anchor_obj().attr("aetitle");
    $(".fullscreen .badge .label .subtitle").html('<span class="icon ion-arrow-right-b seperator"></span>'+title);
  } else if (current_source()) {
    $(".fullscreen .badge .label .subtitle").html('<span class="icon ion-arrow-right-b seperator"></span><span class="icon ion-asterisk"></span>');
  } else {
    $(".badge .label .subtitle").html('');
  }
}

$('.full-link').click(function() {
  fs($(this));
});

$("[aedest]").click(function() {
  var dest = $(this).attr("aedest");
  if (dest == "") {
    console.log("hit close button");
    return_to_root();
  } else if (dest == "..") {
    console.log("hit up button");
    go_up();
  } else {
    console.log("hit link button");
    var anchor = $(this).attr("aeanchor");
    activate_card(dest, anchor);
  }
});

var init_content = function() {
  load_template();
  console.log("template: " + template);
  var [r, s, a] = parse_hash();
  activate_card(s, a);
}

window.onpopstate = function(e) {
  console.log(e);
  console.log(history);
  if (e.state.source != "") {
    console.log("restoring card")
    activate_card(e.state.source, e.state.anchor, true);
  } else {
    console.log("restoring root")
    return_to_root(true);
  }
};

$(document).ready(init_content);
