const { Progresser } = require('../')
const chalk = require('chalk')

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
    bar.interrupt('This is an example of an interruption.');
  }
  if (bar.current === 15) {
    bar.interrupt('Another example of an interruption!');
  }
  bar.tick();
}, 100);