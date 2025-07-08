import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Blog } from 'src/blog/entities/blog.entity';

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

  @Column({ nullable: true })
  createdAt: Date;

  @OneToMany(()=>Blog, (blog)=>blog.author)
  blogs: Blog[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }
}
