export function init() {
  let defaults = {
    trigger: [0.5, 0.75, 1.0],
    note: [220, 330, 440]
  };

  let list = [
    {
      name: "Clap",
      function: () => Clap(),
      key: "trigger",
      props: { gain: 1, spacing: 100, decay: 0.2, loudness: 1 }
    },
    {
      name: "Conga",
      function: () => Conga(),
      key: "trigger",
      props: { gain: 1, spacing: 100, decay: 0.2, loudness: 1 }
    },
    {
      name: "Cowbell",
      function: () => Cowbell(),
      key: "trigger",
      props: { gain: 1, decay: 0.5, loudness: 1 }
    },
    {
      name: "FM",
      function: () => FM(),
      key: "note",
      props: { gain: 0.5, attack: 44, decay: 22050 }
    },
    {
      name: "Hat",
      function: () => Hat(),
      key: "trigger",
      props: { gain: 0.5, tune: 0.6, decay: 0.1, loudness: 1 }
    },
    {
      name: "Karplus",
      function: () => Karplus(),
      key: "note",
      props: {
        gain: 0.5,
        decay: 0.97,
        loudness: 1,
        damping: 0.2,
        glide: 1
      }
    },
    {
      name: "Kick",
      function: () => Kick(),
      key: "trigger",
      props: { gain: 1, frequency: 85, tone: 0.25, decay: 0.9, loudness: 1 }
    },
    {
      name: "Snare",
      function: () => Snare(),
      key: "trigger",
      props: { gain: 0.5, tune: 0, snappy: 1, decay: 0.1, loudness: 1 }
    },
    {
      name: "Synth",
      function: () => Synth(),
      key: "note",
      props: {
        gain: 0.5,
        attack: 44,
        decay: 22050
      }
    },
    {
      name: "Tom",
      function: () => Tom(),
      key: "trigger",
      props: { gain: 1, frequency: 120, decay: 0.7, loudness: 1 }
    }
  ];

  //list.sort((a, b) => (a.name > b.name ? 1 : -1));

  list.forEach(instrument => {
    function Node() {
      this.addOutput("instrument", "instrument");
      Object.keys(instrument.props).forEach(key => {
        this.addInput(key, "number");
      });
    }

    //name to show
    Node.title = instrument.name;

    Node.prototype.onStart = function() {
      this.setOutputData(0, {
        sound: this.gibberishInstrument,
        key: this.gibberishKey
      });
    };

    Node.prototype.onAdded = function() {
      this.gibberishInstrument = instrument.function();
      this.gibberishKey = instrument.key;
      this.setOutputData(0, {
        sound: this.gibberishInstrument,
        key: this.gibberishKey
      });
    };

    Node.prototype.onExecute = function() {
      Object.keys(instrument.props).forEach((key, i) => {
        let value = isNaN(this.getInputData(i))
          ? instrument.props[key]
          : this.getInputData(i);
        this.gibberishInstrument[key] = value;
      });
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
          this.setOutputData(0, {
            sound: this.gibberishInstrument,
            key: this.gibberishKey
          });
        }
      }
    };

    //register in the system
    LiteGraph.registerNodeType("instrument/" + instrument.name, Node);
  });

  // --- SEQUENCER --- \\
  function SequencerNode() {
    this.addInput("instrument", "instrument");
    this.addInput("values", "array");
    this.addInput("timings", "array");
  }

  function mapSequencerInput(node, instrument) {
    node.gibberishInstrument = instrument.sound;
    node.gibberishSequencer.target = node.gibberishInstrument;
    node.gibberishSequencer.values = defaults[instrument.key];
    node.gibberishSequencer.key = instrument.key;
    if (graph.status === LGraph.STATUS_RUNNING) {
      node.gibberishInstrument.connect();
      node.gibberishSequencer.start();
    }
  }

  SequencerNode.title = "Sequencer";

  SequencerNode.prototype.onAdded = function() {
    if (this.getInputData(0)) {
      mapSequencerInput(this, this.getInputData(0));
    } else {
      this.gibberishInstrument;
      this.gibberishSequencer = Sequencer.make(
        defaults["trigger"],
        [15000],
        this.gibberishInstrument,
        "trigger"
      );
    }
  };

  SequencerNode.prototype.onRemoved = function() {
    if (this.gibberishInstrument) {
      this.gibberishSequencer.stop();
      this.gibberishInstrument.disconnect();
    }
  };

  SequencerNode.prototype.onStop = function() {
    if (this.gibberishInstrument) {
      this.gibberishSequencer.stop();
      this.gibberishInstrument.disconnect();
    }
  };

  SequencerNode.prototype.onStart = function() {
    if (this.gibberishInstrument) {
      this.gibberishInstrument.connect();
      this.gibberishSequencer.start();
    } else if (this.getInputData(0)) {
      mapSequencerInput(this, this.getInputData(0));
    }
  };

  SequencerNode.prototype.onExecute = function() {
    let values = this.getInputData(1);
    let timings = this.getInputData(2);
    if (values) {
      values = values.some(isNaN)
        ? defaults[this.gibberishSequencer.key]
        : values;
      this.gibberishSequencer.values = values;
    }
    if (timings) {
      timings = timings.some(isNaN) ? [10000] : timings;
      this.gibberishSequencer.timings = timings;
    }
  };

  SequencerNode.prototype.onConnectionsChange = function(
    connection,
    slot,
    connected,
    link_info
  ) {
    //only process the inputs events
    if (connection != LiteGraph.INPUT) {
      return;
    }

    if (connected && link_info && link_info.data) {
      if (link_info.target_slot === 0) {
        mapSequencerInput(this, link_info.data);
      }
    } else if (!connected && link_info) {
      if (link_info.target_slot === 0) {
        if (this.gibberishInstrument) {
          this.gibberishSequencer.stop();
          this.gibberishInstrument.disconnect();
          this.gibberishInstrument = false;
        }
      }
    }
  };

  LiteGraph.registerNodeType("instrument/Sequencer", SequencerNode);
}
