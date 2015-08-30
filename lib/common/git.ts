/// <reference path="../../typings/tsd.d.ts"/>

import {resolve, dirname} from 'path'
import mkdirp = require('mkdirp')
import {writeFileSync} from 'fs'
const Octokat = require('octokat')

function writeFileSyncWithPath(path: string, data: string, encoding: string) {
    let made = mkdirp.sync(dirname(path))
    writeFileSync(path, new Buffer(data, encoding))
}

export interface FilePath {
    relative: string
    full: string
}

export interface FileBlob {
    path: string
    content: any
    encoding: string
}

export interface IRepositoryInfo {
    repository: string
    organization: string
}

export interface ICreateRepo {
    name: string
    description?: string
    homepage?: string
    private?: boolean
    has_issues?: boolean
    has_wiki?: boolean
    has_downloads?: boolean
    team_id?: number
    auto_init?: boolean
    gitignore_template?: string
    license_template?: string
}

export interface ICreateIssue {
    title: string
    body?: string
    assignee?: string
    milestone?: number
    labels?: string[]
}

export class GitManager {
    public octo: any

    constructor(token: string, protected tempDir = './temp') {
        this.octo = new Octokat({ token: token })
        this.tempDir = tempDir
    }

    repository(info: IRepositoryInfo): Repository {
        return new Repository(this.octo, info, this.tempDir)
    }
}

export class Repository {
    public info: IRepositoryInfo
    protected octo: any
    protected head: any
    protected tempDir: string

    constructor(octo: any, info: IRepositoryInfo, tempDir: string = './temp') {
        this.octo = octo
        this.info = info
        this.tempDir = tempDir
    }

    public get org(): any {
        return this.octo.orgs(this.info.organization)
    }

    public get repo(): any {
        return this.org.repos(this.info.repository)
        // return this.octo.repos(this.info, this.info.name)
    }

    public get dir(): string {
        return resolve(this.tempDir, this.info.organization, this.info.repository)
    }

    public create(params: ICreateRepo = {
        name: this.info.repository,
        private: true,
        has_issues: true,
        has_wiki: false,
        has_downloads: false,
    }) {
        return this.repo.repo.create(params)
    }

    public download(path: string = '/'): Promise<FilePath[]> {
        return this.repo.contents(path).fetch().then(contents => {
            let collection: any[] = (contents instanceof Array) ? contents : [contents]
            return Promise.all(collection.map(content => {
                if (content.type === 'dir') {
                    return this.download(content.path)
                } else {
                    return content.fetch().then(result => {
                        let writePath = resolve(this.dir, result.path)
                        writeFileSyncWithPath(writePath, result.content, result.encoding)
                        return { relative: content.path, full: writePath }
                    })
                }
            }))
        }).then(result => {
            function flatten(arr) {
                return arr.reduce(function(flat, toFlatten) {
                    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
                }, [])
            }
            return flatten(result)
        }).catch(err => {
            console.log('Fetch error', err)
            return err
        })
    }

    private fetchTree(): Promise<any> {
        return this.fetchHead().then(commit => {
            this.head = commit
            return this.repo.git.trees(commit.object.sha).fetch()
        })
    }

    private fetchHead(branch: string = 'master'): Promise<any> {
        return this.repo.git.refs.heads(branch).fetch()
    }

    public commitFiles(files: FileBlob[], message: string, branch: string = 'master'): Promise<any> {
        return Promise.all(files.map(file => {
            return this.repo.git.blobs.create({
                content: file.content,
                encoding: file.encoding
            })
        })).then(blobs => {
            return this.fetchTree().then(tree => {
                return this.repo.git.trees.create({
                    tree: files.map((file, index) => {
                        return {
                            path: file.path,
                            mode: '100644',
                            type: 'blob',
                            sha: blobs[index].sha
                        }
                    }),
                    base_tree: tree.sha
                })
            })
        }).then(tree => {
            return this.repo.git.commits.create({
                message: message,
                tree: tree.sha,
                parents: [
                    this.head.object.sha
                ]
            })
        }).then(commit => {
            return this.repo.git.refs.heads(branch).update({
                sha: commit.sha
            })
        }).then(result => {
            return result
        })
    }

    public createIssue(options: ICreateIssue): Promise<any> {
        return this.repo.issues.create(options)
    }
}
