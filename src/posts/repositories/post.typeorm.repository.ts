import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostRepository } from './post.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class PostTypeOrmRepository implements PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(post: CreatePostDto, authorId: number): Promise<Post> {
    const author = await this.userRepository.findOneBy({ id: authorId });
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const newPost = this.postRepository.create({
      ...post,
      author,
    });
    return this.postRepository.save(newPost);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({ 
      relations: ['author', 'comments', 'likes'] 
    });
  }

  async findById(id: number): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author', 'likes', 'likes.user'],
    });
  }

  async findByIdWithAuthor(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author']
    });
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postRepository.update(id, updatePostDto);
    const updatedPost = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'likes']
    });
    
    if (!updatedPost) {
      throw new NotFoundException('Post not found after update');
    }
    return updatedPost;
  }

  async delete(id: number): Promise<void> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Post not found');
    }
  }

  async findByAuthor(authorId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { author: { id: authorId } },
      relations: ['author', 'comments', 'likes'],
    });
  }
}