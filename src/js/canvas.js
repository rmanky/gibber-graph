export function init(user) {
  var webgl_canvas = null;

  LiteGraph.node_images_path = "../nodes_data/";
  var editor = new LiteGraph.Editor("main", { miniwindow: false });
  window.graphcanvas = editor.graphcanvas;
  window.graph = editor.graph;
  window.addEventListener("resize", function() {
    editor.graphcanvas.resize();
  });

  // call resize on load
  editor.graphcanvas.resize();

  window.onbeforeunload = function() {
    var data = JSON.stringify(graph.serialize());
    localStorage.setItem("litegraphg demo backup", data);
    //localStorage.setItem("Demo1", prev_data);
  };

  //enable scripting
  LiteGraph.allow_scripts = true;

  let footer = document.createElement("span");
  footer.className = "selector";
  footer.innerHTML =
    "Hello, " +
    user.username +
    "! <form action='/auth/logout'><button type='submit' class='btn btn-danger'>Log Out <i class='fab fa-github'/></button></form>";
  document
    .querySelector(".footer")
    .querySelector(".tools-right")
    .appendChild(footer);

  //create scene selector
  var elem = document.createElement("span");
  elem.className = "selector";
  elem.innerHTML =
    "Demo <select><option>Empty</option></select> <button class='btn' id='save'>Save</button><button class='btn' id='load'>Load</button><button class='btn' id='download'>Download</button>";
  document.querySelector(".tools-left").appendChild(elem);
  var select = elem.querySelector("select");
  select.addEventListener("change", function(e) {
    var option = this.options[this.selectedIndex];
    var url = option.dataset["url"];

    if (url) graph.load(url);
    else if (option.callback) option.callback();
    else graph.clear();
  });

  elem.querySelector("#save").addEventListener("click", function() {
    console.log("saved");
    // const user = document.getElementById("username").innerHTML;
    const now = new Date();
    const secondsSinceEpoch = Math.round(now.getTime() / 1000);
    const insertString = JSON.stringify({
      user: user.username,
      time: secondsSinceEpoch,
      graph: graph.serialize()
    });

    fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: insertString
    }).then(function(response) {
      console.log(response.json().then(data => {}));
    });
  });

  elem.querySelector("#load").addEventListener("click", function() {
    // const user = document.getElementById("username").innerHTML;
    fetch("/load", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: user.username })
    }).then(function(response) {
      console.log(
        response.json().then(data => {
          if (data.length != 0) {
            graph.configure(data[0].graph);
          }
        })
      );
    });
  });

  elem.querySelector("#download").addEventListener("click", function() {
    var data = JSON.stringify(graph.serialize());
    var file = new Blob([data]);
    var url = URL.createObjectURL(file);
    var element = document.createElement("a");
    element.setAttribute("href", url);
    element.setAttribute("download", "graph.JSON");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setTimeout(function() {
      URL.revokeObjectURL(url);
    }, 1000 * 60); //wait one minute to revoke url
  });

  function addDemo(name, url) {
    var option = document.createElement("option");
    if (url.constructor === String) option.dataset["url"] = url;
    else option.callback = url;
    option.innerHTML = name;
    select.appendChild(option);
  }

  addDemo("Demo1", "../examples/demo1.json");
  addDemo("Demo2", "../examples/demo2.json");
  addDemo("Demo3", "../examples/demo3.json");
  addDemo("Demo4", "../examples/demo4.json");
  addDemo("Demo5", "../examples/demo5.json")
  addDemo("Demo6", "../examples/demo6.json");

  addDemo("Network (Beta)", "../examples/network.json");
  addDemo("Showcase", "../examples/showcase.json");

  //some examples
  // addDemo("Features", "examples/features.json");
  // addDemo("Benchmark", "examples/benchmark.json");
  // addDemo("Subgraph", "examples/subgraph.json");
  // addDemo("Audio", "examples/audio.json");
  // addDemo("Audio Delay", "examples/audio_delay.json");
  // addDemo("Audio Reverb", "examples/audio_reverb.json");
  // addDemo("MIDI Generation", "examples/midi_generation.json");
  addDemo("autobackup", function() {
    var data = localStorage.getItem("litegraphg demo backup");
    if (!data) return;
    var graph_data = JSON.parse(data);
    graph.configure(graph_data);
  });
}
