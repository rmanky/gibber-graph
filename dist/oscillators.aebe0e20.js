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
})({"nodes/oscillators.js":[function(require,module,exports) {
window.onload = () => {
  console.log("test");
  Gibberish.workletPath = "https://raw.githack.com/gibber-cc/gibberish/v3/dist/gibberish_worklet.js";
  Gibberish.init().then(() => {
    console.log("Gibb is good");
    Gibberish.export(window);

    function ArrayNode() {
      this.addOutput("Array", "gibber_array");
      this.widget = this.addWidget("text", "string", "", "value");
      this.widgets_up = true;
    }

    ArrayNode.title = "Array";

    ArrayNode.prototype.onStart = function () {
      let data = this.widget.value;

      if (data) {
        this.setOutputData(0, JSON.parse("[" + data + "]"));
        console.log(data.split(","));
        console.log("array start out");
      }
    };

    ArrayNode.prototype.onStop = function () {
      this.setOutputData(0, false);
      console.log("array stop out");
    };

    LiteGraph.registerNodeType("gibber/array", ArrayNode);

    function OutputNode() {
      this.addInput("Source", "gibber");
      this.properties = {
        precision: 1
      };
    }

    OutputNode.title = "Output";

    OutputNode.prototype.onStart = function () {
      let data = this.getInputData(0);

      if (data && !this.source) {
        this.source = data;
        this.source.connect();
        console.log("output connect");
      }
    };

    OutputNode.prototype.onStop = function () {
      if (this.source) {
        this.source.disconnect();
        this.source = false;
        console.log("output disconnect");
      }
    };

    LiteGraph.registerNodeType("gibber/output", OutputNode);

    function SineNode() {
      this.addOutput("Output", "gibber");
      this.properties = {
        precision: 1
      };
      this.sine = Sine();
    } //name to show


    SineNode.title = "Sine"; //function to call when the node is executed

    SineNode.prototype.onStart = function () {
      this.setOutputData(0, this.sine);
      console.log("sine output start");
    };

    SineNode.prototype.onStop = function () {
      this.setOutputData(0, false);
      console.log("sine output stop");
    }; //register in the system


    LiteGraph.registerNodeType("gibber/sine", SineNode);

    function KickNode() {
      this.addOutput("Output", "gibber");
      this.properties = {
        precision: 1
      };
    } //name to show


    KickNode.title = "Kick"; //function to call when the node is executed

    KickNode.prototype.onStart = function () {
      this.kick = Kick();
      this.kick.connect();
      this.setOutputData(0, this.kick);
      console.log("kick output start");
    };

    KickNode.prototype.onStop = function () {
      this.kick.disconnect();
      this.kick = false;
      this.setOutputData(0, this.kick);
      console.log("kick output stop");
    }; //register in the system


    LiteGraph.registerNodeType("gibber/kick", KickNode);

    function SnareNode() {
      this.addOutput("Output", "gibber");
      this.properties = {
        precision: 1
      };
    } //name to show


    SnareNode.title = "Snare"; //function to call when the node is executed

    SnareNode.prototype.onStart = function () {
      this.snare = Snare();
      this.snare.connect();
      this.setOutputData(0, this.snare);
      console.log("snare output start");
    };

    SnareNode.prototype.onStop = function () {
      this.snare.disconnect();
      this.snare = false;
      this.setOutputData(0, this.snare);
      console.log("snare output stop");
    }; //register in the system


    LiteGraph.registerNodeType("gibber/snare", SnareNode);

    function SequencerNode() {
      this.addInput("Source", "gibber");
      this.addInput("Values", "gibber_array");
      this.addInput("Timings", "gibber_array");
    }

    SequencerNode.title = "Sequencer";

    SequencerNode.prototype.onStart = function () {
      let data = this.getInputData(0);
      let values = this.getInputData(1);
      let timings = this.getInputData(2);

      if (data && values && timings) {
        this.sequencer = Sequencer.make(values, timings, data, "trigger").start();
        this.setOutputData(0, this.sequencer);
        console.log("sequencer output start");
      }
    };

    SquareNode.prototype.onStop = function () {
      if (this.sequencer) {
        this.sequencer.stop();
        this.sequencer = false;
        this.setOutputData(0, this.sequencer);
        console.log("sequencer output stop");
      }
    };

    LiteGraph.registerNodeType("gibber/sequencer", SequencerNode);

    function SquareNode() {
      this.addInput("Source", "gibber");
      this.addOutput("Source", "gibber");
    }

    SquareNode.title = "Square";

    SquareNode.prototype.onStart = function () {
      let data = this.getInputData(0);

      if (data && !this.square) {
        this.square = Square({
          frequency: Add(440, data),
          gain: 0.25,
          antialias: true
        });
        this.setOutputData(0, this.square);
        console.log("square output start");
      }
    };

    SquareNode.prototype.onStop = function () {
      if (this.square) {
        this.square = false;
        this.setOutputData(0, this.square);
        console.log("square output stop");
      }
    };

    LiteGraph.registerNodeType("gibber/square", SquareNode);

    function SquareNode2() {
      this.addOutput("Output", "gibber");
      this.properties = {
        precision: 1
      };
      this.square = Square();
    }

    SquareNode2.title = "Square";

    SquareNode2.prototype.onStart = function () {
      this.setOutputData(0, this.square);
      console.log("square output start");
    };

    SquareNode2.prototype.onStop = function () {
      this.setOutputData(0, false);
      console.log("square output stop");
    };

    LiteGraph.registerNodeType("gibber/square", SquareNode2);
    var node_square = LiteGraph.createNode("gibber/square");
    node_square.pos = [400, 200];
    graph.add(node_square);

    function TriangleNode() {
      this.addOutput("Output", "gibber");
      this.properties = {
        precision: 1
      };
      this.triangle = Triangle();
    }

    TriangleNode.title = "Triangle"; //function to call when the node is executed

    TriangleNode.prototype.onStart = function () {
      this.setOutputData(0, this.triangle);
      console.log("triangle output start");
    };

    TriangleNode.prototype.onStop = function () {
      this.setOutputData(0, false);
      console.log("triangle output stop");
    };

    LiteGraph.registerNodeType("gibber/triangle", TriangleNode);
    var node_triangle = LiteGraph.createNode("gibber/triangle");
    node_triangle.pos = [400, 200];
    graph.add(node_triangle);

    function SawNode() {
      this.addOutput("Output", "gibber");
      this.properties = {
        precision: 1
      };
      this.saw = Saw();
    }

    SawNode.title = "Saw"; //function to call when the node is executed

    SawNode.prototype.onStart = function () {
      this.setOutputData(0, this.saw);
      console.log("saw output start");
    };

    SawNode.prototype.onStop = function () {
      this.setOutputData(0, false);
      console.log("saw output stop");
    };

    LiteGraph.registerNodeType("gibber/saw", SawNode);
    var node_saw = LiteGraph.createNode("gibber/saw");
    node_saw.pos = [400, 200];
    graph.add(node_saw);
    /*     
    function reverseSawNode() {
      this.addOutput("Output", "gibber");
      this.properties = {
        precision: 1
      };
      this.saw = ReverseSaw();
    }
     ReserveSaw.title = "ReserveSaw";
     //function to call when the node is executed
    reverseSawNode.prototype.onStart = function() {
      this.setOutputData(0, this.saw);
      console.log("reversesaw output start");
    };
     reverseSawNode.prototype.onStop = function() {
      this.setOutputData(0, false);
      console.log("saw output stop");
    };
    LiteGraph.registerNodeType("gibber/reversesaw", reverseSawNode); //reverse 
     var node_rsaw = LiteGraph.createNode("gibber/reversesaw"); //reverse
    node_rsaw.pos = [400, 200];
    graph.add(node_rsaw);
    
    
     
     ///need to get Conga to get Cowbell??
     function CowBellNode() {
      this.addOutput("Output", "gibber");
      this.properties = {
        precision: 1
      };
    }
     CowBellNode.title = "Cowbell";
     //function to call when the node is executed
    CowBellNode.prototype.onStart = function() {
      this.cowbell = Cowbell();
      this.cowbell.connect();
      this.setOutputData(0, this.cowbell);
       console.log("cowbell output start");
    };
     CowBellNode.prototype.onStop = function() {
      this.cowbell.disconnect();
      this.cowbell = false;
      this.setOutputData(0, this.cowbell);
       console.log("cowbell output stop");
    };
     //register in the system
    LiteGraph.registerNodeType("gibber/cowbell", CowBellNode);
     var node_cowbell = LiteGraph.createNode("gibber/cowbell");
    node_cowbell.pos = [400, 200];
    graph.add(node_cowbell); */
  });
};
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "33782" + '/');

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
},{}]},{},["../../rbd/pnpm-volume/a97c73be-be8a-4582-8574-3e06e9c3326f/node_modules/.registry.npmjs.org/parcel-bundler/1.12.4/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","nodes/oscillators.js"], null)
//# sourceMappingURL=/oscillators.aebe0e20.js.map