export function init() {
  let defaults = {
    trigger: [0.5, 0.75, 1.0],
    note: [220, 330, 440]
  };

  let list = [
    { name: "Kick", function: () => Kick(), key: "trigger" },
    { name: "Snare", function: () => Snare(), key: "trigger" },
    { name: "Hat", function: () => Hat(), key: "trigger" },
    { name: "Tom", function: () => Tom(), key: "trigger" },
    { name: "Synth", function: () => Synth(), key: "note" }
  ];

  list.forEach(instrument => {
    function Node() {
      this.addOutput("Instrument", "instrument");
      this.addInput("Gain", "number");
    }

    //name to show
    Node.title = instrument.name;

    Node.prototype.onStart = function() {
      this.setOutputData(0, { sound: this.sound, key: this.key });
    };

    Node.prototype.onAdded = function() {
      this.sound = instrument.function();
      this.key = instrument.key;
    };

    Node.prototype.onExecute = function() {
      let gain = isNaN(this.getInputData(0)) ? 1.0 : this.getInputData(0);
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
          this.setOutputData(0, { sound: this.sound, key: this.key });
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

  SequencerNode.prototype.onAdded = function() {
    this.source;
    this.sequencer = Sequencer.make(
      defaults["trigger"],
      [10000],
      this.source,
      "trigger"
    );
  };

  SequencerNode.prototype.onRemoved = function() {
    if (this.source) {
      this.sequencer.stop();
      this.source.disconnect();
    }
  };

  SequencerNode.prototype.onStop = function() {
    if (this.source) {
      this.sequencer.stop();
      this.source.disconnect();
    }
  };

  SequencerNode.prototype.onStart = function() {
    if (this.source) {
      this.source.connect();
      this.sequencer.start();
    }
  };

  SequencerNode.prototype.onExecute = function() {
    let values = this.getInputData(1);
    let timings = this.getInputData(2);
    if (values) {
      values = values.some(isNaN) ? defaults[this.sequencer.key] : values;
      this.sequencer.values = values;
    }
    if (timings) {
      timings = timings.some(isNaN) ? [10000] : timings;
      this.sequencer.timings = timings;
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

    if (connected && link_info && link_info.data) {
      if (link_info.target_slot === 0) {
        this.source = link_info.data.sound;
        this.sequencer.target = this.source;
        this.sequencer.values = defaults[link_info.data.key];
        this.sequencer.key = link_info.data.key;
        if (graph.status === LGraph.STATUS_RUNNING) {
          this.source.connect();
          this.sequencer.start();
        }
      }
    } else if (link_info) {
      if (link_info.target_slot === 0) {
        if (this.source) {
          this.sequencer.stop();
          this.source.disconnect();
          this.source = false;
        }
      }
    }
  };

  LiteGraph.registerNodeType("instrument/Sequencer", SequencerNode);
}
