export function init() {
  let defaults = {
    trigger: [1.0, 1.0, 0.0],
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

    Node.prototype.onRemoved = function() {
      this.sound = false;
      this.key = false;
      this.setOutputData(0, { sound: this.sound, key: this.key });
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
        if (connected) {
          if (link_info.target_slot === 0) {
            this.sound = instrument.function();
            this.key = instrument.key;
            this.setOutputData(0, { sound: this.sound, key: this.key });
          }
        } else {
          if (link_info.origin_slot === 0) {
            this.sound = false;
            this.key = false;
            this.setOutputData(0, { sound: this.sound, key: this.key });
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

  SequencerNode.prototype.onRemoved = function() {
    if (this.sequencer) {
      this.sequencer.stop();
      this.sequencer = false;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = false;
    }
  };

  SequencerNode.prototype.onExecute = function() {
    if (this.sequencer) {
      let values =
        this.getInputData(1) == null
          ? defaults[this.sequencer.key]
          : this.getInputData(1);
      let timings =
        this.getInputData(2) == null ? [10000] : this.getInputData(2);

      this.sequencer.values = values;
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

    if (graph.status === LGraph.STATUS_RUNNING) {
      if (connected && link_info && link_info.data) {
        if (link_info.target_slot === 0) {
          if (this.sequencer) {
            this.sequencer.stop();
            this.sequencer = false;
          }
          if (this.source) {
            this.source.disconnect();
            this.source = false;
          }
          this.source = link_info.data.sound;
          this.source.connect();
          this.sequencer = Sequencer.make(
            defaults[link_info.data.key],
            [10000],
            this.source,
            link_info.data.key
          ).start();
        }
      } else if (link_info) {
        if (link_info.target_slot === 0) {
          if (this.sequencer) {
            this.sequencer.stop();
            this.sequencer = false;
          }
          if (this.source) {
            this.source.disconnect();
            this.source = false;
          }
        }
      }
    }
  };

  LiteGraph.registerNodeType("instrument/Sequencer", SequencerNode);
}
