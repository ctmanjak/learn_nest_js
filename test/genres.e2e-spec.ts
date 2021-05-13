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
  const genreData = {
    name: "Test Genre"
  };
  let expectedDocument = {}
  let createdGenreId: string[] = [];

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
  describe('/genres', () => {
    it('POST', async () => {
        const res = await request(app.getHttpServer()).post('/genres').send(genreData)
        createdGenreId.push(res.body._id);
        expectedDocument = { _id: createdGenreId[0], __v: 0, movies: [], ...genreData };
        expect(res.status).toBe(201);
        expect(res.body).toEqual(expectedDocument);
    });

    it('GET', () => {
      return request(app.getHttpServer())
        .get('/genres')
        .expect(200)
        .expect([expectedDocument]);
    });
    
    it('POST 400', () => {
      return request(app.getHttpServer())
        .post('/genres')
        .send({ ...genreData, error: "error" })
        .expect(400)
    });
  });

  describe("/genres/:id", () => {
    const updateData = {
      name: "Updated Genre",
    };

    it('GET', () => {
        return request(app.getHttpServer())
            .get(`/genres/${createdGenreId}`)
            .expect(200)
            .expect(expectedDocument);
    });

    it('PATCH', () => {
        Object.assign(expectedDocument, updateData);
        return request(app.getHttpServer())
            .patch(`/genres/${createdGenreId}`)
            .send(updateData)
            .expect(200)
            .expect(expectedDocument);
    });

    it('PATCH 400', () => {
        return request(app.getHttpServer())
            .patch(`/genres/${createdGenreId}`)
            .send({ error: "error" })
            .expect(400);
    });
    
    it('DELETE', () => {
        return request(app.getHttpServer())
            .delete(`/genres/${createdGenreId}`)
            .expect(200)
            .expect(expectedDocument);
    });

    it('GET 404', () => {
      return request(app.getHttpServer())
        .get(`/genres/${createdGenreId}`)
        .expect(404);
    });

    it('PATCH 404', () => {
      return request(app.getHttpServer())
        .get(`/genres/${createdGenreId}`)
        .expect(404);
    });

    it('DELETE 404', () => {
      return request(app.getHttpServer())
        .get(`/genres/${createdGenreId}`)
        .expect(404);
    });
  });
});
