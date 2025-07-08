// import { Property } from 'src/entities/property.entity'; // Fix typo: "propery" → "property"
// import { PropertyFeature } from 'src/entities/propertyFeature.entity';
import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  url: 'postgresql://neondb_owner:npg_LfaD9GnMCW1J@ep-aged-bread-a81ffhnv-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require',
  entities: [User, Blog],
  port: 3306,
  synchronize: true, // ⚠️ Only for dev (drops tables in production!)
};
