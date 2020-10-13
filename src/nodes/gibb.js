import * as Instruments from "./instruments.js";
import * as Oscillators from "./oscillators.js";
import * as Helpers from "./helpers.js";

window.onload = () => {
  Gibberish.workletPath =
    "https://raw.githack.com/gibber-cc/gibberish/v3/dist/gibberish_worklet.js";

  Gibberish.init().then(() => {
    console.log("Gibb is good");
    Gibberish.export(window);

    Instruments.init();
    Oscillators.init();
    Helpers.init();
  });
};
