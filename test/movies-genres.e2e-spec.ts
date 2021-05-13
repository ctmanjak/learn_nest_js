import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MoviesModule } from '../src/movies/movies.module';
import { GenresModule } from '../src/genres/genres.module';
import { AppController } from '../src/app.controller';
import { closeInMongodConnection, rootMongooseTestModule } from './db';
import { disconnect } from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const movieData = {
    title: "Test Movie",
    director: "Test Director",
    year: 2021,
  };
  const genreData = {
    name: "Test Genre"
  };
  let expectedDocument = {};
  let movieIds: string[] = [];
  let genreIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          MoviesModule,
          GenresModule,
          rootMongooseTestModule(),
        ],
        controllers: [AppController],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
    movieIds.push((await request(app.getHttpServer()).post('/movies').send(movieData)).body._id);
    genreIds.push((await request(app.getHttpServer()).post('/genres').send(genreData)).body._id);
  });

  afterAll(async () => {
      await closeInMongodConnection();
      disconnect();
  });

  describe('/movies/:movie_id/genres/:genre_id', () => {
    it('PATCH', async () => {
        const res = await request(app.getHttpServer()).patch(`/movies/${movieIds[0]}/genres/${genreIds[0]}`)
        expectedDocument = { _id: movieIds[0], __v:1, genres: [genreIds[0]], ...movieData };
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expectedDocument);
    });

    it('GET', () => {
      let tmp = {...expectedDocument};
      Object.assign(tmp, {genres: [{__v: 0, _id: genreIds[0], ...genreData}]})
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect([tmp]);
    });

    it('DELETE', async () => {
      const res = await request(app.getHttpServer()).delete(`/movies/${movieIds[0]}/genres/${genreIds[0]}`)
      expectedDocument = { _id: movieIds[0], __v:2, genres: [], ...movieData };
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expectedDocument);
    });
  });

  describe('/genres/:genre_id/movies/:movie_id', () => {
    it('PATCH', async () => {
        const res = await request(app.getHttpServer()).patch(`/genres/${genreIds[0]}/movies/${movieIds[0]}`)
        expectedDocument = { _id: genreIds[0], __v:1, movies: [movieIds[0]], ...genreData };
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expectedDocument);
    });

    it('GET', () => {
      let tmp = {...expectedDocument};
      Object.assign(tmp, {movies: [{__v: 2, _id: movieIds[0], ...movieData}]})
      return request(app.getHttpServer())
        .get('/genres')
        .expect(200)
        .expect([tmp]);
    });

    it('DELETE', async () => {
      const res = await request(app.getHttpServer()).delete(`/genres/${genreIds[0]}/movies/${movieIds[0]}`)
      expectedDocument = { _id: genreIds[0], __v:2, movies: [], ...genreData };
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expectedDocument);
    });
  });
  //   it('POST 400', () => {
  //     return request(app.getHttpServer())
  //       .post('/genres')
  //       .send({ ...genreData, error: "error" })
  //       .expect(400)
  //   });
  // });

  // describe("/genres/:id", () => {
  //   const updateData = {
  //     name: "Updated Genre",
  //   };

  //   it('GET', () => {
  //       return request(app.getHttpServer())
  //           .get(`/genres/${createdGenreId}`)
  //           .expect(200)
  //           .expect(expectedDocument);
  //   });

  //   it('PATCH', () => {
  //       Object.assign(expectedDocument, updateData);
  //       return request(app.getHttpServer())
  //           .patch(`/genres/${createdGenreId}`)
  //           .send(updateData)
  //           .expect(200)
  //           .expect(expectedDocument);
  //   });

  //   it('PATCH 400', () => {
  //       return request(app.getHttpServer())
  //           .patch(`/genres/${createdGenreId}`)
  //           .send({ error: "error" })
  //           .expect(400);
  //   });
    
  //   it('DELETE', () => {
  //       return request(app.getHttpServer())
  //           .delete(`/genres/${createdGenreId}`)
  //           .expect(200)
  //           .expect(expectedDocument);
  //   });

  //   it('GET 404', () => {
  //     return request(app.getHttpServer())
  //       .get(`/genres/${createdGenreId}`)
  //       .expect(404);
  //   });

  //   it('PATCH 404', () => {
  //     return request(app.getHttpServer())
  //       .get(`/genres/${createdGenreId}`)
  //       .expect(404);
  //   });

  //   it('DELETE 404', () => {
  //     return request(app.getHttpServer())
  //       .get(`/genres/${createdGenreId}`)
  //       .expect(404);
  //   });
  // });
});
