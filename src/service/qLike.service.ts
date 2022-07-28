import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Repository } from 'typeorm/index';
import { QLike } from '../domain/QLike';
import { ALike } from '../domain/ALike';

@Injectable()
export class QLikeService {
  constructor(
    @InjectRepository(QLike) private qLikeRepository: Repository<QLike>,
    // private connection: Connection
  ) {
    // this.connection = connection;
    this.qLikeRepository = qLikeRepository;
  }
  /**
   * 특정 A Comment 조회
   * @param id
   */

  async findWithUserQuestionCondition(userId: string, questionId: number):Promise<QLike> {
   return await this.qLikeRepository.findOne(
      {
        loadRelationIds: {
          relations: [
            'user',
            'question',
          ],
          disableMixedMap: true
        },
        where: {
          user : {id: userId},
          question : {id: questionId}
        }
      }
    );
  }
  /**
   * 유저 저장
   * @param user
   */
  async saveQLike(qLike : QLike): Promise<void> {
    await this.qLikeRepository.save(qLike);
  }
  /**
   * 유저 삭제
   */
  async deleteQLike(id: number): Promise<void> {
    await this.qLikeRepository.delete({ id: id });
  }

}

