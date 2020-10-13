export function init() {
  let list = [
    { name: "Kick", function: () => Kick() },
    { name: "Snare", function: () => Snare() }
  ];

  list.forEach(instrument => {
    function Node() {
      this.addOutput("Instrument", "instrument");
      this.addInput("Gain", "number");
    }

    //name to show
    Node.title = instrument.name;

    Node.prototype.onRemoved = function() {
      if (this.sound) {
        this.sound.disconnect();
        this.sound = false;
        this.setOutputData(0, this.sound);
      }
    };

    Node.prototype.onExecute = function() {
      if (this.sound) {
        let gain = this.getInputData(0) == null ? 1.0 : this.getInputData(0);
        this.sound.gain = gain;
      }
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

      if (graph.status === LGraph.STATUS_RUNNING) {
        if (connected && !this.sound) {
          this.sound = instrument.function();
          this.sound.connect();
          this.setOutputData(0, this.sound);
        } else {
          if (this.sound) {
            this.sound.disconnect();
            this.sound = false;
            this.setOutputData(0, this.sound);
          }
        }
      }
    };

    //register in the system
    LiteGraph.registerNodeType("instrument/" + instrument.name, Node);
  });

  // --- SEQUENCER --- \\
  function SequencerNode() {
    this.addInput("Instrument", "instrument");
    this.addInput("Values", "array");
    this.addInput("Timings", "array");
  }

  SequencerNode.title = "Sequencer";

  SequencerNode.prototype.onStart = function() {
    let data = this.getInputData(0);
    let values = this.getInputData(1);
    let timings = this.getInputData(2);
    if (data && values && timings) {
      this.sequencer = Sequencer.make(values, timings, data, "trigger").start();
      console.log("sequencer output start");
    }
  };

  SequencerNode.prototype.onRemoved = function() {
    if (this.sequencer) {
      this.sequencer.stop();
      this.sequencer = false;
      console.log("sequencer stopped");
    }
  };

  SequencerNode.prototype.onExecute = function() {
    if (this.sequencer) {
      let values =
        this.getInputData(0) == null ? [1.0, 0.0] : this.getInputData(0);
      let timings =
        this.getInputData(1) == null ? [10000] : this.getInputData(1);

      this.sequencer.gain = gain;
    }
  };

  SequencerNode.prototype.onConnectionsChange = function(
    connection,
    slot,
    connected,
    link_info
  ) {
    //only process the outputs events
    if (connection != LiteGraph.INPUT) {
      return;
    }

    if (graph.status === LGraph.STATUS_RUNNING) {
      if (connected && link_info && link_info.data) {
        if (link_info.data && !this.source) {
          this.source = link_info.data;
          this.sequencer = Sequencer.make(
            [1.0, 0.0],
            [10000],
            this.source,
            "trigger"
          ).start();
          console.log("sequencer started");
        }
      } else {
        if (this.sequencer) {
          this.sequencer.stop();
          this.sequencer = false;
          console.log("sequencer stopped");
        }
      }
    }
  };

  LiteGraph.registerNodeType("instrument/Sequencer", SequencerNode);
}
