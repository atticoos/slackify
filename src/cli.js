#! /usr/bin/env node
'use strict';

import Cli from 'commander';
import Promise from 'bluebird';
import pkg from '../package.json';
import chalk from 'chalk';
import invariant from './invariant';
import * as Print from './print';
import {uploadFile} from './client';
import {readFile} from './fileReader';
import {Spinner} from 'cli-spinner';
import through2 from 'through2';

const lineParser = lines => lines.split('..').map(Number);
const getAccessToken = () => Cli.token || process.env.SLACKIFY_TOKEN;

var spinner = new Spinner('Uploading..');
var fileName;
var channelName;

function getPipedData () {
  return new Promise((resolve, reject) => {
    var data = '';
    process.stdin.on('readable', () => {
      var chunk;
      while (chunk = process.stdin.read()) {
        data += chunk;
      }
    });
    process.stdin.on('end', () => resolve(data));
  });
}

function getFile (fileName) {
  if (process.stdin.isTTY) {
    return readFile(fileName).then(file => {
      if (Cli.lines) {
        invariant(
          lines[1] > lines[0],
          'Lines must be a valid range'
        );
        return parseIntoLines(file, Cli.lines[0], Cli.lines[1]);
      } else if (Cli.tail) {
        return parseTail(file, tail);
      }
      return file;
    });
  } else {
    return getPipedData();
  }
}

spinner.setSpinnerString(Spinner.spinners[process.platform === 'win32' ? 0 : 19]);

Cli
  .version(pkg.version)
  .arguments('[file]', 'upload a file to a channel or user')
  .arguments('[channel]', 'the channel to upload to')
  .option('-m --message <message>', 'a comment to add to the file')
  .option('-u --user <user>', 'the user to send the file to')
  .option('-l --lines <l1>..<l2>', 'upload specific lines in a file', lineParser)
  .option('-t --token <token>', 'slack token')
  .option('-tl --tail <tail>', 'tail of a file', Number)
  .action((arg1, arg2) => {
    if (process.stdin.isTTY) {
      fileName = arg1;
      channelName = arg2;
    } else {
      channelName = arg1;
    }
  })
  .parse(process.argv);


invariant(
  getAccessToken(),
  'Please add SLACKIFY_TOKEN environment variable or provide it as an argument -t --token'
);

invariant(
  channelName || Cli.user,
  'Please specify a target (channel or user) and a filename'
);

invariant(
  fileName || !process.stdin.isTTY,
  'Please specify a filename'
);

Print.info(`Uploading ${chalk.white(fileName)} to ${chalk.white(channelName || Cli.user)}`)
spinner.start();

getFile(fileName).then(file => {
  return uploadFile(
    getAccessToken(),
    file,
    fileName,
    channelName,
    Cli.user,
    Cli.message
  )
}).finally(() => {
  spinner.stop(true);
}).then(() => {
  Print.success('Upload complete!');
}).catch((error) => {
  Print.error('Upload failed with error', error);
});
