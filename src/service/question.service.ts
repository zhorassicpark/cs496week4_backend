import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Repository } from 'typeorm/index';
import { Question } from '../domain/Question';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private questionRepository: Repository<Question>,
  ) {
    this.questionRepository = questionRepository;
  }
  /**
   * Question 리스트 조회
   */
   async findAll(): Promise<Question[]> {
    return this.questionRepository.find({
      loadRelationIds: {
        relations: [
          'user',
        ],
        disableMixedMap: true
      },
    });
  }
  /**
   * 특정 질문 조회
   * @param id
   */
  async findOne(id: number): Promise<Question> {
    return this.questionRepository.findOne({ 
      loadRelationIds: {
        relations: [
          'user',
        ],
        disableMixedMap: true
      },
      where:{
      id: id
    } });
  }

  //  유저의 질문 목록을 조회
  async findWithUserCondition(userId:string){
    return await this.questionRepository.find(
      {
        loadRelationIds: {
          relations: [
            'user',
          ],
          disableMixedMap: true
        },
        where: {
          user:{id: userId}
        }
      }
    )
  }



  /**
   * 질문 저장
   * @param user
   */
  async saveQuestion(question : Question): Promise<void> {
    await this.questionRepository.save(question);
  }
  /**
   * 질문 삭제
   */
  async deleteQuestion(id: number): Promise<void> {
    await this.questionRepository.delete({ id: id });
  }


}

