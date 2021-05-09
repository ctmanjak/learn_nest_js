import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovieDTO } from './dto/update-movie.dto';
import { Movie } from './entities/movies.entity';

@Injectable()
export class MoviesService {
    private movies: Movie[] = [];

    getAll(): Movie[] {
        return this.movies;
    }

    getOne(movieId: number): Movie {
        const foundMovie = this.movies.find(movie => movie.id === movieId);
        if (!foundMovie) {
            throw new NotFoundException(`Movie with ID ${movieId} not found.`);
        }
        return foundMovie;
    }

    addMovie(movieData: CreateMovieDTO): Movie {
        const movies_num = this.movies.length;
        this.movies.push(new Movie(movies_num ? this.movies[movies_num - 1].id + 1 : 0, movieData));
        return this.movies[movies_num];
    }

    removeMovie(movieId: number): Movie {
        return this.movies.splice(this.movies.findIndex(movie => movie.id === movieId), 1)[0];
    }

    updateMovie(movieId: number, patchData: UpdateMovieDTO): Movie {
        let foundMovie = this.movies.find(movie => movie.id === movieId);
        if (!foundMovie) {
            throw new NotFoundException(`Movie with ID ${movieId} not found.`);
        }
        return Object.assign(foundMovie, patchData);
    }
}
