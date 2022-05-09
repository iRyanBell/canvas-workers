# canvas-workers

Web workers offer a means of introducing multithreading & background processes to web apps. In this demo, a canvas is divided into chunks within a task queue. Each CPU core runs a worker thread, which request & fill sections of the image in parallel.
