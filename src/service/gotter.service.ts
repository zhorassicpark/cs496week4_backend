import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Connection, Repository } from 'typeorm/index';
import { Item } from '../domain/Item';
import { Joiner } from 'src/domain/Joiner';
import { Gotter } from 'src/domain/Gotter';

@Injectable()
export class GotterService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(Gotter) private gotterRepository: Repository<Gotter>,
    // private connection: Connection
  ) {
    // this.connection = connection;
    this.itemRepository = itemRepository;
    this.gotterRepository = gotterRepository;
  }
  /*** User 리스트 조회   */
   async findAll(): Promise<Gotter[]> {
    return this.gotterRepository.find();
  }
  /**
   * 특정 유저 조회
   * @param id
   */
  async findOne(id: number): Promise<Gotter> {
    return this.gotterRepository.findOne({ where:{
      id: id
    } });
  }

  //  유저가 속한 그룹들을 가져옴
  async findWithUserCondition(userId: string): Promise<Gotter[]> {
    return await this.gotterRepository.find(
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

  //  과거에 아이템을 구매한 사람들의 정보가 담긴 Gotter들을 불러옴
  async findWithItemCondition(itemId: number): Promise<Gotter[]> {
    return await this.gotterRepository.find(
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
  
  async findWithUserItemCondition(userId: string, itemId: number): Promise<Gotter>{
    return await this.gotterRepository.findOne(
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
  async saveGotter(gotter : Gotter): Promise<void> {
    console.log("WTF@!!!!!");
    console.log(gotter);
    const prevGotter = await this.gotterRepository.findOne({
      where:{
        user:{id: gotter.user.id},
        item:{id: gotter.item.id}
      }
    });
    if(prevGotter){
      await this.gotterRepository.delete({id: prevGotter.id});
    }
    await this.gotterRepository.save(gotter);
    console.log("jsadfjsad;klf;kalsdf;klsadj;fklsadj;lkfja[sdl");
    console.log(await this.gotterRepository.findOne({
      where:{
        id: gotter.id
      }
    }));
    console.log("WHYYYYYY");
  }
  /**
   * 유저 삭제
   */
  async deleteGotter(id: number): Promise<void> {
    await this.gotterRepository.delete({ id: id });
  }

}

