import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { PostTypeOrmRepository } from './repositories/post.typeorm.repository';
import { CommentTypeOrmRepository } from './repositories/comment.typeorm.repository';
import { LikeTypeOrmRepository } from './repositories/like.typeorm.repository';

//import { POST_REPOSITORY, PostRepository } from '../../repositories/post.repository';
// import { COMMENT_REPOSITORY } from './repositories/comment.repository';
// import { LIKE_REPOSITORY } from './repositories/like.repository';

// Command handlers
import { CreatePostHandler } from './commands/handlers/create-post.handler';
import { UpdatePostHandler } from './commands/handlers/update-post.handler';
import { DeletePostHandler } from './commands/handlers/delete-post.handler';
import { CreateCommentHandler } from './commands/handlers/create-comment.handler';
import { LikePostHandler } from './commands/handlers/like-post.handler';
import { UnlikePostHandler } from './commands/handlers/unlike-post.handler';

// Query handlers
import { GetPostHandler } from './queries/handlers/get-post.handler';
import { GetAllPostsHandler } from './queries/handlers/get-all-posts.handler';
import { GetPostCommentsHandler } from './queries/handlers/get-post-comments.handler';
import { CheckPostLikeHandler } from './queries/handlers/check-post-like.handler';
import { User } from 'src/entities/user.entity';
import { PostsController } from './controllers/posts.controller';
import { CommentsController } from './controllers/comments.controller';
import { LikesController } from './controllers/likes.controller';
import { DeleteCommentHandler } from './commands/handlers/delete-comment.handler';
import { POST_REPOSITORY } from './repositories/post.repository';
import { COMMENT_REPOSITORY } from './repositories/comment.repository';
import { LIKE_REPOSITORY } from './repositories/like.repository';
import { GetMyPostsHandler } from './queries/handlers/get-my-posts.handler';

const commandHandlers = [
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
  CreateCommentHandler,
  DeleteCommentHandler,
  LikePostHandler,
  UnlikePostHandler,
];

const queryHandlers = [
  GetPostHandler,
  GetAllPostsHandler,
  GetPostCommentsHandler,
  CheckPostLikeHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment, Like, User]), CqrsModule],
  controllers: [PostsController, CommentsController, LikesController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    CheckPostLikeHandler,
    GetMyPostsHandler,
    {
      provide: POST_REPOSITORY,
      useClass: PostTypeOrmRepository,
    },
    {
      provide: COMMENT_REPOSITORY,
      useClass: CommentTypeOrmRepository,
    },
    {
      provide: LIKE_REPOSITORY,
      useClass: LikeTypeOrmRepository,
    },
  ],
})
export class PostsModule {}
