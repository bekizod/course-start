import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
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
      relations: ['author', 'comments', 'likes'],
    });
  }

  async findById(id: number): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { id },
      relations: [
        'author',
        'comments',
        'comments.author',
        'likes',
        'likes.user',
      ],
    });
  }

  async findByIdWithAuthor(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
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
      relations: ['author', 'comments', 'likes'],
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

  async findWithPagination(
    skip: number,
    limit: number,
    search?: string,
  ): Promise<Post[]> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoinAndSelect('post.comments', 'comments')
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      queryBuilder.where(
        'post.title ILIKE :search OR post.content ILIKE :search',
        { search: `%${search}%` },
      );
    }

    return queryBuilder.getMany();
  }

  async countAll(): Promise<number> {
    return this.postRepository.count();
  }

  async findByAuthorWithPagination(
    authorId: number,
    skip: number,
    limit: number,
    search: string = '',
  ): Promise<Post[]> {
    console.log('Executing findByAuthorWithPagination with:', {
      authorId,
      skip,
      limit,
      search,
    });

    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.likes', 'likes')
      .where('post.author.id = :authorId', { authorId });

    if (search) {
      query.andWhere('(post.title LIKE :search OR post.content LIKE :search)', {
        search: `%${search}%`,
      });
    }

    // Log the generated SQL query
    console.log('SQL Query:', query.getQueryAndParameters());

    return query
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();
  }

  async countByAuthor(authorId: number, search: string = ''): Promise<number> {
    const query = this.postRepository
      .createQueryBuilder('post')
      .where('post.author.id = :authorId', { authorId });

    if (search) {
      query.andWhere('(post.title LIKE :search OR post.content LIKE :search)', {
        search: `%${search}%`,
      });
    }

    return query.getCount();
  }
}
