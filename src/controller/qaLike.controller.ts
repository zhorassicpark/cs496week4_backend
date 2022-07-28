import { Body, ConsoleLogger, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../domain/User';
import { QuestionService } from '../service/question.service';
import { AnswerService } from '../service/answer.service';
import { QCommentService } from '../service/qComment.service';
import { ACommentService } from '../service/aComment.service';
import { Question } from '../domain/Question';
import { QuestionDto } from '../dto/QuestionDto';
import { FormatService } from '../service/format.service';
import { Answer } from '../domain/Answer';
import { AnswerDto } from '../dto/AnswerDto';
import { QLikeService } from '../service/qLike.service';
import { ALikeService } from 'src/service/aLike.service';
import { QLike } from 'src/domain/QLike';
import { ALike } from 'src/domain/ALike';


@Controller('like')
export class QALikeController {
  constructor(
    private userService: UserService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private qCommentService: QCommentService,
    private aCommentService: ACommentService,
    private formatService : FormatService,
    private qLikeService : QLikeService,
    private aLikeService : ALikeService,
  ) {
    this.userService = userService;
    this.questionService = questionService;
    this.answerService = answerService;
    this.qCommentService = qCommentService;
    this.aCommentService = aCommentService;
    this.formatService = formatService;
    this.qLikeService = qLikeService;
    this.aLikeService = aLikeService;
  } 

  @Get('question/:userId/:questionId')
  async getUsersQuestionLike(@Param('userId') userId:string, @Param('questionId') questionId: number ):Promise<void>{
    const qLike = await this.qLikeService.findWithUserQuestionCondition(userId, questionId);
    
      const response =  Object.assign({
        data: qLike,
        statusCode: 200,
        statusMsg: `질문에 대한 좋아요가 검색되었습니다.`,
      });
      console.log("RESPONSE : ");
      console.log(response);
      return response;
    
  }

  @Get('answer/:userId/:answerId')
  async getUsersAnswerLike(@Param('userId') userId:string, @Param('answerId') answerId: number ):Promise<void>{
    const aLike = await this.aLikeService.findWithUserAnswerCondition(userId, answerId);
    
      const response =  Object.assign({
        data: aLike,
        statusCode: 200,
        statusMsg: `답변에 대한 좋아요가 검색되었습니다.`,
      });
      console.log("RESPONSE : ");
      console.log(response);
      return response;
    
  }
  

@Put('question/:userId/:questionId')
async toggleUsersQuestionLike(@Param('userId') userId:string, @Param('questionId') questionId: number ):Promise<void>{
  const qLike = await this.qLikeService.findWithUserQuestionCondition(userId, questionId);
  if(qLike == null){
    const newQLike = new QLike();
    newQLike.user = await this.userService.findOne(userId);
    newQLike.question = await this.questionService.findOne(questionId);
    await this.qLikeService.saveQLike(newQLike);
    const updateQuestion = await this.questionService.findOne(questionId);
    updateQuestion.numLike += 1;
    await this.questionService.saveQuestion(updateQuestion);
    const response =  Object.assign({
      data: {},
      statusCode: 201,
      statusMsg: `질문에 대한 좋아요가 반영되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }else{
    const updateQuestion = await this.questionService.findOne(questionId);
    updateQuestion.numLike -= 1;
    await this.questionService.saveQuestion(updateQuestion);
    await this.qLikeService.deleteQLike(qLike.id);
    const response =  Object.assign({
      data: {},
      statusCode: 201,
      statusMsg: `질문에 대한 좋아요가 취소되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }
}

@Put('answer/:userId/:answerId')
async toggleUsersAnswerLike(@Param('userId') userId:string, @Param('answerId') answerId: number ):Promise<void>{
  const aLike = await this.aLikeService.findWithUserAnswerCondition(userId, answerId);
  if(aLike == null){
    const newALike = new ALike();
    newALike.user = await this.userService.findOne(userId);
    newALike.answer = await this.answerService.findOne(answerId);
    await this.aLikeService.saveALike(newALike);
    const updateAnswer = await this.answerService.findOne(answerId);
    updateAnswer.numLike += 1;
    await this.answerService.saveAnswer(updateAnswer);
    const response =  Object.assign({
      data: {},
      statusCode: 201,
      statusMsg: `답변에 대한 좋아요가 반영되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }else{
    await this.aLikeService.deleteALike(aLike.id);
    const updateAnswer = await this.answerService.findOne(answerId);
    updateAnswer.numLike -= 1;
    await this.answerService.saveAnswer(updateAnswer);
    const response =  Object.assign({
      data: {},
      statusCode: 201,
      statusMsg: `답변에 대한 좋아요가 취소되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }
}
}