export interface AttachmentN {
    name: string;
    url: string;
    entity: string;
    entityType: "Issue" | "Task" | 'Voice Note';
}