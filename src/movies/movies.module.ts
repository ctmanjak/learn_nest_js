import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from 'src/genres/schemas/genres.schema';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie, MovieSchemaProvider } from './schemas/movies.schema';

@Module({
    imports: [
        // MongooseModule.forFeature(
        //     [
        //         // { name: Movie.name, schema: MovieSchema },
        //         { name: Genre.name, schema: GenreSchema },
        //     ]
        // ),
        MongooseModule.forFeatureAsync(
            [
                {
                    name: Genre.name,
                    useFactory: () => {
                        return GenreSchema;
                    }
                },
                MovieSchemaProvider,
            ]
        )
    ],
    controllers: [MoviesController],
    providers: [MoviesService],
})
export class MoviesModule {}
