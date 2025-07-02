/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CheckPostLikeQuery } from '../queries/check-post-like.query';
import { LikeResponseDto } from '../dto/like-response.dto';
import { LikePostCommand } from '../commands/like-post.command';
import { UnlikePostCommand } from '../commands/unlike-post.command';
import { LikeStatusResponseDto } from '../dto/like-status-response.dto';


@ApiTags('Likes')
@Controller('posts/:postId/likes')
export class LikesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: 'Check if user liked a post' })
@ApiResponse({ 
  status: 200, 
  description: 'Like check result',
  type: LikeStatusResponseDto 
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Get('check') 
async checkLike(
  @Param('postId') postId: string,
  @Req() req
): Promise<LikeStatusResponseDto> {
  const result = await this.queryBus.execute(
    new CheckPostLikeQuery(parseInt(postId), req.user.id)
  );

  return {
    status: 'success',
    message: 'Like status retrieved',
    data: {
      isLiked: result.isLiked,
      postId: parseInt(postId)
    }
  };
}

  @ApiOperation({ summary: 'Toggle like on a post' })
@ApiResponse({ 
  status: 200, 
  description: 'Post like toggled successfully',
  type: LikeResponseDto 
})




@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Post()
async likePost(
  @Param('postId') postId: string,
  @Req() req,
): Promise<LikeResponseDto> {
  return this.commandBus.execute(
    new LikePostCommand(parseInt(postId), req.user.id)
  );
}

  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({ status: 204, description: 'The post has been unliked' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  async unlikePost(
    @Param('postId') postId: string,
    @Req() req,
  ): Promise<void> {
    await this.commandBus.execute(
      new UnlikePostCommand(parseInt(postId), req.user.id),
    );
  }
}