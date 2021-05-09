import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMovieDTO {
    @IsString()
    readonly title: string;

    @IsString()
    readonly director: string;

    @IsNumber()
    readonly year: number;

    @IsOptional()
    @IsString({each: true})
    readonly genres: string[];
}