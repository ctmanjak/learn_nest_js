import { IsMongoId, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Types } from "mongoose";

export class CreateGenreDTO {
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsMongoId({ each: true })
    readonly movies: Types.ObjectId[];
}