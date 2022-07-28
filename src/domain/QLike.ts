import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { AComment } from './AComment';
import { Question } from './Question';
import { User } from './User';


@Entity()

@Unique(['id'])
export class QLike extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  
  //   Many To One References
  @ManyToOne(type => User, user => user.qLikes)
  @JoinColumn({name: 'ref_userId'})
  user: User;
  @ManyToOne(type => Question, question => question.qLikes)
  @JoinColumn({name: 'ref_questionId'})
  question: Question;
}