import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Repository } from 'typeorm/index';
import { QComment } from 'src/domain/QComment';

@Injectable()
export class QCommentService {
  constructor(
    @InjectRepository(QComment) private qCommentRepository: Repository<QComment>,
    // private connection: Connection
  ) {
    // this.connection = connection;
    this.qCommentRepository = qCommentRepository;
  }
  /*** Question Comment 리스트 조회   */
   async findAll(): Promise<QComment[]> {
    return this.qCommentRepository.find({
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
   * 특정 Q Comment 조회
   * @param id
   */
  async findOne(id: number): Promise<QComment> {
    return this.qCommentRepository.findOne({ 
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

  //  유저의 모든 question comment을 조회
  async findWithUserCondition(userId: string): Promise<QComment[]> {
    return await this.qCommentRepository.find(
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

  //  질문에 달린 모든 question comment을 조회
  async findWithQuestionCondition(questionId: number): Promise<QComment[]> {
    return await this.qCommentRepository.find(
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
   * question comment 저장
   * @param qComment
   */
  async saveQComment(qComment : QComment): Promise<void> {
    await this.qCommentRepository.save(qComment);
  }
  /**
   * question comment 삭제
   */
  async deleteQComment(id: number): Promise<void> {
    await this.qCommentRepository.delete({ id: id });
  }

}

