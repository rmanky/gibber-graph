export function init() {
  let list = [
    { name: "Noise", function: () => Noise() },
    { name: "PWM", function: () => PWM() },
    { name: "ReverseSaw", function: () => ReverseSaw() },
    { name: "Saw", function: () => Saw() },
    { name: "Sine", function: () => Sine() },
    { name: "Square", function: () => Square() },
    { name: "Triangle", function: () => Triangle() }
  ];

  list.forEach(oscillator => {
    function Node() {
      this.addOutput("oscillator", "oscillator");
      this.addInput("frequency", "number");
      this.addInput("gain", "number");
    }

    //name to show
    Node.title = oscillator.name;

    Node.prototype.onStart = function() {
      this.setOutputData(0, this.gibberishOscillator);
    };

    Node.prototype.onAdded = function() {
      this.gibberishOscillator = oscillator.function();
      this.setOutputData(0, this.gibberishOscillator);
    };

    Node.prototype.onExecute = function() {
      let freq = isNaN(this.getInputData(0)) ? 200 : this.getInputData(0);
      let gain = isNaN(this.getInputData(1)) ? 1.0 : this.getInputData(1);
      this.gibberishOscillator.frequency = freq;
      this.gibberishOscillator.gain = gain;
    };

    Node.prototype.onConnectionsChange = function(
      connection,
      slot,
      connected,
      link_info
    ) {
      //only process the outputs events
      if (connection != LiteGraph.OUTPUT) {
        return;
      }

      if (connected) {
        if (link_info.origin_slot === 0) {
          this.setOutputData(0, this.gibberishOscillator);
        }
      }
    };

    //register in the system
    LiteGraph.registerNodeType("oscillator/" + oscillator.name, Node);
  });

  function OutputNode() {
    this.addInput("oscillator", "oscillator");
  }

  function mapOutputInput(node, input) {
    node.gibberishOscillator = input;
    if (graph.status === LGraph.STATUS_RUNNING) {
      node.gibberishOscillator.connect();
    }
  }

  OutputNode.title = "Output";

  OutputNode.prototype.onStart = function() {
    if (this.gibberishOscillator) {
      this.gibberishOscillator.connect();
    } else if (this.getInputData(0)) {
      mapOutputInput(this, this.getInputData(0));
    }
  };

  OutputNode.prototype.onAdded = function() {
    if (this.getInputData(0)) {
      mapOutputInput(this, this.getInputData(0));
    }
  };

  OutputNode.prototype.onStop = function() {
    if (this.gibberishOscillator) {
      this.gibberishOscillator.disconnect();
    }
  };

  OutputNode.prototype.onRemoved = function() {
    if (this.gibberishOscillator) {
      this.gibberishOscillator.disconnect();
    }
  };

  OutputNode.prototype.onConnectionsChange = function(
    connection,
    slot,
    connected,
    link_info
  ) {
    //only process the outputs events
    if (connection != LiteGraph.INPUT) {
      return;
    }

    if (connected && link_info && link_info.data) {
      if (link_info.target_slot === 0) {
        mapOutputInput(this, link_info.data);
      }
    } else if (link_info) {
      if (link_info.target_slot === 0 && this.gibberishOscillator) {
        this.gibberishOscillator.disconnect();
        this.gibberishOscillator = false;
      }
    }
  };

  LiteGraph.registerNodeType("oscillator/Output", OutputNode);
}
