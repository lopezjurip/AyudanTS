/// <reference path="../typings/tsd.d.ts"/>

export function current_working_directory(): String {
    return process.cwd();
}

export var version = require("../package").version;
