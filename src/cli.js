#! /usr/bin/env node
'use strict';

import cli from 'commander';
import pkg from '../package.json';
import invariant from './invariant';

var inputs = {
  target: null,
  files: []
};

cli
  .version(pkg.version)
  .arguments('[channel|user] [files...]', 'upload a file(s) to a channel or user')
  .action((target, files) => {
    inputs.target = target;
    inputs.files = files;
  })
  .parse(process.argv);

invariant(
  !!inputs.target,
  'Please specify a target (channel or user) and a filename(s)'
);
invariant(
  inputs.files.length > 0,
  'Please specify a filename(s)'
);
