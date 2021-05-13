import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie, MovieDocument } from 'src/movies/schemas/movies.schema';
import { CreateGenreDTO } from './dto/create-genre.dto';
import { UpdateGenreDTO } from './dto/update-genre.dto';
import { Genre, GenreDocument } from './schemas/genres.schema';

@Injectable()
export class GenresService {
    constructor(
        @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
        @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    ) {}

    async getAll(): Promise<Genre[]> {
        return this.genreModel.find().populate("movies", "-genres");
    }

    async getOne(genreId: string): Promise<Genre> {
        const foundDocument = this.genreModel.findById(genreId).populate("movies", "-genres");
        return await foundDocument.then((genre) => {
            if (genre === null) throw 0;
            return genre;
        })
        .catch((e) => {
            switch(e) {
                case "CastError":
                default:
                    throw new NotFoundException(`Genre with ID ${genreId} not found.`);
            }
        })
    }

    async create(genreData: CreateGenreDTO): Promise<Genre> {
        const createdDocument = new this.genreModel(genreData);
        return createdDocument.save();
    }

    async delete(genreId: string): Promise<Genre> {
        const foundDocument = this.genreModel.findOneAndDelete({ _id: genreId });
        return await foundDocument.then((genre) => {
            if (genre === null) throw 0;
            return genre;
        })
        .catch((e) => {
            switch(e) {
                case "CastError":
                default:
                    throw new NotFoundException(`Genre with ID ${genreId} not found.`);
            }
        })
    }

    async update(genreId: string, patchData: UpdateGenreDTO): Promise<Genre> {
        const foundDocument = this.genreModel.findOneAndUpdate({ _id: genreId }, patchData, { new: true, useFindAndModify: false });
        return await foundDocument.then((genre) => {
            if (genre === null) throw 0;
            return genre.save();
        })
        .catch((e) => {
            switch(e) {
                case "CastError":
                default:
                    throw new NotFoundException(`Genre with ID ${genreId} not found.`);
            }
        })
    }

    async addChild(parentId: string, childId: string) {
        await this.movieModel.findById(childId).catch((e) => {
            switch(e) {
                case "CastError":
                default:
                    throw new NotFoundException(`Movie ID: ${childId} not found.`);
            }
        })
        const foundParent = this.genreModel.findById(parentId);
        return await foundParent.then((parent) => {
            if (parent === null) throw "ParentNotFound";
            else if (parent.movies.find(v => v.toHexString() === childId)) throw "ChildAlreadyIncluded"

            parent.movies.push(Types.ObjectId(childId));
            return parent.save();
        })
        .catch((e) => {
            switch(e) {
                case "CastError":
                case "ParentNotFound":
                    throw new NotFoundException(`Genre ID: ${parentId} not found.`);
                    break;
                case "ChildAlreadyIncluded":
                    throw new NotFoundException(`Movie ID: ${childId} is already included Genre ID: ${parentId}`)
                    break;
                default:
                    throw e;
            }
        })
    }

    async removeChild(parentId: string, childId: string) {
        await this.movieModel.findById(childId).catch((e) => {
            switch(e) {
                case "CastError":
                default:
                    throw new NotFoundException(`Movie ID: ${childId} not found.`);
            }
        })
        const foundParent = this.genreModel.findById(parentId);
        return await foundParent.then((parent) => {
            const tmp = parent.movies.length;
            if (parent === null) throw "ParentNotFound";
            else if ((parent.movies = parent.movies.filter(v => v.toHexString() !== childId)).length == tmp) throw "ChildNotIncluded"

            return parent.save();
        })
        .catch((e) => {
            switch(e) {
                case "CastError":
                case "ParentNotFound":
                    throw new NotFoundException(`Genre ID: ${parentId} not found.`);
                    break;
                case "ChildNotIncluded":
                    throw new NotFoundException(`Movie ID: ${childId} is not included Genre ID: ${parentId}`)
                    break;
                default:
                    throw e;
            }
        })
    }
}
