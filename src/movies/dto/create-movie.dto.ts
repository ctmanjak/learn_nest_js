import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateMovieDTO {
    @IsString()
    readonly title: string;

    @IsString()
    readonly director: string;

    @IsNumber()
    readonly year: number;

    @IsOptional()
    @IsMongoId({ each: true })
    readonly genres: Types.ObjectId[];
}