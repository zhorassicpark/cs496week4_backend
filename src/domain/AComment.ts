import { group } from 'console';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { Answer } from './Answer';
import { User } from './User';

@Entity()

@Unique(['id'])
export class AComment extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable:true })
  content: string;
  @Column({ nullable:true })
  createdDate: Date;
  
  //   Many To One References
  @ManyToOne(type => Answer, answer => answer.aComments)
  @JoinColumn({name: 'ref_userId'})
  answer : Answer;
  @ManyToOne(type => User, user => user.aComments)
  @JoinColumn({name: 'ref_answerId'})
  user: User;

}