import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AComment } from './domain/AComment';
import { Answer } from './domain/Answer';
import { QComment } from './domain/QComment';
import { Question } from './domain/Question';
import { User } from './domain/User';
import { ManageModule } from './manage.module';
import { LoggerMiddleware } from './utils/logger.middleware';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'mcw4',
    entities: [User, Question, Answer, QComment, AComment],
    synchronize: true,
  }),
     ManageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure( consumer: MiddlewareConsumer){
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
