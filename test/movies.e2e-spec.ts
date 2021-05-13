import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { GenresModule } from 'src/genres/genres.module';
import { AppController } from 'src/app.controller';
import { closeInMongodConnection, rootMongooseTestModule } from './db';
import { disconnect } from 'mongoose';
import { MoviesModule } from 'src/movies/movies.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const movieData = {
    title: "Test Movie",
    director: "Test Director",
    year: 2021,
  };
  let expectedDocument = {}
  let createdMovieId: string;

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
  });

  afterAll(async () => {
      await closeInMongodConnection();
      disconnect();
  });

  describe('/', () => {
    it('GET', async () => {
        return await request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Welcome to my Movie API');
    });
  });

  describe('/movies', () => {
    it('POST', async () => {
        const res = await request(app.getHttpServer()).post('/movies').send(movieData)
        createdMovieId = res.body._id;
        expectedDocument = { _id: createdMovieId, genres: [], ...movieData };
        expect(res.status).toBe(201);
        expect(res.body).toEqual(expectedDocument);
    });

    it('GET', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect([expectedDocument]);
    });
    
    it('POST 400', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ ...movieData, error: "error" })
        .expect(400)
    });
  });

  describe("/movies/:id", () => {
    const updateData = {
      title: "Updated Movie",
      director: "Updated Director",
      year: 2222,
    };

    it('GET', () => {
        return request(app.getHttpServer())
            .get(`/movies/${createdMovieId}`)
            .expect(200)
            .expect(expectedDocument);
    });

    it('PATCH', () => {
        Object.assign(expectedDocument, updateData);
        return request(app.getHttpServer())
            .patch(`/movies/${createdMovieId}`)
            .send(updateData)
            .expect(200)
            .expect(expectedDocument);
    });

    it('PATCH 400', () => {
        return request(app.getHttpServer())
            .patch(`/movies/${createdMovieId}`)
            .send({ error: "error" })
            .expect(400);
    });
    
    it('DELETE', () => {
        return request(app.getHttpServer())
            .delete(`/movies/${createdMovieId}`)
            .expect(200)
            .expect(expectedDocument);
    });

    it('GET 404', () => {
      return request(app.getHttpServer())
        .get(`/movies/${createdMovieId}`)
        .expect(404);
    });

    it('PATCH 404', () => {
      return request(app.getHttpServer())
        .get(`/movies/${createdMovieId}`)
        .expect(404);
    });

    it('DELETE 404', () => {
      return request(app.getHttpServer())
        .get(`/movies/${createdMovieId}`)
        .expect(404);
    });
  });
});
