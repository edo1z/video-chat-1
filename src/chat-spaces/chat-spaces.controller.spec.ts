import { Test, TestingModule } from '@nestjs/testing';
import { ChatSpacesController } from './chat-spaces.controller';
import { ChatSpacesService } from './chat-spaces.service';

describe('ChatSpacesController', () => {
  let controller: ChatSpacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatSpacesController],
      providers: [ChatSpacesService],
    }).compile();

    controller = module.get<ChatSpacesController>(ChatSpacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
