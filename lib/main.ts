/// <reference path="../typings/tsd.d.ts"/>

import yargs = require("yargs");
import {join} from "path";
import {version, author} from "./util";
import * as init from "./commands/init";

const M_INDIVIDUAL = "individual";
const M_GROUP = "group";
const P_GITHUB = "github";
const P_BITBUCKET = "bitbucket";
const P_GITLAB = "gitlab";

const courseFile = "course.json";
const coursePath = join(".", courseFile);
const widht = Math.min(120, yargs.terminalWidth());

var argv = yargs.usage(`Usage: $0 <command> [--course=<path>] [--help]`)

    .command("init", "create a course.json configuration file", (yargs) => {
        argv = yargs.usage(`Usage: $0 init [--provider=<${P_GITHUB}|${P_BITBUCKET}|${P_GITLAB}>] [--name=<name>] [--methodology=<${M_INDIVIDUAL}|${M_GROUP}>] [--students=<path>] [--assistants=<path>] [--teachers=<path>] [--force] [--help]`)
            .example(`$0 init --name IIC2233-2015-2 -p ${P_GITHUB} -m ${M_INDIVIDUAL}`, "# creating course to manage https://github.com/IIC2233-2015-2 organization")
            .option("p", {
                alias: "provider",
                description: "git hosting provider",
                choices: [P_GITHUB, P_BITBUCKET, P_GITLAB],
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
                choices: [M_INDIVIDUAL, M_GROUP],
                demand: true,
                required: true,
                string: true,
            })
            .option("s", {
                alias: "students",
                description: "path to students.csv file",
                default: join(".", "members", "students.csv"),
                string: true,
            })
            .option("a", {
                alias: "assistants",
                description: "path to assistants.csv file",
                default: join(".", "members", "assistants.csv"),
                string: true,
            })
            .option("t", {
                alias: "teachers",
                description: "path to teachers.csv file",
                default: join(".", "members", "teachers.csv"),
                string: true,
            })
            .option("csv", {
                description: "create students, assistants and teachers .csv files (override if present)",
                default: false,
                boolean: true,
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
    .alias("c", "course").default("c", join(".", "course.json")).string("c")

    .version(version).alias("v", "version")
    .help("help").alias("h", "help")
    .wrap(widht)
    .epilog(author)
    .argv;

const command = argv._[0];
if (command === "init") {
    const json = init.createCourseJSON(argv);
    init.writeFile(courseFile, coursePath, json, argv.force);
    if (argv.csv) {
        const groups = json.classroom_settings.methodology === M_GROUP;
        init.writeCSV(json.members["students"], "students", groups);
        init.writeCSV(json.members["assistants"], "assistants", false);
        init.writeCSV(json.members["teachers"], "teachers", false);
    }
} else {
    yargs.showHelp();
}
