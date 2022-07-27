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


@Controller('question')
export class QuestionController {
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

  @Get('list')                                                                      ////  모든 질문 목록 조회
  async findAll(): Promise<Question[]> {
    console.log('get item list');
    const questionList = await this.questionService.findAll();
    console.log(questionList);
    const questionDtoList:QuestionDto[] = await this.formatService.questionListToQuestionDtoList(questionList);
    return Object.assign({
      data: questionDtoList,
      statusCode: 200,
      statusMsg: `질문 목록 조회가 성공적으로 완료되었습니다.`,
    });
  }

  @Get('list/search')                                                                       //  검색어를 포함한 질문 목록 조회
  async searchQuestionWithWord(@Query() query):Promise<Question[]>{
    const questionList = await this.questionService.findAll();
    const questionDtoList:QuestionDto[] = await this.formatService.questionListToQuestionDtoList(questionList);
    const filteredQuestinDtoList = await this.formatService.questionListFilterWithSearchWord(questionDtoList, query.searchWord);
    return Object.assign({
      data: filteredQuestinDtoList,
      statusCode: 200,
      statusMsg: `유저의 관심 목록이 성공적으로 조회되었습니다.`,
    });
  }

  
  @Get('list/:userId')                                                                      //  유저의 질문목록 조회
  async findUsersQuestions(@Param('userId') userId: string):Promise<QuestionDto[]>{
    if(await this.userService.findOne(userId) == null){
      throw new HttpException('존재하지 않는 회원입니다!', HttpStatus.BAD_REQUEST);
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const usersQuestionList = await this.questionService.findWithUserCondition(userId);
    // if(!usersQuestionList){
    //   throw new HttpException('존재하지 않는 회원입니다!', HttpStatus.BAD_REQUEST);
    //   return Object.assign({
    //     data:{},
    //     statusCode: 400,
    //     statusMsg: '아직 유저의 질문이 등록되지 않았습니다.'
    //   })
    // }
    const usersQuestionDtoList : QuestionDto[]= await this.formatService.questionListToQuestionDtoList(usersQuestionList);
    const response =  Object.assign({
      data: usersQuestionDtoList,
      statusCode: 200,
      statusMsg: `유저의 질문 목록이 성공적으로 조회되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }

  
  @Get(':questionId')                                                                      //  특정 질문에 대한 상세정보 조회
  async findQuestion(@Param('questionId') questionId: number):Promise<QuestionDto[]>{
    const question = await this.questionService.findOne(questionId);
    const questionDto:QuestionDto = await this.formatService.questionToQuestionDto(question);
    const response =  Object.assign({
      data: questionDto,
      statusCode: 200,
      statusMsg: `질문에 대한 상세 정보가 성공적으로 조회되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }

@Post()
async createQuestion(@Body() body ):Promise<Question>{
  const question = await this.formatService.questionGen(body.title, body.content, body.createdDate, body.userId);
  await this.questionService.saveQuestion(question);
  const questionDto:QuestionDto = await this.formatService.questionToQuestionDto(question);
  const response =  Object.assign({
    data: questionDto,
    statusCode: 201,
    statusMsg: `질문이 성공적으로 등록되었습니다.`,
  });
  console.log("RESPONSE : ");
  console.log(response);
  return response;

}

@Put(':questionId')
async editQuestion(@Param('questionId') questionId: number, @Body() body ):Promise<QuestionDto>{
  const editQuestion = await this.questionService.findOne(questionId);
  editQuestion.title = body.title;
  editQuestion.content = body.content;
  await this.questionService.saveQuestion(editQuestion);
  const editQuestionDto:QuestionDto = await this.formatService.questionToQuestionDto(editQuestion);
  const response =  Object.assign({
    data: editQuestionDto,
    statusCode: 201,
    statusMsg: `질문이 성공적으로 수정되었습니다.`,
  });
  console.log("RESPONSE : ");
  console.log(response);
  return response;

}
  
@Delete(':questionId')                                                                      //  특정 질문에 대한 상세정보 조회
async deleteQuestion(@Param('questionId') questionId: number):Promise<QuestionDto[]>{
  const delQuestion = await this.questionService.findOne(questionId);
  const delQuestionDto:QuestionDto = await this.formatService.questionToQuestionDto(delQuestion);
  await this.questionService.deleteQuestion(questionId);
  const response =  Object.assign({
    data: delQuestionDto,
    statusCode: 200,
    statusMsg: `질문이 성공적으로 삭제되었습니다.`,
  });
  console.log("RESPONSE : ");
  console.log(response);
  return response;
}

}