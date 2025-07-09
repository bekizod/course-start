import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comment.controller';
import { CommentsService } from './comment.service';

describe('CommentController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [CommentsService],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
