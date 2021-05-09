import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovieDTO } from './dto/update-movie.dto';
import { Movie } from './entities/movies.entity';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    getAll(): Movie[] {
        return this.moviesService.getAll();
    }

    @Get("search")
    searchMovie(@Query("year") movieYear: string): string {
        return `movies after ${movieYear}`;
    }

    @Get(":id")
    getOne(@Param("id") movieId: number): Movie {
        return this.moviesService.getOne(movieId);
    }

    @Post()
    addMovie(@Body() movieData: CreateMovieDTO): Movie {
        return this.moviesService.addMovie(movieData);
    }

    @Delete(":id")
    removeMovie(@Param("id") movieId: number): Movie {
        return this.moviesService.removeMovie(movieId);
    }

    @Patch(":id")
    patchMovie(@Param("id") movieId: number, @Body() patchData: UpdateMovieDTO): Movie {
        return this.moviesService.updateMovie(movieId, patchData);
    }
}
