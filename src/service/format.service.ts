import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AComment } from "src/domain/AComment";
import { Answer } from "src/domain/Answer";
import { QComment } from "src/domain/QComment";
import { Question } from "src/domain/Question";
import { User } from "src/domain/User";
import { ACommentDto } from "src/dto/ACommentDto";
import { AnswerDto } from "src/dto/AnswerDto";
import { QCommentDto } from "src/dto/QCommentDto";
import { QuestionDto } from "src/dto/QuestionDto";
import { UserDto } from "src/dto/UserDto";
import { Repository } from "typeorm";

@Injectable()
export class FormatService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Question) private questionRepository: Repository<Question>,
    @InjectRepository(Answer) private answerRepository: Repository<Answer>,
    @InjectRepository(QComment) private qCommentRepository: Repository<QComment>,
    @InjectRepository(AComment) private aCommentRepository: Repository<AComment>,
  ) {
    this.userRepository = userRepository;
    this.questionRepository = questionRepository;
    this.answerRepository = answerRepository;
    this.qCommentRepository = qCommentRepository;
    this.aCommentRepository = aCommentRepository;
  }

  fillZero(width, str){
    return str.length >= width ? str:new Array(width-str.length+1).join('0')+str;//남는 길이만큼 0으로 채움
  }
  
  async userGen(id:string, pw:string, name: string, iskakao:boolean):Promise<User>{
    const user = new User();
    user.id = id;
    user.username = name;
    user.password = pw;
    if(iskakao){
      user.iskakao = true;
      user.isActive = true;
    }else{
      user.iskakao = false;
      user.isActive = false;
    }
    return user;
  }
  
  async questionGen(title: string, content: string, createdDate:string, userId: string):Promise<Question>{
    const question = new Question();
    question.title = title;
    question.content = content;
    question.createdDate = new Date(createdDate);
    question.user = await this.userRepository.findOne({ 
      where:{
      id: userId
    } });
    question.numLike = 0;
    return question;
  }
  
  async answerGen(title: string, content: string, createdDate:string, userId: string, questionId: number):Promise<Answer>{
    const answer = new Answer();
    answer.title = title;
    answer.content = content;
    answer.createdDate = new Date(createdDate);
    answer.user = await this.userRepository.findOne({ 
      where:{
      id: userId
    } });
    answer.question = await this.questionRepository.findOne({ 
      where:{
      id: questionId
    } });
    answer.numLike = 0;
    return answer;
  }
  
  async qCommentGen(content: string, createdDate:string, userId: string, questionId: number):Promise<QComment>{
    const qComment = new QComment();
    qComment.content = content;
    qComment.createdDate = new Date(createdDate);
    qComment.user = await this.userRepository.findOne({ 
      where:{
      id: userId
    } });
    qComment.question = await this.questionRepository.findOne({ 
      where:{
      id: questionId
    } });
    return qComment;
  }
  
  async aCommentGen(content: string, createdDate:string, userId: string, answerId: number):Promise<AComment>{
    const aComment = new AComment();
    aComment.content = content;
    aComment.createdDate = new Date(createdDate);
    aComment.user = await this.userRepository.findOne({ 
      where:{
      id: userId
    } });
    aComment.answer = await this.answerRepository.findOne({ 
      where:{
      id: answerId
    } });
    return aComment;
  }
  
  dateToString(date: Date):string{
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${this.fillZero(2, date.getHours().toString())}:${this.fillZero(2, date.getMinutes().toString())}:${this.fillZero(2, date.getSeconds().toString())}`;
  }
  
  async questionListFilterWithSearchWord(questionDtoList:QuestionDto[], searchWord:string):Promise<QuestionDto[]>{
    console.log("searchWord");
    console.log(searchWord);
    const resultQuestionDtoList = questionDtoList.filter((el)=>{
      return ((el.title).includes(searchWord));
    });
    return resultQuestionDtoList;
  }
  
  async userToUserDto(user: User):Promise<UserDto>{
    const userDto:UserDto = {
      userEmail: user.id,
      userName: user.username,
      isActive : user.isActive,
    }
    return userDto;
  }
  
  async userListToUserDtoList(userList:User[]):Promise<UserDto[]>{
    const userDtoList :UserDto[] = userList.map((el)=>{
      return {
        userEmail: el.id,
        userName: el.username,
        isActive : el.isActive,
      }
    });
    return userDtoList;
  }
  
  async questionToQuestionDto(question: Question):Promise<QuestionDto>{
    const questionDto : QuestionDto = {
      id: question.id,
      title: question.title,
      content: question.content,
      createdDate: this.dateToString(question.createdDate),
      numLike:question.numLike,
      userEmail:question.user.id,
      userName:(await this.userRepository.findOne({ 
        where:{
        id: question.user.id
      } })).username,
    }
    return questionDto;
  }
  
  async questionListToQuestionDtoList(questionList: Question[]):Promise<QuestionDto[]>{
    const questionDtoList:QuestionDto[] = [];
    for(let el of questionList){
      questionDtoList.push({
        id: el.id,
        title: el.title,
        content: el.content,
        createdDate: this.dateToString(el.createdDate),
        numLike:el.numLike,
        userEmail:el.user.id,
        userName:(await this.userRepository.findOne({ 
          where:{
          id: el.user.id
        } })).username,
      });
    }
    console.log(questionDtoList);
    return questionDtoList;
  }
  
  async answerToAnswerDto(answer: Answer):Promise<AnswerDto>{
    const answerDto : AnswerDto = {
      id: answer.id,
      title: answer.title,
      content: answer.content,
      createdDate: this.dateToString(answer.createdDate),
      numLike:answer.numLike,
      questionId:answer.question.id,
      questionTitle:(await this.questionRepository.findOne({ 
        where:{
        id: answer.question.id
      } })).title,
      userEmail:answer.user.id,
      userName:(await this.userRepository.findOne({ 
        where:{
        id: answer.user.id
      } })).username,
    }
    return answerDto;
  }
  
  async answerListToAnswerDtoList(answerList: Answer[]):Promise<AnswerDto[]>{
    const answerDtoList:AnswerDto[] = [];
    for(let el of answerList){
      answerDtoList.push({
        id: el.id,
        title: el.title,
        content: el.content,
        createdDate: this.dateToString(el.createdDate),
        numLike:el.numLike,
        questionId:el.question.id,
        questionTitle:(await this.questionRepository.findOne({ 
          where:{
          id: el.question.id
        } })).title,
        userEmail:el.user.id,
        userName:(await this.userRepository.findOne({ 
          where:{
          id: el.user.id
        } })).username,
      });
    }
    // const answerDtoList:AnswerDto[] = answerList.map((el)=>{
    //   return {
    //     id: el.id,
    //     title: el.title,
    //     content: el.content,
    //     createdDate: this.dateToString(el.createdDate),
    //     questionId:el.question.id,
    //     userEmail:el.user.id,
    //   }
    // });
    return answerDtoList;
  }
  
  async qCommentToQCommentDto(qComment: QComment):Promise<QCommentDto>{
    const qCommentDto : QCommentDto = {
      id: qComment.id,
      content: qComment.content,
      createdDate: this.dateToString(qComment.createdDate),
      questionId:qComment.question.id,
      questionTitle:(await this.questionRepository.findOne({ 
        where:{
        id: qComment.question.id
      } })).title,
      userEmail:qComment.user.id,
      userName:(await this.userRepository.findOne({ 
        where:{
        id: qComment.user.id
      } })).username,
    }
    return qCommentDto;
  }
  
  async qCommentListToQCommentDtoList(qCommentList: QComment[]):Promise<QCommentDto[]>{
    const qCommentDtoList:QCommentDto[] = [];
    for(let el of qCommentList){
      qCommentDtoList.push({
        id: el.id,
        content: el.content,
        createdDate: this.dateToString(el.createdDate),
        questionId:el.question.id,
        questionTitle:(await this.questionRepository.findOne({ 
          where:{
          id: el.question.id
        } })).title,
        userEmail:el.user.id,
        userName:(await this.userRepository.findOne({ 
          where:{
          id: el.user.id
        } })).username,
      });
    }
    // const qCommentDtoList:QCommentDto[] = qCommentList.map((el)=>{
    //   return {
    //     id: el.id,
    //     content: el.content,
    //     createdDate: this.dateToString(el.createdDate),
    //     questionId:el.question.id,
    //     questionTitle:(await this.questionRepository.findOne({ 
    //       where:{
    //       id: el.question.id
    //     } })).title,
    //     userEmail:el.user.id,
    //     userName:(await this.userRepository.findOne({ 
    //       where:{
    //       id: el.user.id
    //     } })).username,
    //   }
    // });
    return qCommentDtoList;
  }
  
  async aCommentToACommentDto(aComment: AComment):Promise<ACommentDto>{
    const aCommentDto : ACommentDto = {
      id: aComment.id,
      content: aComment.content,
      createdDate: this.dateToString(aComment.createdDate),
      answerId:aComment.answer.id,
      answerTitle:(await this.answerRepository.findOne({ 
        where:{
        id: aComment.answer.id
      } })).title,
      userEmail:aComment.user.id,
      userName:(await this.userRepository.findOne({ 
        where:{
        id: aComment.user.id
      } })).username,
    }
    return aCommentDto;
  }
  
  async aCommentListToACommentDtoList(aCommentList: AComment[]):Promise<ACommentDto[]>{
    const aCommentDtoList:ACommentDto[] = [];
    for(let el of aCommentList){
      aCommentDtoList.push({
        id: el.id,
        content: el.content,
        createdDate: this.dateToString(el.createdDate),
        answerId:el.answer.id,
        answerTitle:(await this.answerRepository.findOne({ 
          where:{
          id: el.answer.id
        } })).title,
        userEmail:el.user.id,
        userName:(await this.userRepository.findOne({ 
          where:{
          id: el.user.id
        } })).username,
      });
    }
    // const aCommentDtoList:ACommentDto[] = aCommentList.map((el)=>{
    //   return {
    //     id: el.id,
    //     content: el.content,
    //     createdDate: this.dateToString(el.createdDate),
    //     answerId:el.answer.id,
    //     answerTitle:(await this.answerRepository.findOne({ 
    //       where:{
    //       id: el.answer.id
    //     } })).title,
    //     userEmail:el.user.id,
    //     userName:(await this.userRepository.findOne({ 
    //       where:{
    //       id: el.user.id
    //     } })).username,
    //   }
    // });
    return aCommentDtoList;
  }



}


