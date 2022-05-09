const TASKS = 32;
const CANVAS_SIZE = 512;
const CHANNELS = 4;

self.addEventListener("message", function (e) {
  // Render an async chunk
  const buf = new Uint8Array(CHANNELS * CANVAS_SIZE * e.data.h);

  for (let y = 0; y < e.data.h; y++) {
    for (let x = 0; x < e.data.w; x++) {
      const i = y * (e.data.w * CHANNELS) + x * CHANNELS;
      buf[i + 0] = Math.random() * 255;
      buf[i + 1] = Math.random() * 255;
      buf[i + 2] = Math.random() * 255;
      buf[i + 3] = 255;
    }
  }

  // Artificial lag for distributed render viz.
  setTimeout(() => {
    self.postMessage({ task: e.data, buf });
  }, Math.random() * 2 * 500 + 500);
});
