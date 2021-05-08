import { Get, Injectable, Param } from '@nestjs/common';
import { Movie, MovieData, PatchData } from './entities/movies.entity';

@Injectable()
export class MoviesService {
    private movies: Movie[] = [];

    getAll(): Movie[] {
        return this.movies;
    }

    getOne(movieId: number): Movie {
        return this.movies.find(movie => movie.id === movieId);
    }

    addMovie(movieData: MovieData): Movie {
        this.movies.push({
            id: this.movies.length,
            ...movieData,
        })
        return this.movies[this.movies.length-1];
    }

    removeMovie(movieId: number): Movie {
        return this.movies.splice(this.movies.findIndex(movie => movie.id === movieId), 1)[0];
    }

    updateMovie(movieId: number, patchData: PatchData): object {
        return Object.assign(this.movies.find(movie => movie.id === movieId), patchData);
    }
}
