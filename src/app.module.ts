import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { IdeaModule } from './idea/idea.module';
import { Module } from '@nestjs/common';

import { TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { Idea } from './idea/idea.entity';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http_error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { User } from './user/user.entity';
import { Comment } from './comment/comment.entity';

@Module({
  imports: [
        CommentModule,
        GraphQLModule.forRoot({
          typePaths: ['./**/*.graphql'],
          context: ({ req }) => ({ headers: req.headers }),
        }),
        UserModule, 
        IdeaModule, TypeOrmModule.forRoot(
    {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      entities: [Idea, User, Comment],
      synchronize: true
    }
  )],
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }],
})
export class AppModule {}
