import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Connection, Repository } from 'typeorm/index';
import { Item } from '../domain/Item';
import { Joiner } from 'src/domain/Joiner';
import { Liker } from 'src/domain/Liker';

@Injectable()
export class LikerService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(Joiner) private joinerRepository: Repository<Joiner>,
    @InjectRepository(Liker) private likerRepository: Repository<Liker>,
    // private connection: Connection
  ) {
    // this.connection = connection;
    this.itemRepository = itemRepository;
    this.joinerRepository = joinerRepository;
    this.likerRepository = likerRepository;
  }
  /**
   * User 리스트 조회
   */
   async findAll(): Promise<Liker[]> {
    return this.likerRepository.find();
  }
  /**
   * 특정 유저 조회
   * @param id
   */
  async findOne(id: number): Promise<Liker> {
    return this.likerRepository.findOne({ where:{
      id: id
    } });
  }

  //  유저가 속한 그룹들을 가져옴
  async findWithUserCondition(userId: string): Promise<Liker[]> {
    return await this.likerRepository.find(
      {
        loadRelationIds: {
          relations: [
            'user',
            'item'
          ],
          disableMixedMap: true
        },
        where: {
          user : {id: userId}
        }
      }
    )
  }
  
  async findWithUserItemCondition(userId: string, itemId: number): Promise<Liker>{
    return await this.likerRepository.findOne(
      {
        loadRelationIds: {
          relations: [
            'user',
            'item'
          ],
          disableMixedMap: true
        },
        where: {
          user : {id: userId},
          item: {id: itemId}
        }
      }
    )
  }

  /**
   * 유저 저장
   * @param user
   */
  async saveLiker(Liker : Liker): Promise<void> {
    await this.likerRepository.save(Liker);
  }
  /**
   * 유저 삭제
   */
  async deleteLiker(id: number): Promise<void> {
    await this.likerRepository.delete({ id: id });
  }

}

