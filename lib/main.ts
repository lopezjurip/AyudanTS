/// <reference path="../typings/tsd.d.ts"/>

import yargs = require("yargs");
import error from "./error-message";

yargs.usage("Usage: $0 <command> [-c \"course\"] [-h \"help\"]")
    .option("c", {
        alias: "course", demand: true, describe: "Course's organization name on Github", type: "string"
    })
    .command("members", "install command")
    .demand(1, error("Must provide a valid command"))
    .help("help")
    .alias("h", "help");

function onCommand(command, args) {
    try {
        exec(command, args);
    } catch (err) {
        args.showHelp();
    }
}

function exec(command: string, args: any) {
    require(`./commands/${command}`).args(args);
}
console.log("hey", __dirname);
console.log(process.cwd());

const command = yargs.argv._[0];
onCommand(command, yargs);
