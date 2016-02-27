'use strict';

export default function invariant(predicate, message) {
  if (!predicate) {
    console.error(message);
    process.exit(1);
  }
}
