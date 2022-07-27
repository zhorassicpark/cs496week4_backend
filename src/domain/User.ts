import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { AComment } from './AComment';
import { Answer } from './Answer';
import { QComment } from './QComment';
import { Question } from './Question';
@Entity()

@Unique(['id'])
export class User extends BaseEntity{
  //  Basic Account Info
  @PrimaryColumn()
  id: string;
  @Column({nullable:true})
  password: string;
  @Column({nullable:true})
  username: string;
  @Column({ nullable:true })
  isActive: boolean;
  @Column({nullable:true})
  iskakao: boolean;

  //  One To Many References
  @OneToMany(type=>Question, question => question.user, {
    onDelete:'CASCADE',
    eager: true
  })
  questions: Question[];
  @OneToMany(type=>Answer, answer => answer.user, {
    onDelete:'CASCADE',
    eager: true
  })
  answers: Answer[];
  @OneToMany(type=>QComment, qComment => qComment.user, {
    onDelete:'CASCADE',
    eager: true
  })
  qComments: QComment[];
  @OneToMany(type=>AComment, aComment => aComment.user, {
    onDelete:'CASCADE',
    eager: true
  })
  aComments: AComment[];
}