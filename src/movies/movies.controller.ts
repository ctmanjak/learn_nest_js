import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('movies')
export class MoviesController {
    @Get()
    getAll(): string {
        return "all movies";
    }

    @Get("/:id")
    getOne(@Param("id") movieId: string) {
        return `movie: ${movieId}`;
    }

    @Post()
    create() {
        return "create movie";
    }

    @Delete("/:id")
    remove(@Param("id") movieId: string) {
        return `remove movie: ${movieId}`;
    }

    @Patch("/:id")
    patch(@Param("id") movieId: string) {
        return `patch movie: ${movieId}`;
    }
}
