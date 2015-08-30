import {Person, Student, Group, parseCSV} from './entities';
import {GitManager, Repository, IRepositoryInfo} from './git';

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

export class Course {
    public manager: GitManager

    constructor(
        public organization: string,
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
        this.organization = organization
        this.manager = new GitManager(token, paths.temp)
        this.paths = paths
        this.repoNames = repoNames
    }

    public get students(): Student[] {
        return Student.fromFile(this.paths.students, this.organization, 'utf8')
    }

    public get groups(): Group[] {
        return Group.fromFile(this.paths.students, this.organization, 'utf8')
    }

    public get assistants(): Person[] {
        return Person.fromFile(this.paths.helpers, 'utf8')
    }

    public get teachers(): Person[] {
        return Person.fromFile(this.paths.teachers, 'utf8')
    }

    public get syllabus(): Repository {
        return this.manager.repository({
            organization: this.organization,
            repository: this.repoNames.syllabus,
        })
    }

    public get starter(): Repository {
        return this.manager.repository({
            organization: this.organization,
            repository: this.repoNames.starter,
        })
    }

    public get private(): Repository {
        return this.manager.repository({
            organization: this.organization,
            repository: this.repoNames.private,
        })
    }
}
