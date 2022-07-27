import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Repository } from 'typeorm/index';
import { AComment } from 'src/domain/AComment';

@Injectable()
export class ACommentService {
  constructor(
    @InjectRepository(AComment) private aCommentRepository: Repository<AComment>,
    // private connection: Connection
  ) {
    // this.connection = connection;
    this.aCommentRepository = aCommentRepository;
  }
  /*** answer Comment 리스트 조회   */
   async findAll(): Promise<AComment[]> {
    return this.aCommentRepository.find({      
      loadRelationIds: {
        relations: [
          'user',
          'answer',
        ],
        disableMixedMap: true
      },
    });
  }
  /**
   * 특정 A Comment 조회
   * @param id
   */
  async findOne(id: number): Promise<AComment> {
    return this.aCommentRepository.findOne({ 
      loadRelationIds: {
        relations: [
          'user',
          'answer',
        ],
        disableMixedMap: true
      },
      where:{
      id: id
    } });
  }

  //  유저의 모든 answer comment을 조회
  async findWithUserCondition(userId: string): Promise<AComment[]> {
    return await this.aCommentRepository.find(
      {
        loadRelationIds: {
          relations: [
            'user',
            'answer',
          ],
          disableMixedMap: true
        },
        where: {
          user : {id: userId}
        }
      }
    )
  }

  //  답변에 달린 모든 answer comment을 조회
  async findWithAnswerCondition(answerId: number): Promise<AComment[]> {
    return await this.aCommentRepository.find(
      {
        loadRelationIds: {
          relations: [
            'user',
            'answer',
          ],
          disableMixedMap: true
        },
        where: {
          answer : {id: answerId}
        }
      }
    )
  }

  /**
   * answer comment 저장
   * @param aComment
   */
  async saveAComment(aComment : AComment): Promise<void> {
    await this.aCommentRepository.save(aComment);
  }
  /**
   * answer comment 삭제
   */
  async deleteAComment(id: number): Promise<void> {
    await this.aCommentRepository.delete({ id: id });
  }

}

