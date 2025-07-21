// import { Property } from 'src/entities/property.entity'; // Fix typo: "propery" → "property"
// import { PropertyFeature } from 'src/entities/propertyFeature.entity';
import { Blog } from 'src/blog/entities/blog.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  url: 'postgresql://neondb_owner:npg_k2xZvyURp3JX@ep-fragrant-leaf-adt4zu2l-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  entities: [User, Blog, Comment],
  port: 3306,
  synchronize: true, // ⚠️ Only for dev (drops tables in production!)
};
