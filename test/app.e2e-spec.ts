import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const movieData = {
    title: "Test Movie 2",
    director: "Test Director 2",
    year: 2022,
    genres: ["action", "comedy"],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to my Movie API');
  });

  describe('/movies', () => {
    it('POST', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send(movieData)
        .expect(201)
        .expect({ id: 0, ...movieData });
    });

    it('GET', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect([{ id: 0, ...movieData }]);
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
      genres: ["Updated", "genres"],
    };

    it('GET', () => {
      return request(app.getHttpServer())
        .get('/movies/0')
        .expect(200)
        .expect({ id: 0, ...movieData });
    });

    it('PATCH', () => {
      return request(app.getHttpServer())
        .patch('/movies/0')
        .send(updateData)
        .expect(200)
        .expect({ id: 0, ...updateData });
    });

    it('PATCH 400', () => {
      return request(app.getHttpServer())
        .patch('/movies/0')
        .send({ error: "error" })
        .expect(400);
    });
    
    it('DELETE', () => {
      return request(app.getHttpServer())
        .delete('/movies/0')
        .expect(200)
        .expect({ id: 0, ...updateData });
    });

    it('GET 404', () => {
      return request(app.getHttpServer())
        .get('/movies/0')
        .expect(404);
    });

    it('PATCH 404', () => {
      return request(app.getHttpServer())
        .get('/movies/0')
        .expect(404);
    });

    it('DELETE 404', () => {
      return request(app.getHttpServer())
        .get('/movies/0')
        .expect(404);
    });
  });
});
