import { Test, TestingModule } from '@nestjs/testing';
import { ChatSpacesService } from './chat-spaces.service';

describe('ChatSpacesService', () => {
  let service: ChatSpacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatSpacesService],
    }).compile();

    service = module.get<ChatSpacesService>(ChatSpacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
