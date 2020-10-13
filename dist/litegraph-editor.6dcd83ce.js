// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/litegraph-editor.js":[function(require,module,exports) {
//Creates an interface to access extra features from a graph (like play, stop, live, etc)
function Editor(container_id, options) {
  options = options || {}; //fill container

  var html = "<div class='header'><div class='tools tools-left'></div><div class='tools tools-right'></div></div>";
  html += "<div class='content'><div class='editor-area'><canvas class='graphcanvas' width='1000' height='500' tabindex=10></canvas></div></div>";
  html += "<div class='footer'><div class='tools tools-left'></div><div class='tools tools-right'></div></div>";
  var root = document.createElement("div");
  this.root = root;
  root.className = "litegraph litegraph-editor";
  root.innerHTML = html;
  this.tools = root.querySelector(".tools");
  this.content = root.querySelector(".content");
  this.footer = root.querySelector(".footer");
  var canvas = root.querySelector(".graphcanvas"); //create graph

  var graph = this.graph = new LGraph();
  var graphcanvas = this.graphcanvas = new LGraphCanvas(canvas, graph);
  graphcanvas.background_image = "imgs/grid.png";

  graph.onAfterExecute = function () {
    graphcanvas.draw(true);
  };

  graphcanvas.onDropItem = this.onDropItem.bind(this); //add stuff
  //this.addToolsButton("loadsession_button","Load","imgs/icon-load.png", this.onLoadButton.bind(this), ".tools-left" );
  //this.addToolsButton("savesession_button","Save","imgs/icon-save.png", this.onSaveButton.bind(this), ".tools-left" );

  this.addLoadCounter();
  this.addToolsButton("playnode_button", "Play", "imgs/icon-play.png", this.onPlayButton.bind(this), ".tools-right");
  this.addToolsButton("playstepnode_button", "Step", "imgs/icon-playstep.png", this.onPlayStepButton.bind(this), ".tools-right");

  if (!options.skip_livemode) {
    this.addToolsButton("livemode_button", "Live", "imgs/icon-record.png", this.onLiveButton.bind(this), ".tools-right");
  }

  if (!options.skip_maximize) {
    this.addToolsButton("maximize_button", "", "imgs/icon-maximize.png", this.onFullscreenButton.bind(this), ".tools-right");
  }

  if (options.miniwindow) {
    this.addMiniWindow(300, 200);
  } //append to DOM


  var parent = document.getElementById(container_id);

  if (parent) {
    parent.appendChild(root);
  }

  graphcanvas.resize(); //graphcanvas.draw(true,true);
}

Editor.prototype.addLoadCounter = function () {
  var meter = document.createElement("div");
  meter.className = "headerpanel loadmeter toolbar-widget";
  var html = "<div class='cpuload'><strong>CPU</strong> <div class='bgload'><div class='fgload'></div></div></div>";
  html += "<div class='gpuload'><strong>GFX</strong> <div class='bgload'><div class='fgload'></div></div></div>";
  meter.innerHTML = html;
  this.root.querySelector(".header .tools-left").appendChild(meter);
  var self = this;
  setInterval(function () {
    meter.querySelector(".cpuload .fgload").style.width = 2 * self.graph.execution_time * 90 + "px";

    if (self.graph.status == LGraph.STATUS_RUNNING) {
      meter.querySelector(".gpuload .fgload").style.width = self.graphcanvas.render_time * 10 * 90 + "px";
    } else {
      meter.querySelector(".gpuload .fgload").style.width = 4 + "px";
    }
  }, 200);
};

Editor.prototype.addToolsButton = function (id, name, icon_url, callback, container) {
  if (!container) {
    container = ".tools";
  }

  var button = this.createButton(name, icon_url, callback);
  button.id = id;
  this.root.querySelector(container).appendChild(button);
};

Editor.prototype.createButton = function (name, icon_url, callback) {
  var button = document.createElement("button");

  if (icon_url) {
    button.innerHTML = "<img src='" + icon_url + "'/> ";
  }

  button.classList.add("btn");
  button.innerHTML += name;
  if (callback) button.addEventListener("click", callback);
  return button;
};

Editor.prototype.onLoadButton = function () {
  var panel = this.graphcanvas.createPanel("Load session", {
    closable: true
  }); //TO DO

  this.root.appendChild(panel);
};

Editor.prototype.onSaveButton = function () {};

