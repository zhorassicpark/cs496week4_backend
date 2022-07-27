import { group } from 'console';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { Question } from './Question';
import { User } from './User';

@Entity()

@Unique(['id'])
export class QComment extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable:true })
  content: string;
  @Column({ nullable:true })
  createdDate: Date;
  
  //   Many To One References
  @ManyToOne(type => Question, question => question.qComments)
  @JoinColumn({name: 'ref_userId'})
  question: Question;
  @ManyToOne(type => User, user => user.qComments)
  @JoinColumn({name: 'ref_questionId'})
  user: User;

}