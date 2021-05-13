import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchemaProvider } from 'src/movies/schemas/movies.schema';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { Genre, GenreSchema } from './schemas/genres.schema';

@Module({
    imports: [
        // MongooseModule.forFeature(
        //     [
        //         { name: Genre.name, schema: GenreSchema },
        //         // { name: Movie.name, schema: MovieSchema },
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
    controllers: [GenresController],
    providers: [GenresService],
})
export class GenresModule {}
