export function init() {
  let list = [
    { name: "Sine", function: () => Sine() },
    { name: "Square", function: () => Square() },
    { name: "Triangle", function: () => Triangle() },
    { name: "Saw", function: () => Saw() }
  ];

  list.forEach(instrument => {
    function Node() {
      this.addOutput("Oscillator", "oscillator");
      this.addInput("Frequency", "number");
      this.addInput("Gain", "number");
    }

    //name to show
    Node.title = instrument.name;

    Node.prototype.onStart = function() {
      this.setOutputData(0, this.sound);
    };

    Node.prototype.onAdded = function() {
      this.sound = instrument.function();
    };

    Node.prototype.onExecute = function() {
      let freq = isNaN(this.getInputData(0)) ? 300 : this.getInputData(0);
      let gain = isNaN(this.getInputData(1)) ? 1.0 : this.getInputData(1);
      this.sound.frequency = freq;
      this.sound.gain = gain;
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
          this.setOutputData(0, this.sound);
        }
      }
    };

    //register in the system
    LiteGraph.registerNodeType("oscillator/" + instrument.name, Node);
  });

  function OutputNode() {
    this.addInput("Oscillator", "oscillator");
  }

  OutputNode.title = "Output";

  OutputNode.prototype.onStart = function() {
    if (this.source) {
      this.source.connect();
    }
  };

  OutputNode.prototype.onStop = function() {
    if (this.source) {
      this.source.disconnect();
    }
  };

  OutputNode.prototype.onRemoved = function() {
    if (this.source) {
      this.source.disconnect();
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
        this.source = link_info.data;
        if (graph.status === LGraph.STATUS_RUNNING) {
          this.source.connect();
        }
      }
    } else if (link_info) {
      if (link_info.target_slot === 0) {
        this.source.disconnect();
        this.source = false;
      }
    }
  };

  LiteGraph.registerNodeType("oscillator/Output", OutputNode);

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
}
