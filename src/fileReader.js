'use strict';

import fs from 'fs';
import path from 'path';

const normalizeFilename = filename => path.isAbsolute(filename) ? filename : path.join(process.cwd(), filename);

export const readFile = filename => fs.readFileSync(normalizeFilename(filename));

export const parseIntoLines = (file, start, end) => {
  return file
    .toString()
    .split('\n')
    .slice(start - 1, end - 1)
    .join('\n')
};

export const readFileIntoLines = (filename, start, end) => parseIntoLines(readFile(filename), start, end);
