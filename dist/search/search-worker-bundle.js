(() => {
  // node_modules/@jrc03c/make-key/src/index.mjs
  function makeKey(keyLength, charset, randomFn) {
    if (typeof keyLength !== "number" || isNaN(keyLength)) {
      throw new Error(
        "The first value passed into the `makeKey` function must be a number!"
      );
    }
    if (charset) {
      if (charset instanceof Array) {
        charset = charset.join("");
      }
      if (typeof charset !== "string") {
        throw new Error(
          "The second argument passed into the `makeKey` function must be a string or array of strings!"
        );
      }
    }
    randomFn = randomFn || Math.random;
    if (typeof randomFn !== "function") {
      throw new Error(
        "The third argument passed into the `makeKey` function must be a function!"
      );
    }
    let out = "";
    charset = charset || "abcdef1234567890";
    for (let i = 0; i < keyLength; i++) {
      out += charset[Math.floor(randomFn() * charset.length)];
    }
    return out;
  }

  // node_modules/@jrc03c/web-worker-helper/src/index.mjs
  var WebWorkerHelper = class _WebWorkerHelper {
    static Status = {
      CANCELLED: "CANCELLED",
      FAILED: "FAILED",
      FINISHED: "FINISHED",
      IN_PROGRESS: "IN_PROGRESS"
    };
    static isInWorkerContext() {
      return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
    }
    // main thread only
    rejects = [];
    worker = null;
    // worker only
    signals = [];
    constructor(path, options) {
      if (path) {
        this.worker = new Worker(path, options);
      }
      if (_WebWorkerHelper.isInWorkerContext()) {
        self.addEventListener("message", (event) => {
          if (!this.signals.includes(event.data.signal)) {
            return self.postMessage({
              signal: event.data.signal,
              status: _WebWorkerHelper.Status.FAILED,
              payload: `You tried to send a message with the signal "${event.data.signal}" to a worker, but no workers are listening for that signal!`
            });
          }
        });
      }
    }
    destroy() {
      this.rejects.forEach(
        (reject) => reject(
          "The worker instance was terminated by the WebWorkerHelper instance."
        )
      );
      this.rejects = [];
      this.worker.terminate();
      this.worker = null;
      return this;
    }
    exec(signal, payload, progress) {
      return new Promise((resolve, reject) => {
        try {
          signal = signal || makeKey(8);
          const callback = (event) => {
            if (event.data.signal === signal) {
              if (event.data.status === _WebWorkerHelper.Status.CANCELLED) {
                resolve(event.data.payload);
                console.warn(
                  `A WebWorkerHelper process with signal "${signal}" was cancelled!`
                );
                this.worker.removeEventListener("message", callback);
                if (this.rejects.includes(reject)) {
                  this.rejects.splice(this.rejects.indexOf(reject), 1);
                }
              } else if (event.data.status === _WebWorkerHelper.Status.FAILED) {
                reject(event.data.payload);
                this.worker.removeEventListener("message", callback);
                if (this.rejects.includes(reject)) {
                  this.rejects.splice(this.rejects.indexOf(reject), 1);
                }
              } else if (event.data.status === _WebWorkerHelper.Status.FINISHED || !event.data.status) {
                resolve(event.data.payload);
                this.worker.removeEventListener("message", callback);
                if (this.rejects.includes(reject)) {
                  this.rejects.splice(this.rejects.indexOf(reject), 1);
                }
              } else if (event.data.status === _WebWorkerHelper.Status.IN_PROGRESS) {
                if (progress) {
                  progress(event.data.payload);
                }
              }
            }
          };
          this.worker.addEventListener("message", callback);
          this.worker.postMessage({ signal, payload });
          this.rejects.push(reject);
        } catch (e) {
          reject(e);
          if (this.rejects.includes(reject)) {
            this.rejects.splice(this.rejects.indexOf(reject), 1);
          }
        }
      });
    }
    // NOTE: This method should only be called in a web worker context (i.e., not in the main thread).
    on(signal, callback) {
      if (!_WebWorkerHelper.isInWorkerContext()) {
        throw new Error(
          "The `WebWorkerHelper.on` method should only be invoked inside a web worker context!"
        );
      }
      const listener = async (event) => {
        if (event.data.signal === signal) {
          try {
            const result = await callback(event.data.payload, (p) => {
              self.postMessage({
                signal,
                status: _WebWorkerHelper.Status.IN_PROGRESS,
                payload: p
              });
            });
            self.postMessage({
              signal,
              status: _WebWorkerHelper.Status.FINISHED,
              payload: result
            });
          } catch (e) {
            self.postMessage({
              signal,
              status: _WebWorkerHelper.Status.FAILED,
              payload: e
            });
          }
        }
      };
      self.addEventListener("message", listener);
      this.signals.push(signal);
      return () => {
        if (this.signals.includes(signal)) {
          this.signals.splice(this.signals.indexOf(signal), 1);
        }
        self.removeEventListener("message", listener);
      };
    }
  };

  // src/pages/search/search-worker.mjs
  var worker = new WebWorkerHelper();
  var index;
  worker.on("set-index", async (payload) => {
    index = payload;
  });
  worker.on("search", async (payload) => {
    console.log("searching for:", payload);
    return [];
  });
})();
