import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { AComment } from './AComment';
import { Answer } from './Answer';
import { User } from './User';


@Entity()

@Unique(['id'])
export class ALike extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  
  //   Many To One References
  @ManyToOne(type => User, user => user.aLikes)
  @JoinColumn({name: 'ref_userId'})
  user: User;
  @ManyToOne(type => Answer, answer => answer.aLikes)
  @JoinColumn({name: 'ref_answerId'})
  answer: Answer;
}