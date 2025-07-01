import { Property } from 'src/entities/property.entity'; // Fix typo: "propery" → "property"
import { PropertyFeature } from 'src/entities/propertyFeature.entity';
import { User } from 'src/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  url: 'postgresql://neondb_owner:npg_BbKY4uUHFt6G@ep-raspy-firefly-a8qa4k9o-pooler.eastus2.azure.neon.tech/test?sslmode=require',
  entities: [Property, PropertyFeature, User],
  port: 3306,
  synchronize: true, // ⚠️ Only for dev (drops tables in production!)
};