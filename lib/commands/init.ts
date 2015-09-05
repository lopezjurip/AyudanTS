/// <reference path="../../typings/tsd.d.ts"/>

import * as fs from "fs";
import {version} from "./../util";

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

export function writeFile(name: string, path: string, json: any, force: boolean = false) {
    if (fs.existsSync(path) && !force) {
        console.log(`Error: ${name} file already exists in current directory`);
    } else {
        fs.writeFileSync("./course.json", JSON.stringify(json, null, 4));
        console.log(`created file ${name} on current directory`);
    }
}
