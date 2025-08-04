export type ModeCounts = { pending: number; slaMissed: number };

/** interface */
export interface ProjectMetrics {
    project: String;
    VD?: Record<string, ModeCounts>;  // e.g. { '360 Video': { … }, Laser: { … } }
    twoD?: Record<string, ModeCounts>;  // currently only '360 Video'
    colors?: string[];  // e.g. ['#FF0000', '#00FF00', '#0000FF']
    // aggregated stats
}