import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Repository } from 'typeorm/index';
import { Answer } from 'src/domain/Answer';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer) private answerRepository: Repository<Answer>,
    // private connection: Connection
  ) {
    // this.connection = connection;
    this.answerRepository = answerRepository;
  }
  /*** User 리스트 조회   */
   async findAll(): Promise<Answer[]> {
    return this.answerRepository.find({      
      loadRelationIds: {
        relations: [
          'user',
          'question',
        ],
        disableMixedMap: true
      },
    });
  }
  /**
   * 특정 유저 조회
   * @param id
   */
  async findOne(id: number): Promise<Answer> {
    return this.answerRepository.findOne({ 
      loadRelationIds: {
        relations: [
          'user',
          'question',
        ],
        disableMixedMap: true
      },
      where:{
      id: id
    } });
  }

  //  유저의 모든 답변을 조회
  async findWithUserCondition(userId: string): Promise<Answer[]> {
    return await this.answerRepository.find(
      {
        loadRelationIds: {
          relations: [
            'user',
            'question',
          ],
          disableMixedMap: true
        },
        where: {
          user : {id: userId}
        }
      }
    )
  }

  //  질문에 달린 모든 답변을 조회
  async findWithQuestionCondition(questionId: number): Promise<Answer[]> {
    return await this.answerRepository.find(
      {
        loadRelationIds: {
          relations: [
            'user',
            'question',
          ],
          disableMixedMap: true
        },
        where: {
          question : {id: questionId}
        }
      }
    )
  }

  /**
   * 유저 저장
   * @param user
   */
  async saveAnswer(answer : Answer): Promise<void> {
    await this.answerRepository.save(answer);
  }
  /**
   * 유저 삭제
   */
  async deleteAnswer(id: number): Promise<void> {
    await this.answerRepository.delete({ id: id });
  }

}

