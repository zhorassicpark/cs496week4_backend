import { Body, ConsoleLogger, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../domain/User';
import { QuestionService } from 'src/service/question.service';
import { AnswerService } from 'src/service/answer.service';
import { QCommentService } from 'src/service/qComment.service';
import { ACommentService } from 'src/service/aComment.service';
import { Question } from 'src/domain/Question';
import { QuestionDto } from 'src/dto/QuestionDto';
import { FormatService } from 'src/service/format.service';
import { Answer } from 'src/domain/Answer';
import { AnswerDto } from 'src/dto/AnswerDto';


@Controller('answer')
export class AnswerController {
  constructor(
    private userService: UserService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private qCommentService: QCommentService,
    private aCommentService: ACommentService,
    private formatService : FormatService,
  ) {
    this.userService = userService;
    this.questionService = questionService;
    this.answerService = answerService;
    this.qCommentService = qCommentService;
    this.aCommentService = aCommentService;
    this.formatService = formatService;
  } 

  @Get('list')                                                                      ////  모든 답변 목록 조회
  async findAll(): Promise<Answer[]> {
    console.log('get item list');
    const answerList = await this.answerService.findAll();
    console.log(answerList);
    const answerDtoList:AnswerDto[] = await this.formatService.answerListToAnswerDtoList(answerList);
    return Object.assign({
      data: answerDtoList,
      statusCode: 200,
      statusMsg: `질문 목록 조회가 성공적으로 완료되었습니다.`,
    });
  }

  // @Get('list/search')                                                                       //  검색어를 포함한 질문 목록 조회
  // async searchQuestionWithWord(@Query() query):Promise<Question[]>{
  //   const questionList = await this.questionService.findAll();
  //   const questionDtoList:QuestionDto[] = await this.formatService.questionListToQuestionDtoList(questionList);
  //   const filteredQuestinDtoList = await this.formatService.questionListFilterWithSearchWord(questionDtoList, query.searchWord);
  //   return Object.assign({
  //     data: filteredQuestinDtoList,
  //     statusCode: 200,
  //     statusMsg: `유저의 관심 목록이 성공적으로 조회되었습니다.`,
  //   });
  // }

  
  @Get('list/user/:userId')                                                                      //  유저의 답변목록 조회
  async findUsersAnswers(@Param('userId') userId: string):Promise<AnswerDto[]>{
    if(await this.userService.findOne(userId) == null){
      throw new HttpException('존재하지 않는 회원입니다!', HttpStatus.BAD_REQUEST);
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const usersAnswerList = await this.answerService.findWithUserCondition(userId);
    // if(!usersQuestionList){
    //   throw new HttpException('존재하지 않는 회원입니다!', HttpStatus.BAD_REQUEST);
    //   return Object.assign({
    //     data:{},
    //     statusCode: 400,
    //     statusMsg: '아직 유저의 질문이 등록되지 않았습니다.'
    //   })
    // }
    const usersAnswerDtoList : AnswerDto[]= await this.formatService.answerListToAnswerDtoList(usersAnswerList);
    const response =  Object.assign({
      data: usersAnswerDtoList,
      statusCode: 200,
      statusMsg: `유저의 답변 목록이 성공적으로 조회되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }

  
  @Get('list/question/:questionId')                                                                      //  질문에 대한 답변목록 조회
  async findQuestionsAnswers(@Param('questionId') questionId: number):Promise<AnswerDto[]>{
    if(await this.questionService.findOne(questionId) == null){
      throw new HttpException('존재하지 않는 질문입니다!', HttpStatus.BAD_REQUEST);
      return Object.assign({
        data:questionId,
        statusCode: 400,
        statusMsg: '해당 ID의 질문은 존재하지 않습니다.'
      })
    }
    const questionsAnswerList = await this.answerService.findWithQuestionCondition(questionId);
    const questionsAnswerDtoList : AnswerDto[]= await this.formatService.answerListToAnswerDtoList(questionsAnswerList);
    const sortedQuestionsAnswerDtoList:QuestionDto[] = questionsAnswerDtoList.sort((a, b)=> (a.numLike < b.numLike)?1:-1);
    const response =  Object.assign({
      data: sortedQuestionsAnswerDtoList,
      statusCode: 200,
      statusMsg: `질문에 대한 답변 목록이 성공적으로 조회되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }

  
  @Get(':answerId')                                                                      //  특정 답변에 대한 상세정보 조회
  async findAnswer(@Param('answerId') answerId: number):Promise<AnswerDto[]>{
    const answer = await this.answerService.findOne(answerId);
    const answerDto:AnswerDto = await this.formatService.answerToAnswerDto(answer);
    const response =  Object.assign({
      data: answerDto,
      statusCode: 200,
      statusMsg: `질문에 대한 상세 정보가 성공적으로 조회되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }

@Post()
async createAnswer(@Body() body ):Promise<Answer>{
  const answer = await this.formatService.answerGen(body.title, body.content, body.createdDate, body.userId, body.questionId);
  await this.answerService.saveAnswer(answer);
  const answerDto:AnswerDto = await this.formatService.answerToAnswerDto(answer);
  const response =  Object.assign({
    data: answerDto,
    statusCode: 201,
    statusMsg: `답변이 성공적으로 등록되었습니다.`,
  });
  console.log("RESPONSE : ");
  console.log(response);
  return response;
}

@Put(':answerId')
async editAnswer(@Param('answerId') answerId: number, @Body() body ):Promise<AnswerDto>{
  const editAnswer = await this.answerService.findOne(answerId);
  editAnswer.title = body.title;
  editAnswer.content = body.content;
  await this.answerService.saveAnswer(editAnswer);
  const editAnswerDto:AnswerDto = await this.formatService.answerToAnswerDto(editAnswer);
  const response =  Object.assign({
    data: editAnswerDto,
    statusCode: 201,
    statusMsg: `답변이 성공적으로 수정되었습니다.`,
  });
  console.log("RESPONSE : ");
  console.log(response);
  return response;
}
  
@Delete(':answerId')                                                                      //  특정 답변에 대한 상세정보 조회
async deleteAnswer(@Param('answerId') answerId: number):Promise<AnswerDto[]>{
  const delAnswer = await this.answerService.findOne(answerId);
  const delAnswerDto:AnswerDto = await this.formatService.answerToAnswerDto(delAnswer);
  await this.answerService.deleteAnswer(answerId);
  const response =  Object.assign({
    data: delAnswerDto,
    statusCode: 200,
    statusMsg: `답변이 성공적으로 삭제되었습니다.`,
  });
  console.log("RESPONSE : ");
  console.log(response);
  return response;
}

}