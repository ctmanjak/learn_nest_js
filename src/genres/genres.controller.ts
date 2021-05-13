import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateGenreDTO } from './dto/create-genre.dto';
import { UpdateGenreDTO } from './dto/update-genre.dto';
import { Genre } from './schemas/genres.schema';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
    constructor(private readonly genresService: GenresService) {}

    @Get()
    async getAll(): Promise<Genre[]> {
        return this.genresService.getAll();
    }

    @Get(":id")
    async getOne(@Param("id") movieId: string): Promise<Genre> {
        return this.genresService.getOne(movieId);
    }

    @Post()
    async createMovie(@Body() movieData: CreateGenreDTO): Promise<Genre> {
        return this.genresService.create(movieData);
    }

    @Delete(":id")
    async deleteMovie(@Param("id") movieId: string): Promise<Genre> {
        return this.genresService.delete(movieId);
    }

    @Patch(":id")
    patchMovie(@Param("id") movieId: string, @Body() patchData: UpdateGenreDTO): Promise<Genre> {
        return this.genresService.update(movieId, patchData);
    }

    @Patch(":genre_id/movies/:movie_id")
    addGenre(@Param("genre_id") genreId: string, @Param("movie_id") movieId: string): Promise<Genre> {
        return this.genresService.addChild(genreId, movieId);
    }

    @Delete(":genre_id/movies/:movie_id")
    removeGenre(@Param("genre_id") genreId: string, @Param("movie_id") movieId: string): Promise<Genre> {
        return this.genresService.removeChild(genreId, movieId);
    }
}
