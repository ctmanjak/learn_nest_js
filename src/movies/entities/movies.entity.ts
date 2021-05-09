import { CreateMovieDTO } from "../dto/create-movie.dto";

export class Movie {
    title: string;
    director: string;
    year: number;
    genres: string[];

    constructor(
        public id: number,
        movieData: CreateMovieDTO,
    ) {
        Object.assign(this, movieData);
    }
}