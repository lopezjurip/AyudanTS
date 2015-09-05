/// <reference path="../../typings/tsd.d.ts"/>

import * as fs from "fs";
import {dirname} from "path";
import mkdirp = require("mkdirp");
import {version} from "./../util";
import {Person, Group} from "../common/entities";

export interface CourseJSONOptions {
    provider: string;
    name: string;
    students: string;
    assistants: string;
    teachers: string;
    methodology: string;
    force: boolean;
}

export function createCourseJSON(options: CourseJSONOptions): any {
    return {
        version: version,
        name: options.name,
        display: options.name + " - " + "[course name]",
        description: "Repositorios para el curso " + options.name,
        university: "Pontificia Universidad Católica de Chile",
        department: "Departamento de Ciencia de la Computación",
        provider: options.provider,
        members: {
            students: options.students,
            assistants: options.assistants,
            teachers: options.teachers,
        },
        repositories: {
            main: "syllabus",
            private: "private",
            starter: "starter",
        },
        classroom_settings: {
            methodology: options.methodology,
            private: true,
        },
    };
}

export function writeCSV(path: string, kind: string, groups: boolean = false) {
    const headers = ((groups) ? Group.headers : Person.headers).join(";");
    mkdirp.sync(dirname(path));
    fs.writeFileSync(path, headers);
    console.log(`created file ${kind} on ${path} directory`);
}

export function writeFile(name: string, path: string, json: any, force: boolean = false) {
    if (fs.existsSync(path) && !force) {
        console.log(`Error: ${name} file already exists in ${path} directory`);
    } else {
        mkdirp.sync(dirname(path));
        fs.writeFileSync(path, JSON.stringify(json, null, 4));
        console.log(`created file ${name} on ${path} directory`);
    }
}
