# Progresser
> A simple yet intuitive progress bar.

![Cover Image](https://i.imgur.com/HLN7Mx5.png)

[![CodeFactor](https://www.codefactor.io/repository/github/apexiodacoder/progresser/badge)](https://www.codefactor.io/repository/github/apexiodacoder/progresser)
# Progresser
Install with **NPM**:

```
npm i progresser
```

```js
const { Progresser } = require('progresser')

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
    bar.interrupt('Another example');
  }
  bar.tick();
}, 100);
```
## Format
> new Progresser(>**format**<, options, callback)

Progresser requires a format for the the progress bar. The format has tokens that are replaced with information.

- `{bar}` - Is replaced with the actual progress bar.
- `{current}` - Is replaced with the current tick number.
- `{size}` - Is replaced with the size or total number of ticks.
- `{percent}` - Is replaced with the percent of the bar completed.
- `{spinner}` - If `spinner` is enable, then it is replaced with a spinner.

## Options
> new Progresser(format, >**options**<, callback)

These are options that can be enabled by passing an object in the second argument.

- `size` - The size of the progress bar. Defaults to `20`.
- `current` - The amount of completed ticks in the progress bar. Defaults to `0`.
- `spinner` - Whether or not to enable the spinner. Defaults to `true`.
- `spinnerStyle` - The style of the spinner. Defaults to `dots`.
- `stream` - Which stream you want the progress bar to be. Defaults to `process.stderr`.
- `colored` - Whether or not if you want the ticks in the progress bar to be colored. Defaults to `true`.
- `colors` - The colors to use if the progress bar has `colored` enabled.
  - `complete` - The color for the completed tick. Defaults to `chalk.blueBright`.
  - `incomplete` - The color for the incomplete tick. Defaults to `chalk.gray`.
- `chars` - The characters to use for different parts of the progress bar.
  - `prefix` - The character in front of the progress bar. Defaults to `[`.
  - `suffix` - The character at the end of the progress bar. Defaults to `]`.
  - `complete` - The character to use for completed ticks. Defaults to `#`.
  - `incomplete` - The character to use for incomplete ticks. Defaults to `-`.

## Callback
> new Progresser(format, options, >**callback**<)

The function that will be run run once the progress bar is complete.

## Progresser.tick()
> new Progresser(format, options, callback).tick(messageFormat)

A function which completes one tick of the progress bar. The format of the text after the progress bar can be changed with `messageFormat`.

## Progresser.interrupt()
> new Progresser(format, options, callback).interrupt(message)

A function which interrupts the progress bar and sends a message.

## Progresser.terminate()
> new Progresser(format, options, callback).terminate()

A function which ends the progress bar.

# Spinner
> new Spinner(style, stream, onProgressBar)

Along with a progress bar, progresser comes with a spinner.

## Style
> new Spinner(>**style**<, stream, onProgressBar)

The style of spinner. The available styles are listed [here](https://github.com/ApexioDaCoder/progresser/blob/master/src/utils/spinners.json).

## Style
> new Spinner(style, >**stream**<, onProgressBar)

The stream in which the spinner will occur.

## OnProgressBar
> new Spinner(style, stream, >**onProgressBar**<)

An internal argument which is used to detect if the spinner is in a progress bar.

## Spinner.insert()
> new Spinner(style, stream, onProgressBar).insert(format)

Insert the spinner into a string and write it into the stream.

### Spinner.insert() Format
> new Spinner(style, stream, onProgressBar).insert(>**format**<)

The spinner also has tokens.
- `{spinner}` - Is replaced with the spinner.

## Spinner.spin()
> new Spinner(style, stream, onProgressBar).spin()

Spin the spinner once. Used internally, so does not need to be called.

## Spinner.current()
> new Spinner(style, stream, onProgressBar).current()

Get the current spin state. Used internally for progress bar, so does not need to be called.

## Spinner.terminate()
> new Spinner(style, stream, onProgressBar).terminate()

Terminate the spinner.

# License
MIT