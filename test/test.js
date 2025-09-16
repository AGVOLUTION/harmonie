import { states } from "./states.js";

(async () => {
  const tests = [
    states.bb(),
    states.bw(),
    states.by(),
    states.he(),
    states.mv(),
    states.nw(),
    states.sl(),
    states.th(),
  ];

  try {
    await Promise.all(tests);
    console.log("Passed all tests.");
  } catch (e) {
    console.error("Error:", e);
  }
})();
