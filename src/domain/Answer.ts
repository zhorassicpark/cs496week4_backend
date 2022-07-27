import { group } from 'console';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { AComment } from './AComment';
import { Question } from './Question';
import { User } from './User';

@Entity()

@Unique(['id'])
export class Answer extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({nullable:true})
  title: string;
  @Column({ nullable:true })
  content: string;
  @Column({ nullable:true })
  createdDate: Date;
  
  //   Many To One References
  @ManyToOne(type => User, user => user.answers)
  @JoinColumn({name: 'ref_userId'})
  user: User;
  @ManyToOne(type => Question, question => question.answers)
  @JoinColumn({name: 'ref_questionId'})
  question: Question;

  //   One To Many References
  @OneToMany(type=>AComment, aComment => aComment.answer, {
    onDelete:'CASCADE',
    eager: true
  })
  aComments: AComment[];
}