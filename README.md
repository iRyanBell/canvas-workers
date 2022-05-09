# canvas-workers

Web workers offer a means of introducing multithreading & background processes to web apps. In this demo, a canvas is divided into task queue chunk. Each CPU core runs a worker thread, which request & fill sections of the image in parallel.
