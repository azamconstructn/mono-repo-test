export interface ProjectConfiguration {
    project: string;
    entity:
    "Issue"
    | "Task"
    | "BIM"
    | "Sheet"
    | "Tag"
    | "Note";

    type:
    "Type"
    | "Status"
    | "Priority";
    name: string;
    color: string;
    wbs?: number; // optional field for WBS (Work Breakdown Structure)
}