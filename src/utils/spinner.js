const spinners = require('./spinners.json');
const cliCursor = require('cli-cursor');
const readline = require('readline');

class Spinner {
  constructor (style = 'dots', stream = process.stderr, onProgressBar = false) {
    // Make sure spinner style is allowed
    let spinData = spinners[style];
    if (!spinData) {
      if (style.constructor === Array)
        spinData = {
          interval : 100,
          frames   : style,
        };
      else spinData = spinners['dots'];
    }

    // Vars
    this.iteration = 0;
    this.frames = spinData.frames;
    this.interval = spinData.interval;
    this.stream = stream;
    this.onProgressBar = onProgressBar;
  }

  // Insert spinner into string
  insert (format) {
    if (!this.onProgressBar) {
      if (!format.includes('{spinner}'))
        throw new Error('You need to have at least one "{spinner}" in the format for the spinner.');
      cliCursor.hide();
      const x = format.search('{spinner}');
      const message = format.replace(/\{spinner\}/gi, this.current());
      this.stream.write(message);
      this.timer = setInterval(() => {
        readline.cursorTo(this.stream, x);
        this.stream.write(this.spin());
      }, this.interval);
    }
  }

  // Spin the spinner once
  spin () {
    this.iteration++;
    if (this.iteration >= this.frames.length) this.iteration = 0;
    return this.frames[this.iteration];
  }

  // Current spin state
  current () {
    return this.frames[this.iteration];
  }

  // Terminate spinner
  terminate () {
    cliCursor.show();
    clearInterval(this.timer);
    this.stream.write('\n');
    return true;
  }
}

module.exports = Spinner;
