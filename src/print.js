'use strict';

import chalk from 'chalk';

export function info (...parts) {
  console.log(...parts);
}

export function success(...parts) {
  console.log(chalk.green(...parts));
}

export function error(...parts) {
  console.log(chalk.red(...parts));
}
