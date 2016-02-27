import cli from 'commander';
import pkg from '../package.json';

cli
  .version(pkg.version)
  .parse(process.argv);

console.log(cli);
