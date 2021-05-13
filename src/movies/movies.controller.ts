import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovieDTO } from './dto/update-movie.dto';
import { Movie } from './schemas/movies.schema';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    async getAll(): Promise<Movie[]> {
        return this.moviesService.getAll();
    }

    @Get(":id")
    async getOne(@Param("id") movieId: string): Promise<Movie> {
        return this.moviesService.getOne(movieId);
    }

    @Post()
    async createMovie(@Body() movieData: CreateMovieDTO): Promise<Movie> {
        return this.moviesService.createMovie(movieData);
    }

    @Delete(":id")
    async deleteMovie(@Param("id") movieId: string): Promise<Movie> {
        return this.moviesService.deleteMovie(movieId);
    }

    @Patch(":id")
    patchMovie(@Param("id") movieId: string, @Body() patchData: UpdateMovieDTO): Promise<Movie> {
        return this.moviesService.updateMovie(movieId, patchData);
    }

    @Patch(":movie_id/genres/:genre_id")
    addGenre(@Param("movie_id") movieId: string, @Param("genre_id") genreId: string): Promise<Movie> {
        return this.moviesService.addGenre(movieId, genreId);
    }

    @Delete(":movie_id/genres/:genre_id")
    removeGenre(@Param("movie_id") movieId: string, @Param("genre_id") genreId: string): Promise<Movie> {
        return this.moviesService.removeGenre(movieId, genreId);
    }
}
