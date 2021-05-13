import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GenresModule } from './genres/genres.module';

@Module({
  imports: [
    MoviesModule,
    GenresModule,
    MongooseModule.forRoot("mongodb://localhost/movie",{
      useFindAndModify: false,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
