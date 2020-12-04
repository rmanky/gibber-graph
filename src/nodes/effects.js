export function init() {
  let list = [
    {
      name: "BitCrusher",
      function: params => BitCrusher(params),
      props: { bitDepth: 0.5, sampleRate: 0.5 }
    },
    {
      name: "Buffer Shuffler",
      function: params => Shuffler(params),

      props: {
        rate: 22050,
        chance: 0.25,
        reverseChance: 0.5,
        repitchChance: 0.5,
        repitchMin: 0.5,
        repitchMax: 2,
        pan: 0.5,
        mix: 0.5
      }
    },
    {
      name: "Chorus",
      function: params => Chorus(params),

      props: {
        slowFrequency: 0.18,
        slowGain: 3,
        fastFrequency: 6,
        fastGain: 1,
        inputGain: 1
      }
    },
    {
      name: "Delay",
      function: params => Delay(params),

      props: { feedback: 0.5, time: 11025, wetdry: 0.5 }
    },
    {
      name: "Distortion",
      function: params => Distortion(params),

      props: { shape1: 0.1, shape2: 0.1, pregain: 5, postgain: 0.5 }
    },
    {
      name: "Flanger",
      function: params => Flanger(params),

      props: { feedback: 0.81, offset: 0.125, frequency: 1 }
    },
    {
      name: "Ring Mod",
      function: params => RingMod(params),

      props: { frequency: 220, gain: 1, mix: 1 }
    },
    {
      name: "Freeverb",
      function: params => Freeverb(params),

      props: {
        wet1: 1,
        wet2: 0,
        dry: 0.5,
        roomSize: 0.925,
        damping: 0.5
      }
    },
    {
      name: "Vibrato",
      function: params => Vibrato(params),
      props: { feedback: 0.01, amount: 0.5, frequency: 4 }
    }
  ];

  list.forEach(object => {
    function Node() {
      this.addInput("instrument", "instrument");
      this.addOutput("instrument", "instrument");
      Object.keys(object.props).forEach(key => {
        this.addInput(key, "number");
      });

      this.effect = object.function;
    }

    function mapNodeInput(node, input, effect) {
      node.gibberishInput = input;
      node.gibberishEffect = node.effect({
        input: node.gibberishInput.sound
      });
      if (graph.status === LGraph.STATUS_RUNNING) {
        node.gibberishEffect.connect();
      }
    }

    //name to show
    Node.title = object.name;

    Node.prototype.onStart = function() {
      // need to check if gibberishInput exists
      if (this.getInputData(0)) {
        mapNodeInput(this, this.getInputData(0));
      }
    };

    Node.prototype.onAdded = function() {
      if (this.getInputData(0)) {
        mapNodeInput(this, this.getInputData(0));
      }

      ///

      // this is a Gibberish Effect
      //this.effect = object.function();

      // this is a Gibberish Instrument
      //this.input = this.getInputData(0);
    };

    Node.prototype.onRemoved = function() {
      if (this.gibberishEffect) {
        this.gibberishEffect.disconnect();
      }
    };

    Node.prototype.onStopped = function() {
      if (this.gibberishEffect) {
        this.gibberishEffect.disconnect();
      }
    };

    Node.prototype.onExecute = function() {
      //connect this.gibberishEffect and set input on that object to gibberishInput object
      if (this.gibberishEffect) {
        Object.keys(object.props).forEach((key, i) => {
          let value = isNaN(this.getInputData(i + 1))
            ? object.props[key]
            : this.getInputData(i + 1);
          this.gibberishEffect[key] = value;
        });
      }
    };

    Node.prototype.onConnectionsChange = function(
      connection,
      slot,
      connected,
      link_info
    ) {
      if (connection === LiteGraph.INPUT) {
        if (connected && link_info && link_info.data) {
          if (link_info.target_slot === 0) {
            mapNodeInput(this, link_info.data);
          }
        } else if (link_info) {
          // disconnnected?
          if (link_info.target_slot === 0) {
            if (this.gibberishEffect) {
              this.gibberishEffect.disconnect();
            }
          }
        }
      } else {
        this.setOutputData(0, this.gibberishInput);
      }

      // connected

      //alex needs to fix what this does lol
    };

    //register in the system
    LiteGraph.registerNodeType("effect/" + object.name, Node);
  });
}
