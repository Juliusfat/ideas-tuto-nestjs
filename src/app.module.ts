import { Module } from '@nestjs/common';

import { TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Idea } from './entity/idea.entity';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      entities: [Idea],
      synchronize: true,
      logging: true
    }
  )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
