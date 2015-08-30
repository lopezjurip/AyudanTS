/// <reference path="../../typings/tsd.d.ts"/>

import {Person, Student, Group, parseCSV} from './entities';
import {GitManager, Repository, IRepositoryInfo} from './git';

export interface Team {
    id: number
    url: string
    name: string
    slug: string
    description: string
    privacy: string
    permission: string
    members_url: string
    repositories_url: string
}

export interface Organization {
    login: string
    id: number
    url: string
    avatar_url: string
    description: string
    name: string
    company: string
    blog: string
    location: string
    email: string
    public_repos: number
    public_gists: number
    followers: number
    following: number
    html_url: string
    created_at: Date
    type: string
}

export interface ICoursePath {
    students?: string
    helpers?: string
    teachers?: string
    temp?: string
}

export interface ICourseRepoNames {
    syllabus?: string
    private?: string
    starter?: string
}

export interface ICreateTeam {
    name: string
    description?: string
    repo_names?: string[]
    privacy?: string
    permission?: string
}

export class Course {
    public manager: GitManager

    constructor(
        public name: string,
        token: string,
        public paths: ICoursePath = {
            students: './students.csv',
            helpers: './helpers.csv',
            teachers: './teachers.csv',
            temp: './temp',
        },
        public repoNames: ICourseRepoNames = {
            syllabus: 'syllabus',
            private: 'private',
            starter: 'starter',
        }
    ) {
        this.name = name
        this.manager = new GitManager(token, paths.temp)
        this.paths = paths
        this.repoNames = repoNames
    }

    public get students(): Student[] {
        return Student.fromFile(this.paths.students, this.name, 'utf8')
    }

    public get groups(): Group[] {
        return Group.fromFile(this.paths.students, this.name, 'utf8')
    }

    public get assistants(): Person[] {
        return Person.fromFile(this.paths.helpers, 'utf8')
    }

    public get teachers(): Person[] {
        return Person.fromFile(this.paths.teachers, 'utf8')
    }

    public get syllabus(): Repository {
        return this.manager.repository({
            organization: this.name,
            repository: this.repoNames.syllabus,
        })
    }

    public get starter(): Repository {
        return this.manager.repository({
            organization: this.name,
            repository: this.repoNames.starter,
        })
    }

    public get private(): Repository {
        return this.manager.repository({
            organization: this.name,
            repository: this.repoNames.private,
        })
    }

    private get org(): any {
        return this.manager.octo.orgs(this.name)
    }

    public get organization(): Promise<Organization> {
        return this.org.fetch()
    }

    public get teams(): Promise<Team[]> {
        return this.org.teams.fetch()
    }

    public createTeam(options: ICreateTeam): Promise<Team> {
        return this.org.teams.create(options)
    }

    public addMemberToTeam(person: Person, team: Team): Promise<any> {
        return this.manager.octo.teams(team.id).memberships.create({ username: person.username })
    }
}
