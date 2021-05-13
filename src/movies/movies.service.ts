import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Genre, GenreDocument } from 'src/genres/schemas/genres.schema';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovieDTO } from './dto/update-movie.dto';
import { Movie, MovieDocument } from './schemas/movies.schema';

@Injectable()
export class MoviesService {
    constructor(
        @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
        @InjectModel(Genre.name) private genreModel: Model<GenreDocument>
    ) {}

    async getAll(): Promise<Movie[]> {
        return this.movieModel.find().populate({ path: "genres", select: "-movies -__v"}).select("-__v");
    }

    async getOne(movieId: string): Promise<Movie> {
        const foundMovie = this.movieModel.findById(movieId).populate({ path: "genres", select: "-movies -__v"}).select("-__v");
        return await foundMovie.then((movie) => {
            if (movie === null) throw "MovieNotFound";
            return movie;
        })
        .catch((e) => {
            switch(e) {
                case "CastError":
                case "MovieNotFound":
                    throw new NotFoundException(`Movie ID: ${movieId} not found.`);
                    break;
                default:
                    throw e;
            }
        })
    }

    async createMovie(movieData: CreateMovieDTO): Promise<Movie> {
        const createdMovie = new this.movieModel(movieData);
        return await createdMovie.save();
    }

    async deleteMovie(movieId: string): Promise<Movie> {
        const foundMovie = this.movieModel.findOneAndDelete({ _id: movieId }).select("-__v");
        return await foundMovie.then((movie) => {
            if (movie === null) throw "MovieNotFound";
            return movie;
        })
        .catch((e) => {
            switch(e) {
                case "CastError":
                case "MovieNotFound":
                    throw new NotFoundException(`Movie ID: ${movieId} not found.`);
                    break;
                default:
                    throw e;
            }
        })
    }

    async updateMovie(movieId: string, patchData: UpdateMovieDTO): Promise<Movie> {
        const foundMovie = this.movieModel.findOneAndUpdate({ _id: movieId }, patchData, { new: true, useFindAndModify: false }).select("-__v");;
        return await foundMovie.then((movie) => {
            if (movie === null) throw "MovieNotFound";
            return movie.save();
        })
        .catch((e) => {
            switch(e) {
                case "CastError":
                case "MovieNotFound":
                    throw new NotFoundException(`Movie ID: ${movieId} not found.`);
                    break;
                default:
                    throw e;
            }
        })
    }

    async addGenre(movieId: string, genreId: string) {
        await this.genreModel.findById(genreId).catch((e) => {
            switch(e) {
                case "CastError":
                    throw new NotFoundException(`Genre ID: ${genreId} not found.`);
                    break;
                default:
                    throw e
            }
        })
        const foundMovie = this.movieModel.findById(movieId).select("-__v");;
        return await foundMovie.then((movie) => {
            if (movie === null) throw "MovieNotFound";
            else if (movie.genres.find(v => v.toHexString() === genreId)) throw "GenreAlreadyIncluded"

            movie.genres.push(Types.ObjectId(genreId));
            return movie.save();
        })
        .catch((e) => {
            switch(e) {
                case "CastError":
                case "MovieNotFound":
                    throw new NotFoundException(`Movie ID: ${movieId} not found.`);
                    break;
                case "GenreAlreadyIncluded":
                    throw new NotFoundException(`Genre ID: ${genreId} is already included Movie ID: ${movieId}`)
                    break;
                default:
                    throw e;
            }
        })
    }

    async removeGenre(movieId: string, genreId: string) {
        await this.genreModel.findById(genreId).then((genre) => {
            if (genre === null) throw "GenreNotFound";
            return genre;
        }).catch((e) => {
            switch(e) {
                case "CastError":
                case "GenreNotFound":
                    throw new NotFoundException(`Genre ID: ${genreId} not found.`);
                    break;
                default:
                    throw e;
            }
        })
        const foundMovie = this.movieModel.findById(movieId).select("-__v");;
        return await foundMovie.then((movie) => {
            const tmp = movie.genres.length;
            if (movie === null) throw "MovieNotFound";
            else if ((movie.genres = movie.genres.filter(v => v.toHexString() !== genreId)).length == tmp) throw "GenreNotIncluded"
            
            return movie.save();
        })
        .catch((e) => {
            switch(e) {
                case "CastError":
                case "MovieNotFound":
                    throw new NotFoundException(`Movie ID: ${movieId} not found.`);
                    break;
                case "GenreNotIncluded":
                    throw new NotFoundException(`Genre ID: ${genreId} is not included Movie ID: ${movieId}`)
                    break;
                default:
                    throw e;
            }
        })
    }
}
