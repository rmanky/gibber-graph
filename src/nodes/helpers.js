export function init() {
  // --- ARRAY --- \\

  function ArrayNode() {
    this.addOutput("Array", "array");
    this.widget = this.addWidget("text", "string", "", "value");
    this.widgets_up = true;
  }

  ArrayNode.title = "Array";

  ArrayNode.prototype.onStart = function() {
    let data = this.widget.value;
    if (data) {
      this.setOutputData(0, JSON.parse("[" + data + "]"));
      console.log(data.split(","));
      console.log("array start out");
    }
  };

  ArrayNode.prototype.onStop = function() {
    this.setOutputData(0, false);
    console.log("array stop out");
  };

  //LiteGraph.registerNodeType("helper/array", ArrayNode);
}
