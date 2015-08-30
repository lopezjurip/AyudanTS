/// <reference path="../../typings/tsd.d.ts"/>

import {parse} from 'babyparse'
import {readFileSync} from 'fs'
import {IRepositoryInfo} from './git';

export function parseCSV(path: string, encoding: string = 'utf8', config: BabyParse.ParseConfig = {
    delimiter: ',',
    header: true,
    skipEmptyLines: true,
}): any[] {
    return parse(readFileSync(path, encoding), config).data
    /*
    const parsed = parse(readFileSync(path, encoding), config)
    return parsed.data.map(row => {
        let result: any = {}
        parsed.meta.fields.forEach(field => {
            result[field] = row[field]
        })
        return result
    })
    */
}

export class Person {
    constructor(public name: string, public username: string) {
        this.name = name
        this.username = username
    }

    static fromFile(path: string, encoding: string = 'utf8'): Person[] {
        return parseCSV(path, encoding).map(r => new this(r.name, r.username))
    }
}

export class Group implements IRepositoryInfo {
    constructor(public name: string, public organization: string, public members?: Person[]) {
        this.name = name
        this.organization = organization
        this.members = members || []
    }

    public get repository(): string {
        return this.name
    }

    public static fromFile(path: string, organization: string, encoding: string = 'utf8'): Group[] {
        return parseCSV(path, encoding).reduce((list, r) => {
            let group = list.find(g => g.name === r.group)
            if (!group) {
                group = new this(r.group, organization)
                list.push(group)
            }
            group.members.push(new Person(r.name, r.username))
            return list
        }, [])
    }
}

export class Student extends Person implements IRepositoryInfo {

    constructor(name: string, username: string, public organization: string) {
        super(name, username)
        this.organization = organization
    }

    public get repository(): string {
        return `${this.name}-repo`
    }

    static fromFile(path: string, organization: string, encoding: string = 'utf8'): Student[] {
        return parseCSV(path, encoding).map(r => new this(r.name, r.username, organization))
    }
}
