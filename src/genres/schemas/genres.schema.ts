import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";

export type GenreDocument = Genre & Document;

@Schema()
export class Genre {
    @Prop({ required: true })
    name: string;

    @Prop([{ type: SchemaTypes.ObjectId, ref: "Movie" }])
    movies: Types.ObjectId[];
}

export const GenreSchema = SchemaFactory.createForClass(Genre);