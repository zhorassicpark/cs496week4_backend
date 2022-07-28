import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/User';
import { Question } from './domain/Question';
import { Answer } from './domain/Answer';
import { AComment } from './domain/AComment';
import { QComment } from './domain/QComment';
import { QuestionController } from './controller/question.controller';
import { QuestionService } from './service/question.service';
import { AnswerService } from './service/answer.service';
import { QCommentService } from './service/qComment.service';
import { ACommentService } from './service/aComment.service';
import { FormatService } from './service/format.service';
import { AnswerController } from './controller/answer.controller';
import { QCommentController } from './controller/qComment.controller';
import { ACommentController } from './controller/aComment.controller';
import { QLike } from './domain/QLike';
import { ALike } from './domain/ALike';
import { QLikeService } from './service/qLike.service';
import { ALikeService } from './service/aLike.service';
import { QALikeController } from './controller/qaLike.controller';
// import { SpendController } from './controller/spend.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Question, Answer, QComment, AComment,QLike, ALike])],
  controllers: [UserController, QuestionController, AnswerController,QCommentController, ACommentController, QALikeController],
  providers: [UserService, QuestionService, AnswerService, QCommentService, ACommentService, FormatService, QLikeService, ALikeService],
})
export class ManageModule {}