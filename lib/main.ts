/// <reference path="../typings/tsd.d.ts"/>

import yargs = require("yargs");
import {version, author} from "./util";

const courseFile = "course.json";
const coursePath = "./" + courseFile;
const widht = Math.min(120, yargs.terminalWidth());

var argv = yargs.usage(`Usage: $0 <command> [--course=<path>] [--help]`)

    .command("init", "create a course.json configuration file", (yargs) => {
        argv = yargs.usage(`Usage: $0 init [--provider=<github|bitbucket|gitlab>] [--name=<name>] [--methodology=<individual|group>] [--students=<path>] [--assistants=<path>] [--teachers=<path>] [--force] [--help]`)
            .example("$0 init --name IIC2233-2015-2 -p github -m individual", "# creating course to manage https://github.com/IIC2233-2015-2 organization")
            .option("p", {
                alias: "provider",
                description: "git hosting provider",
                choices: ["github", "bitbucket", "gitlab"],
                demand: true,
                required: true,
                string: true,
            })
            .option("n", {
                alias: "name",
                description: "course's name, must match provider organization repository name",
                demand: true,
                required: true,
                string: true,
            })
            .option("m", {
                alias: "methodology",
                description: "individual or group projects",
                choices: ["individual", "group"],
                demand: true,
                required: true,
                string: true,
            })
            .option("s", {
                alias: "students",
                description: "path to students.csv file",
                default: "./students.csv",
                string: true,
            })
            .option("a", {
                alias: "assistants",
                description: "path to assistants.csv file",
                default: "./assistants.csv",
                string: true,
            })
            .option("t", {
                alias: "teachers",
                description: "path to teachers.csv file",
                default: "./teachers.csv",
                string: true,
            })
            .option("f", {
                alias: "force",
                description: "override course.json file if present",
                default: false,
                boolean: true,
            })
            .help("help").alias("h", "help")
            .wrap(widht)
            .argv;
    })

    .config("course", "path to the JSON settings file, create one with 'init'")
    .alias("c", "course").default("c", "./course.json").string("c")

    .version(version).alias("v", "version")
    .help("help").alias("h", "help")
    .wrap(widht)
    .epilog(author)
    .argv;

const command = argv._[0];
if (command === "init") {
    const json = require("./commands/init").createCourseJSON(argv);
    require("./commands/init").writeFile(courseFile, coursePath, json, argv.force);
} else {
    yargs.showHelp();
}
