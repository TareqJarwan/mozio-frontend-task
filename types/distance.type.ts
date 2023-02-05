export interface Distance {
    name?: string;
    distance?: number;
}

export interface IDistanceRes {
    results: Distance[];
    total: number;
}