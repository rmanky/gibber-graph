Gibberish.workletPath = "dist/gibberish_worklet.js";

Gibberish.init().then(() => {
    Gibberish.export(window);

    function OutputNode() {
        this.addInput("Source", "gibber");
        this.properties = {
        precision: 1
        };
    }

    OutputNode.title = "Output";

    OutputNode.prototype.onStart = function() {
        let data = this.getInputData(0);
        if (data && !this.source) {
            this.source = data;
            this.source.connect();
            console.log("output connect");
        }
    };

    OutputNode.prototype.onStop = function() {
        if (this.source) {
            this.source.disconnect();
            this.source = false;
            console.log("output disconnect");
        }
    }

    LiteGraph.registerNodeType("gibber/output", OutputNode);

    function SineNode() {
        this.addOutput("Output", "gibber");
        this.properties = {
        precision: 1
        };
        this.sine = Sine();
    }

    //name to show
    SineNode.title = "Sine";

    //function to call when the node is executed
    SineNode.prototype.onStart = function() {
        this.setOutputData(0, this.sine);
        console.log("sine output start");
    };

    SineNode.prototype.onStop = function() {
        this.setOutputData(0, false);
        console.log("sine output stop");
    }

    //register in the system
    LiteGraph.registerNodeType("gibber/sine", SineNode);

    function KickNode() {
        this.addOutput("Output", "gibber");
        this.properties = {
        precision: 1
        };
    }

    //name to show
    KickNode.title = "Kick";

    //function to call when the node is executed
    KickNode.prototype.onStart = function() {
        this.kick = Kick();
        this.kick.connect();
        this.setOutputData(0, this.kick);
        
        console.log("kick output start");
    };

    KickNode.prototype.onStop = function() {
        this.kick.disconnect();
        this.kick = false;
        this.setOutputData(0, this.kick);
        
        console.log("kick output stop");
    }

    //register in the system
    LiteGraph.registerNodeType("gibber/kick", KickNode);

    function SnareNode() {
        this.addOutput("Output", "gibber");
        this.properties = {
            precision: 1
        };
    }

    //name to show
    SnareNode.title = "Snare";

    //function to call when the node is executed
    SnareNode.prototype.onStart = function() {
        this.snare = Snare();
        this.snare.connect();
        this.setOutputData(0, this.snare);
        
        console.log("snare output start");
    };

    SnareNode.prototype.onStop = function() {
        this.snare.disconnect();
        this.snare = false;
        this.setOutputData(0, this.snare);
        
        console.log("snare output stop");
    }

    //register in the system
    LiteGraph.registerNodeType("gibber/snare", SnareNode);

    function SequencerNode() {
        this.addInput("Source", "gibber");
        this.addInput("Values", "array");
        this.addInput("Timings", "array");
        this.properties = {
            delay: 0
        }
    }

    SequencerNode.title = "Sequencer";

    SequencerNode.prototype.onStart = function() {
        let data = this.getInputData(0);
        let values = this.getInputData(1);
        let timings = this.getInputData(2);
        if (data && values && timings) {
            this.sequencer = Sequencer.make(values, timings, data, "trigger").start(this.properties.delay);
            this.setOutputData(0, this.sequencer);
            console.log("sequencer output start");
        }
    };

    SquareNode.prototype.onStop = function() {
        if (this.sequencer) {
            this.sequencer.stop();
            this.sequencer = false;
            this.setOutputData(0, this.sequencer);
            console.log("sequencer output stop");
        }
    }

    LiteGraph.registerNodeType("gibber/sequencer", SequencerNode);

    function SquareNode() {
        this.addInput("Source", "gibber");
        this.addOutput("Source", "gibber");
    }

    SquareNode.title = "Square";

    SquareNode.prototype.onStart = function() {
        let data = this.getInputData(0);
        if (data && !this.square) {
            this.square = Square({
                frequency: Add(440, data),
                gain: 0.25,
                antialias: true,
            });

            this.setOutputData(0, this.square);
            console.log("square output start");
        }
    };

    SquareNode.prototype.onStop = function() {
        if (this.square) {
            this.square = false;
            this.setOutputData(0, this.square);
            console.log("square output stop");
        }
    }

    LiteGraph.registerNodeType("gibber/square", SquareNode);
});