Editor.prototype.onPlayButton = function () {
  var graph = this.graph;
  var button = this.root.querySelector("#playnode_button");

  if (graph.status == LGraph.STATUS_STOPPED) {
    button.innerHTML = "<img src='imgs/icon-stop.png'/> Stop";
    graph.start();
  } else {
    button.innerHTML = "<img src='imgs/icon-play.png'/> Play";
    graph.stop();
  }
};

Editor.prototype.onPlayStepButton = function () {
  var graph = this.graph;
  graph.runStep(1);
  this.graphcanvas.draw(true, true);
};

Editor.prototype.onLiveButton = function () {
  var is_live_mode = !this.graphcanvas.live_mode;
  this.graphcanvas.switchLiveMode(true);
  this.graphcanvas.draw();
  var url = this.graphcanvas.live_mode ? "imgs/gauss_bg_medium.jpg" : "imgs/gauss_bg.jpg";
  var button = this.root.querySelector("#livemode_button");
  button.innerHTML = !is_live_mode ? "<img src='imgs/icon-record.png'/> Live" : "<img src='imgs/icon-gear.png'/> Edit";
};

Editor.prototype.onDropItem = function (e) {
  var that = this;

  for (var i = 0; i < e.dataTransfer.files.length; ++i) {
    var file = e.dataTransfer.files[i];
    var ext = LGraphCanvas.getFileExtension(file.name);
    var reader = new FileReader();

    if (ext == "json") {
      reader.onload = function (event) {
        var data = JSON.parse(event.target.result);
        that.graph.configure(data);
      };

      reader.readAsText(file);
    }
  }
};

Editor.prototype.goFullscreen = function () {
  if (this.root.requestFullscreen) {
    this.root.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else if (this.root.mozRequestFullscreen) {
    this.root.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else if (this.root.webkitRequestFullscreen) {
    this.root.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
    throw "Fullscreen not supported";
  }

  var self = this;
  setTimeout(function () {
    self.graphcanvas.resize();
  }, 100);
};

Editor.prototype.onFullscreenButton = function () {
  this.goFullscreen();
};

Editor.prototype.addMiniWindow = function (w, h) {
  var miniwindow = document.createElement("div");
  miniwindow.className = "litegraph miniwindow";
  miniwindow.innerHTML = "<canvas class='graphcanvas' width='" + w + "' height='" + h + "' tabindex=10></canvas>";
  var canvas = miniwindow.querySelector("canvas");
  var that = this;
  var graphcanvas = new LGraphCanvas(canvas, this.graph);
  graphcanvas.show_info = false;
  graphcanvas.background_image = "imgs/grid.png";
  graphcanvas.scale = 0.25;
  graphcanvas.allow_dragnodes = false;
  graphcanvas.allow_interaction = false;
  graphcanvas.render_shadows = false;
  graphcanvas.max_zoom = 0.25;
  this.miniwindow_graphcanvas = graphcanvas;

  graphcanvas.onClear = function () {
    graphcanvas.scale = 0.25;
    graphcanvas.allow_dragnodes = false;
    graphcanvas.allow_interaction = false;
  };

  graphcanvas.onRenderBackground = function (canvas, ctx) {
    ctx.strokeStyle = "#567";
    var tl = that.graphcanvas.convertOffsetToCanvas([0, 0]);
    var br = that.graphcanvas.convertOffsetToCanvas([that.graphcanvas.canvas.width, that.graphcanvas.canvas.height]);
    tl = this.convertCanvasToOffset(tl);
    br = this.convertCanvasToOffset(br);
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.floor(tl[0]) + 0.5, Math.floor(tl[1]) + 0.5, Math.floor(br[0] - tl[0]), Math.floor(br[1] - tl[1]));
  };

  miniwindow.style.position = "absolute";
  miniwindow.style.top = "4px";
  miniwindow.style.right = "4px";
  var close_button = document.createElement("div");
  close_button.className = "corner-button";
  close_button.innerHTML = "&#10060;";
  close_button.addEventListener("click", function (e) {
    graphcanvas.setGraph(null);
    miniwindow.parentNode.removeChild(miniwindow);
  });
  miniwindow.appendChild(close_button);
  this.root.querySelector(".content").appendChild(miniwindow);
};

module.exports = Editor;
},{}],"../../rbd/pnpm-volume/a97c73be-be8a-4582-8574-3e06e9c3326f/node_modules/.registry.npmjs.org/parcel-bundler/1.12.4/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "40682" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../rbd/pnpm-volume/a97c73be-be8a-4582-8574-3e06e9c3326f/node_modules/.registry.npmjs.org/parcel-bundler/1.12.4/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/litegraph-editor.js"], null)
//# sourceMappingURL=/litegraph-editor.6dcd83ce.js.map