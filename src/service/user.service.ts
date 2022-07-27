import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Repository } from 'typeorm/index';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.userRepository = userRepository;
  }
  /**
   * User 리스트 조회
   */
   async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  /**
   * 특정 유저 조회
   * @param id
   */
   async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where:{
      id: id
    } });
  }
  /**
   * 유저 저장
   * @param user
   */
  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
  /**
   * 유저 삭제
   */
  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete({ id: id });
  }



}

