'use strict';

import * as Print from './print';

export default function invariant(predicate, message) {
  if (!predicate) {
    Print.error(message);
    process.exit(1);
  }
}
