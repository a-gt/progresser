const chalk = require('chalk');
const cliCursor = require('cli-cursor');
const _ = require('lodash');
const Spinner = require('./utils/spinner');

class Progresser {
  constructor (format = '{bar}', options = {}, callback = () => {}) {
    // Defaults
    const defaultOptions = {
      size         : 20,
      current      : 0,
      spinner      : true,
      spinnerStyle : 'dots',
      colored      : true,
      clear        : false,
      stream       : process.stderr,
      chars        : {
        complete   : '#',
        incomplete : '-',
        prefix     : '[',
        suffix     : ']',
      },
      colors       : {
        complete   : chalk.blueBright,
        incomplete : chalk.gray,
      },
    };
    // Deal with number options
    if (typeof options === 'number') options = { size: options };
    // Default Options
    options = _.merge({}, defaultOptions, options);
    // Deal with no progress bar in format
    if (!format.includes('{bar}'))
      throw new Error('You need to have at least one "{bar}" in the format for the progress bar.');

    // Set up vars
    this.format = format;
    this.size = options.size;
    this.current = options.current;
    this.spinner =
      options.spinner ? new Spinner(options.spinnerStyle, this.stream, true) :
      null;
    this.colored = options.colored;
    this.clear = options.clear;
    this.stream = options.stream;
    this.chars = options.chars;
    this.colors = options.colors;
    this.callback = callback;
    this.terminated = false;
    this.last = '';
    this.interruptions = 0;
    this.timer = null;
    // Start the progress bar
    cliCursor.hide();
    this.render();
    // Start the spinner
    if (options.spinner) {
      this.timer = setInterval(() => this.spin(), this.spinner.interval);
    }
  }

  // Generate the bar
  generate () {
    const chars = [];
    chars.push(this.chars.prefix);
    // Completed chars
    for (let i = 0; i < this.current; i++) {
      chars.push(
        (
          this.colored ? this.colors.complete :
          a => a)(this.chars.complete),
      );
    }
    // Incompleted chars
    for (let i = 0; i < this.size - this.current; i++) {
      chars.push(
        (
          this.colored ? this.colors.incomplete :
          a => a)(this.chars.incomplete),
      );
    }
    chars.push(this.chars.suffix);
    return chars.join('');
  }

  // Format the tokens
  formatStr (_format) {
    const format = _format || this.format;
    let ratio = this.current / this.size;
    ratio = Math.min(Math.max(ratio, 0), 1);
    let percent = Math.floor(ratio * 100);
    const message = format
      .replace(/\{bar\}/gi, this.generate())
      .replace(/\{current\}/gi, this.current)
      .replace(/\{size\}/gi, this.size)
      .replace(/\{percent\}/gi, percent)
      .replace(/\{spinner\}/gi, (this.spinner || { current: () => '{spinner}' }).current());
    return message;
  }

  // Render the bar
  render (format) {
    if (this.terminated) return;
    this.stream.cursorTo(0);
    this.stream.clearLine();
    this.stream.write(this.formatStr(format));
  }

  // Tick the bar up one
  tick (format) {
    if (this.terminated) return;
    this.current++;
    if (this.current > this.size) {
      return this.terminate();
    }

    let message = undefined;
    if (format) {
      const before = this.format.search('{bar}');
      const after = this.format.substr(0, before) + '{bar} ';
      message = after + format;
    }

    this.render(message);
  }

  interrupt (message) {
    this.interruptions++;
    this.stream.cursorTo(0);
    this.stream.moveCursor(0, this.interruptions);
    this.stream.write(`\n${this.formatStr(message)}`);
    this.stream.moveCursor(0, -this.interruptions);
  }

  // End bar
  terminate () {
    if (this.terminated) return;
    this.terminated = true;
    if (this.clear) {
      if (this.stream.clearLine) {
        this.stream.clearLine();
        this.stream.cursorTo(0);
        this.stream.moveCursor(0, this.interruptions);
      }
    }
    else {
      this.stream.moveCursor(0, this.interruptions);
      this.stream.write('\n');
    }
    if (this.spinner) clearInterval(this.timer);
    this.callback(this);
    cliCursor.show();
    return;
  }

  spin () {
    if (this.terminated) return;
    this.spinner.spin();
    this.render();
  }
}

module.exports = Progresser;

let timer = null;
const bar = new Progresser(
  `Progress Bar: {bar} {spinner} {current}${chalk.gray(chalk.bold('/'))}{size} {percent}%`,
  {},
  () => {
    clearInterval(timer);
    console.log(chalk.blueBright(chalk.bold('Done!')));
  },
);

timer = setInterval(() => {
  if (bar.current === 10) {
    bar.interrupt('hi');
  }
  if (bar.current === 15) {
    bar.interrupt('bye');
  }
  bar.tick();
}, 100);