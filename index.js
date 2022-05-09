const TASKS = 32;
const CANVAS_SIZE = 512;
const THREADS = navigator.hardwareConcurrency ?? 1;

const canvasEl = document.getElementById("c");
const infoEl = document.getElementById("info");

// Canvas rects to be rendered.
const tasks = [...new Array(TASKS)].map((_, n) => ({
  x: 0,
  y: n * (CANVAS_SIZE / TASKS),
  w: CANVAS_SIZE,
  h: CANVAS_SIZE / TASKS,
}));

const render = () => {
  const ctx = canvasEl.getContext("2d");
  ctx.canvas.width = CANVAS_SIZE;
  ctx.canvas.height = CANVAS_SIZE;

  infoEl.innerText = `Multithread: ${THREADS}`;

  let completedThreads = 0;

  const done = (w) => {
    w.terminate();
    completedThreads++;

    if (completedThreads === THREADS) infoEl.innerText += " - [DONE]";
  };

  const nextTask = (w) => {
    if (!tasks.length) return done(w);

    // Grab a task from the top of the stack, if available.
    w.postMessage(tasks.shift());
  };

  [...new Array(THREADS)].map((_) => {
    const w = new Worker("renderer.js");
    w.addEventListener("message", (e) => {
      // Copy buffer onto the main canvas.
      const chunk = ctx.createImageData(e.data.task.w, e.data.task.h);
      for (let i = 0; i < e.data.buf.length; i++) chunk.data[i] = e.data.buf[i];
      ctx.putImageData(chunk, e.data.task.x, e.data.task.y);

      // Assign each worker a new task, if available.
      nextTask(w);
    });

    // Assign each worker their first task, if available.
    nextTask(w);

    return w;
  });
};

render();
