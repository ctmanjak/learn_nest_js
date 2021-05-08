import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Movie, MovieData, PatchData } from './entities/movies.entity';
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
    getOne(@Param("id") movieId: string): Movie {
        return this.moviesService.getOne(+movieId);
    }

    @Post()
    addMovie(@Body() movieData: MovieData): Movie {
        return this.moviesService.addMovie(movieData);
    }

    @Delete(":id")
    removeMovie(@Param("id") movieId: string): Movie {
        return this.moviesService.removeMovie(+movieId);
    }

    @Patch(":id")
    patchMovie(@Param("id") movieId: string, @Body() patchData: PatchData): object {
        /** 
         * PatchData 인터페이스에 없는 프로퍼티가 들어오면 그대로 Movie 클래스에 추가되는 문제
         * 검사해서 빼든가 업데이트할 때 PatchData에 있는 프로퍼티만 업데이트 하게 하든가 하자 */ 
        return this.moviesService.updateMovie(+movieId, patchData);
    }
}
