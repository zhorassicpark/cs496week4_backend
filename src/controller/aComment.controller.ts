import { Body, ConsoleLogger, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../domain/User';
import { QuestionService } from 'src/service/question.service';
import { QCommentService } from 'src/service/qComment.service';
import { AnswerService } from 'src/service/answer.service';
import { ACommentService } from 'src/service/aComment.service';
import { Question } from 'src/domain/Question';
import { QuestionDto } from 'src/dto/QuestionDto';
import { FormatService } from 'src/service/format.service';
import { Answer } from 'src/domain/Answer';
import { AnswerDto } from 'src/dto/AnswerDto';
import { AComment } from 'src/domain/AComment';
import { ACommentDto } from 'src/dto/ACommentDto';


@Controller('acomment')
export class ACommentController {
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
    this.aCommentService = aCommentService;
    this.aCommentService = aCommentService;
    this.formatService = formatService;
  } 

  @Get('list')                                                                      ////  모든 답변댓글 목록 조회
  async findAll(): Promise<AComment[]> {
    console.log('get item list');
    const aCommentList = await this.aCommentService.findAll();
    console.log(aCommentList);
    const aCommentDtoList:ACommentDto[] = await this.formatService.aCommentListToACommentDtoList(aCommentList);
    return Object.assign({
      data: aCommentDtoList,
      statusCode: 200,
      statusMsg: `답변댓글 목록 조회가 성공적으로 완료되었습니다.`,
    });
  }

  // @Get('list/search')                                                                       //  검색어를 포함한 답변 목록 조회
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

  
  @Get('list/user/:userId')                                                                      //  유저의 답변댓글목록 조회
  async findUsersAComments(@Param('userId') userId: string):Promise<ACommentDto[]>{
    if(await this.userService.findOne(userId) == null){
      throw new HttpException('존재하지 않는 회원입니다!', HttpStatus.BAD_REQUEST);
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const usersACommentList = await this.aCommentService.findWithUserCondition(userId);
    // if(!usersQuestionList){
    //   throw new HttpException('존재하지 않는 회원입니다!', HttpStatus.BAD_REQUEST);
    //   return Object.assign({
    //     data:{},
    //     statusCode: 400,
    //     statusMsg: '아직 유저의 답변이 등록되지 않았습니다.'
    //   })
    // }
    const usersACommentDtoList : ACommentDto[]= await this.formatService.aCommentListToACommentDtoList(usersACommentList);
    const response =  Object.assign({
      data: usersACommentDtoList,
      statusCode: 200,
      statusMsg: `유저의 답변댓글 목록이 성공적으로 조회되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }

  
  @Get('list/answer/:answerId')                                                                      //  답변에 대한 답변댓글목록 조회
  async findAnswersAComments(@Param('answerId') answerId: number):Promise<ACommentDto[]>{
    if(await this.answerService.findOne(answerId) == null){
      throw new HttpException('존재하지 않는 답변입니다!', HttpStatus.BAD_REQUEST);
      return Object.assign({
        data:answerId,
        statusCode: 400,
        statusMsg: '해당 ID의 답변은 존재하지 않습니다.'
      })
    }
    const answersACommentList = await this.aCommentService.findWithAnswerCondition(answerId);
    const answersACommentDtoList : ACommentDto[]= await this.formatService.aCommentListToACommentDtoList(answersACommentList);
    const response =  Object.assign({
      data: answersACommentDtoList,
      statusCode: 200,
      statusMsg: `답변에 대한 답변댓글 목록이 성공적으로 조회되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }

  
  @Get(':aCommentId')                                                                      //  특정 답변댓글에 대한 상세정보 조회
  async findAComment(@Param('aCommentId') aCommentId: number):Promise<ACommentDto[]>{
    const aComment = await this.aCommentService.findOne(aCommentId);
    const aCommentDto:ACommentDto = await this.formatService.aCommentToACommentDto(aComment);
    const response =  Object.assign({
      data: aCommentDto,
      statusCode: 200,
      statusMsg: `답변에 대한 상세 정보가 성공적으로 조회되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }

@Post()
async createAComment(@Body() body ):Promise<AComment>{
  const aComment = await this.formatService.aCommentGen(body.content, body.createdDate, body.userId, body.answerId);
  await this.aCommentService.saveAComment(aComment);
  const aCommentDto:ACommentDto = await this.formatService.aCommentToACommentDto(aComment);
  const response =  Object.assign({
    data: aCommentDto,
    statusCode: 201,
    statusMsg: `답변댓글이 성공적으로 등록되었습니다.`,
  });
  console.log("RESPONSE : ");
  console.log(response);
  return response;
}

@Put(':aCommentId')
async editAComment(@Param('aCommentId') aCommentId: number, @Body() body ):Promise<ACommentDto>{
  const editAComment = await this.aCommentService.findOne(aCommentId);
  editAComment.content = body.content;
  await this.aCommentService.saveAComment(editAComment);
  const editACommentDto:ACommentDto = await this.formatService.aCommentToACommentDto(editAComment);
  const response =  Object.assign({
    data: editACommentDto,
    statusCode: 201,
    statusMsg: `답변댓글이 성공적으로 수정되었습니다.`,
  });
  console.log("RESPONSE : ");
  console.log(response);
  return response;
}
  
@Delete(':aCommentId')                                                                      //  특정 답변댓글에 대한 상세정보 조회
async deleteAComment(@Param('aCommentId') aCommentId: number):Promise<ACommentDto[]>{
  const delAComment = await this.aCommentService.findOne(aCommentId);
  const delACommentDto:ACommentDto = await this.formatService.aCommentToACommentDto(delAComment);
  await this.aCommentService.deleteAComment(aCommentId);
  const response =  Object.assign({
    data: delACommentDto,
    statusCode: 200,
    statusMsg: `답변댓글이 성공적으로 삭제되었습니다.`,
  });
  console.log("RESPONSE : ");
  console.log(response);
  return response;
}

}