import * as Instruments from "../nodes/instruments.js";
import * as Oscillators from "../nodes/oscillators.js";
import * as Helpers from "../nodes/helpers.js";

export function init() {
  Gibberish.workletPath =
    "https://raw.githack.com/gibber-cc/gibberish/v3/dist/gibberish_worklet.js";

  Gibberish.init().then(() => {
    console.log("Gibb is good");
    Gibberish.export(window);

    Instruments.init();
    Oscillators.init();
    Helpers.init();
  });
}
