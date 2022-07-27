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
import { QComment } from 'src/domain/QComment';
import { QCommentDto } from 'src/dto/QCommentDto';


@Controller('qcomment')
export class QCommentController {
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

  @Get('list')                                                                      ////  모든 질문댓글 목록 조회
  async findAll(): Promise<QComment[]> {
    console.log('get item list');
    const qCommentList = await this.qCommentService.findAll();
    console.log(qCommentList);
    const qCommentDtoList:QCommentDto[] = await this.formatService.qCommentListToQCommentDtoList(qCommentList);
    return Object.assign({
      data: qCommentDtoList,
      statusCode: 200,
      statusMsg: `질문댓글 목록 조회가 성공적으로 완료되었습니다.`,
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

  
  @Get('list/user/:userId')                                                                      //  유저의 질문댓글목록 조회
  async findUsersQComments(@Param('userId') userId: string):Promise<QCommentDto[]>{
    if(await this.userService.findOne(userId) == null){
      throw new HttpException('존재하지 않는 회원입니다!', HttpStatus.BAD_REQUEST);
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const usersQCommentList = await this.qCommentService.findWithUserCondition(userId);
    // if(!usersQuestionList){
    //   throw new HttpException('존재하지 않는 회원입니다!', HttpStatus.BAD_REQUEST);
    //   return Object.assign({
    //     data:{},
    //     statusCode: 400,
    //     statusMsg: '아직 유저의 질문이 등록되지 않았습니다.'
    //   })
    // }
    const usersQCommentDtoList : QCommentDto[]= await this.formatService.qCommentListToQCommentDtoList(usersQCommentList);
    const response =  Object.assign({
      data: usersQCommentDtoList,
      statusCode: 200,
      statusMsg: `유저의 질문댓글 목록이 성공적으로 조회되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }

  
  @Get('list/question/:questionId')                                                                      //  질문에 대한 질문댓글목록 조회
  async findQuestionsQComments(@Param('questionId') questionId: number):Promise<QCommentDto[]>{
    if(await this.questionService.findOne(questionId) == null){
      throw new HttpException('존재하지 않는 질문입니다!', HttpStatus.BAD_REQUEST);
      return Object.assign({
        data:questionId,
        statusCode: 400,
        statusMsg: '해당 ID의 질문은 존재하지 않습니다.'
      })
    }
    const questionsQCommentList = await this.qCommentService.findWithQuestionCondition(questionId);
    const questionsQCommentDtoList : QCommentDto[]= await this.formatService.qCommentListToQCommentDtoList(questionsQCommentList);
    const response =  Object.assign({
      data: questionsQCommentDtoList,
      statusCode: 200,
      statusMsg: `질문에 대한 질문댓글 목록이 성공적으로 조회되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }

  
  @Get(':qCommentId')                                                                      //  특정 질문댓글에 대한 상세정보 조회
  async findQComment(@Param('qCommentId') qCommentId: number):Promise<QCommentDto[]>{
    const qComment = await this.qCommentService.findOne(qCommentId);
    const qCommentDto:QCommentDto = await this.formatService.qCommentToQCommentDto(qComment);
    const response =  Object.assign({
      data: qCommentDto,
      statusCode: 200,
      statusMsg: `질문에 대한 상세 정보가 성공적으로 조회되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }

@Post()
async createQComment(@Body() body ):Promise<QComment>{
  const qComment = await this.formatService.qCommentGen(body.content, body.createdDate, body.userId, body.questionId);
  await this.qCommentService.saveQComment(qComment);
  const qCommentDto:QCommentDto = await this.formatService.qCommentToQCommentDto(qComment);
  const response =  Object.assign({
    data: qCommentDto,
    statusCode: 201,
    statusMsg: `질문댓글이 성공적으로 등록되었습니다.`,
  });
  console.log("RESPONSE : ");
  console.log(response);
  return response;
}

@Put(':qCommentId')
async editQComment(@Param('qCommentId') qCommentId: number, @Body() body ):Promise<QCommentDto>{
  const editQComment = await this.qCommentService.findOne(qCommentId);
  editQComment.content = body.content;
  await this.qCommentService.saveQComment(editQComment);
  const editQCommentDto:QCommentDto = await this.formatService.qCommentToQCommentDto(editQComment);
  const response =  Object.assign({
    data: editQCommentDto,
    statusCode: 201,
    statusMsg: `질문댓글이 성공적으로 수정되었습니다.`,
  });
  console.log("RESPONSE : ");
  console.log(response);
  return response;
}
  
@Delete(':qCommentId')                                                                      //  특정 질문댓글에 대한 상세정보 조회
async deleteQComment(@Param('qCommentId') qCommentId: number):Promise<QCommentDto[]>{
  const delQComment = await this.qCommentService.findOne(qCommentId);
  const delQCommentDto:QCommentDto = await this.formatService.qCommentToQCommentDto(delQComment);
  await this.qCommentService.deleteQComment(qCommentId);
  const response =  Object.assign({
    data: delQCommentDto,
    statusCode: 200,
    statusMsg: `질문댓글이 성공적으로 삭제되었습니다.`,
  });
  console.log("RESPONSE : ");
  console.log(response);
  return response;
}

}