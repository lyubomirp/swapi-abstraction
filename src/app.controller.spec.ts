import { Test, TestingModule } from '@nestjs/testing';
import { SwapiController } from './swapi.controller';
import { SwapiService } from './swapi.service';

describe('AppController', () => {
  let appController: SwapiController;

  beforeEach(async () => {
    const app: TestingModule =
      await Test.createTestingModule({
        controllers: [SwapiController],
        providers: [SwapiService],
      }).compile();

    appController =
      app.get<SwapiController>(SwapiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
