import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Blog } from 'src/blog/entities/blog.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Role } from 'src/auth/enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userName: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER, // Default role can be set to USER or any other role as needed
  })
  role: Role;

  @Column({ nullable: true })
  hashedRefreshToken: string;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', nullable: true }) // Explicitly set type and nullable
  verificationToken: string | null;

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }
}
