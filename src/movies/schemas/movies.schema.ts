import { NotFoundException } from "@nestjs/common";
import { Prop, SchemaFactory, Schema, getModelToken } from "@nestjs/mongoose";
import { constants } from "buffer";
import { Document, Model, model, SchemaTypes, Types } from "mongoose";
import { GenreDocument } from "src/genres/schemas/genres.schema";

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    director: string;

    @Prop({ required: true })
    year: number;

    @Prop([{
        type: SchemaTypes.ObjectId, 
        ref: "Genre",
    }])
    genres: Types.ObjectId[];
}

export const MovieSchemaProvider = {
    name: Movie.name,
    useFactory: (genreModel: Model<GenreDocument>) => {
        const MovieSchema = SchemaFactory.createForClass(Movie);
        let checkMovieFound = async function() {
            await this.countDocuments().then(v => {
                if (v === 0) throw "MovieNotFound";
                return v;
            }).catch(e => {
                switch(e) {
                    case "MovieNotFound":
                        throw new NotFoundException(`Movie ID: ${this["_conditions"]["_id"]} not found`)
                }
            });
        }
        MovieSchema.pre("findOne", checkMovieFound);
        MovieSchema.pre("findOneAndDelete", checkMovieFound);
        MovieSchema.pre("findOneAndUpdate", checkMovieFound);
        MovieSchema.pre('save', async function() {
            let genre_id;
            console.log(this["_conditions"]);
            try {
                for (const [index, _genre_id] of Object.entries(this['genres'])) {
                    genre_id = _genre_id;
                    if (!(await genreModel.findById(genre_id))) {
                        throw "GenreNotFound";
                    }
                }
            } catch(e) {
                switch(e) {
                    case "CastError":
                    case "MovieNotFound":
                        throw new NotFoundException(`Movie ID: ${this._id} not found.`);
                        break;
                    case "GenreNotFound":
                        throw new NotFoundException(`Genre ID: ${genre_id} not found.`);
                        break;
                    case "GenreAlreadyIncluded":
                        throw new NotFoundException(`Genre ID: ${genre_id} is already included Movie ID: ${this._id}`)
                        break;
                    default:
                        throw e;
                }
            }
        });
        
        return MovieSchema;
    },
    inject: [getModelToken("Genre")]
}