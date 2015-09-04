/// <reference path="../../typings/tsd.d.ts"/>

import error from "./../error-message";

export function args(yargs) {
    let argv = yargs.reset()
                    .usage("$0 members")
                    .command("students", "Manage students in this course")
                    .command("assistants", "Manage assistants in this course")
                    .command("teachers", "Manage teachers in this course")
                    .demand(2, error("Must declare the related entity."))
                    .help("help")
                    .argv;

    let command = argv._[0];

    console.log("Got:", argv, command);
}

export function createStudents(parameter) {
    throw new Error("Not implemented yet");
}
