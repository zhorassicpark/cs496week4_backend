import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Connection, Repository } from 'typeorm/index';
import { Item } from '../domain/Item';
import { Joiner } from 'src/domain/Joiner';

@Injectable()
export class JoinerService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(Joiner) private joinerRepository: Repository<Joiner>,
    // private connection: Connection
  ) {
    // this.connection = connection;
    this.itemRepository = itemRepository;
    this.joinerRepository = joinerRepository;
  }
  /*** User 리스트 조회   */
   async findAll(): Promise<Joiner[]> {
    return this.joinerRepository.find();
  }
  /**
   * 특정 유저 조회
   * @param id
   */
  async findOne(id: number): Promise<Joiner> {
    return this.joinerRepository.findOne({ where:{
      id: id
    } });
  }

  //  상품공구에 참여한 구매자정보가 담긴 Joiner들을 가져옴
  async findWithItemCondition(itemId: number): Promise<Joiner[]> {
    return await this.joinerRepository.find(
      {
        loadRelationIds: {
          relations: [
            'user',
            'item'
          ],
          disableMixedMap: true
        },
        where: {
          item : {id: itemId}
        }
      }
    )
  }

  //  유저가 공구에 참여 중인 상품정보가 담긴 Joiner들을 불러옴
  async findWithUserCondition(userId: string): Promise<Joiner[]> {
    return await this.joinerRepository.find(
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
  
  async findWithUserItemCondition(userId: string, itemId: number): Promise<Joiner>{
    return await this.joinerRepository.findOne(
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
  async saveJoiner(joiner : Joiner): Promise<void> {
    console.log("WTF@!!!!!");
    console.log(joiner);
    await this.joinerRepository.save(joiner);
    console.log("jsadfjsad;klf;kalsdf;klsadj;fklsadj;lkfja[sdl");
    console.log(await this.joinerRepository.findOne({
      where:{
        id: joiner.id
      }
    }));
    console.log("WHYYYYYY");
  }
  /**
   * 유저 삭제
   */
  async deleteJoiner(id: number): Promise<void> {
    await this.joinerRepository.delete({ id: id });
  }

}

