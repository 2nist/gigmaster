// Minimal mock for Tone.js used in tests
// Expose start() and simple transport to satisfy basic usage
module.exports = {
  start: () => Promise.resolve(),
  Transport: {
    start: () => {},
    stop: () => {},
    pause: () => {}
  },
  // default export compatibility with various import styles
  default: {
    start: () => Promise.resolve(),
    Transport: {
      start: () => {},
      stop: () => {}
    }
  }
};