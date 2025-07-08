import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyModule } from './property/property.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from 'db.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BlogModule } from './blog/blog.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // expandVariables: true,
      // load: [dbConfig, dbConfigProduction],
    }),
    PropertyModule,
    TypeOrmModule.forRoot(pgConfig),
    UserModule,
    AuthModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
