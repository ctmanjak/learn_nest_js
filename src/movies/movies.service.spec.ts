import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { Movie } from './entities/movies.entity';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);

    service.addMovie({
      title: "Test Movie",
      director: "Test Director",
      year: 2021,
      genres: ["action", "thriller"],
    })
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("addMovie", () => {
    it("should add a movie", () => {
      expect(service.addMovie({
        title: "Test Movie 2",
        director: "Test Director",
        year: 2021,
        genres: ["action", "thriller"],
      })).toEqual(service.getOne(1));
    });
  });

  describe("updateMovie", () => {
    it("should update a movie", () => {
      expect(service.updateMovie(0, {
        title: "Test Movie 2",
        director: "Test Director 2",
        year: 2022,
        genres: ["action", "comedy"],
      })).toEqual(service.getOne(0));
    });

    it("should throw NotFoundException", () => {
      try {
        service.updateMovie(999, {});
      } catch(e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('getAll', () => {
    it('should return a array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a Movie', () => {
      const result = service.getOne(0);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Movie);
    });

    it('should throw NotFoundException', () => {
      try {
        service.getOne(999);
      } catch(e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    })
  });

  describe("removeMovie", () => {
    it("should delete a movie", () => {
      const beforeDelete: number = service.getAll().length;
      service.removeMovie(0);
      const afterDelete: number = service.getAll().length;
      expect(afterDelete).toBeLessThan(beforeDelete);
    });

    it("should throw NotFoundException", () => {
      try {
        service.removeMovie(999);
      } catch(e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
