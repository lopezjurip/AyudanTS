# Commands

Every command should be on a file and start as follow:
```ts
/// <reference path="../../typings/tsd.d.ts"/>

import error from './../error-message';

export function args(yargs) {
    // ...
}
```

The command will be associated to the file name.
