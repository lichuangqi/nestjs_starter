import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;
  const cache = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: CACHE_MANAGER, useValue: cache }],
    }).compile();
    appController = app.get(AppController);
    jest.clearAllMocks();
  });

  it('reads the previous token and stores the next token', async () => {
    cache.get.mockResolvedValue('old token');
    await expect(appController.getHellov2('new token')).resolves.toEqual({
      token: 'old token',
    });
    expect(cache.set).toHaveBeenCalledWith('token', 'new token');
  });
});
