import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Repository } from 'typeorm/index';
import { QLike } from '../domain/QLike';
import { ALike } from '../domain/ALike';

@Injectable()
export class ALikeService {
  constructor(
    @InjectRepository(ALike) private aLikeRepository: Repository<ALike>,
    // private connection: Connection
  ) {
    // this.connection = connection;
    this.aLikeRepository = aLikeRepository;
  }
  /**
   * 특정 A Comment 조회
   * @param id
   */
  async findWithUserAnswerCondition(userId: string, answerId: number):Promise<ALike> {
    return await this.aLikeRepository.findOne(
       {
         loadRelationIds: {
           relations: [
             'user',
             'answer',
           ],
           disableMixedMap: true
         },
         where: {
           user : {id: userId},
           answer: {id: answerId},
         }
       }
     );
   }
  /**
   * 유저 저장
   * @param user
   */
  async saveALike(aLike : ALike): Promise<void> {
    await this.aLikeRepository.save(aLike);
  }
  /**
   * 유저 삭제
   */
  async deleteALike(id: number): Promise<void> {
    await this.aLikeRepository.delete({ id: id });
  }

}

