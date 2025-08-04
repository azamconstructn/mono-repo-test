export type entityType =
    | 'Project'
    | 'issue'
    | 'task'
    | 'progress'
    | 'permission'
    | 'capture'
    | 'sharelink'
    | 'Note'
export interface UserEntityRole {
    user: string;
    role: string;
    entityId: string;
    entityType: entityType;
}