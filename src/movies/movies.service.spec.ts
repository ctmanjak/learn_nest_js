// import { NotFoundException } from '@nestjs/common';
// import { ModuleTokenFactory } from '@nestjs/core/injector/module-token-factory';
// import { getModelToken, MongooseModule } from '@nestjs/mongoose';
// import { Test, TestingModule } from '@nestjs/testing';
// import { Model } from 'mongoose';
// import { Movie } from './entities/movies.entity';
// import { MoviesController } from './movies.controller';
// import { MoviesModule } from './movies.module';
// import { MoviesService } from './movies.service';
// import { MovieDocument, MovieSchema } from './schemas/movies.schema';

// const movies: Movie[] = [];

// describe('MoviesService', () => {
//   let service: MoviesService;
//   let controller: MoviesController;
//   const event = {
//     _id: "0",
//     title: "Test Movie",
//     director: "Test Director",
//     year: 2021,
//     genres: ["action", "thriller"],
//   }

//   class EventModel {
//     constructor(private data) {}
//     save = jest.fn().mockResolvedValue(this.data);
//     static find = jest.fn().mockResolvedValue([event]);
//     static findOne = jest.fn().mockResolvedValue(event);
//     static findById = jest.fn().mockResolvedValue(event);
//     static findOneAndUpdate = jest.fn().mockResolvedValue(event);
//     static deleteOne = jest.fn().mockResolvedValue(true);
//   }
  
//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         MoviesService,
//         {
//           provide: getModelToken(Movie.name),
//           useValue: EventModel,
//         }
//       ],
//     }).compile();

//     service = await module.get<MoviesService>(MoviesService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('getAll', () => {
//     it('should return an array of movie', async () => {
//       const result = ['test'];

//       expect(await service.getAll()).toStrictEqual([event]);
//       // expect(await service.getAll()).toBeInstanceOf(Array);
//     });
//   });

//   describe("addMovie", () => {
//     it("should add a movie", async () => {
//       expect(await service.addMovie(event)).toEqual(await service.getOne("1"));
//     });
//   });

//   describe("updateMovie", () => {
//     it("should update a movie", async () => {
//       expect(await service.updateMovie("0", {
//         title: "Test Movie 2",
//         director: "Test Director 2",
//         year: 2022,
//         genres: ["action", "comedy"],
//       })).toEqual(service.getOne("0"));
//       console.log(await service.getAll());
//     });
//   });
//   //   it("should throw NotFoundException", () => {
//   //     try {
//   //       service.updateMovie("999", {});
//   //     } catch(e) {
//   //       expect(e).toBeInstanceOf(NotFoundException);
//   //     }
//   //   });
//   // });

//   // describe('getAll', () => {
//   //   it('should return a array', () => {
//   //     const result = service.getAll();
//   //     expect(result).toBeInstanceOf(Promise);
//   //   });
//   // });

//   // describe('getOne', () => {
//   //   it('should return a Movie', () => {
//   //     const result = service.getOne("0");
//   //     expect(result).toBeDefined();
//   //     expect(result).toBeInstanceOf(Promise);
//   //   });

//   //   it('should throw NotFoundException', () => {
//   //     try {
//   //       service.getOne("999");
//   //     } catch(e) {
//   //       expect(e).toBeInstanceOf(NotFoundException);
//   //     }
//   //   })
//   // });

//   // describe("deleteMovie", () => {
//   //   it("should delete a movie", () => {
//   //     const beforeDelete: number = service.getAll().length;
//   //     service.deleteMovie("0");
//   //     const afterDelete: number = service.getAll().length;
//   //     expect(afterDelete).toBeLessThan(beforeDelete);
//   //   });

//   //   it("should throw NotFoundException", () => {
//   //     try {
//   //       service.deleteMovie("999");
//   //     } catch(e) {
//   //       expect(e).toBeInstanceOf(NotFoundException);
//   //     }
//   //   });
//   // });
// });
