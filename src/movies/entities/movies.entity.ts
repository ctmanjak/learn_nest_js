export interface MovieData {
    title: string;
    director: string;
    year: number;
    genres: string[];
}
export interface PatchData {
    title?: string;
    director?: string;
    year?: number;
    genres?: string[];
}

export class Movie implements MovieData {
    id: number;
    title: string;
    director: string;
    year: number;
    genres: string[];
}