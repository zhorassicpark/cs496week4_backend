import { group } from 'console';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { Answer } from './Answer';
import { QComment } from './QComment';
import { QLike } from './QLike';
import { User } from './User';
@Entity()

@Unique(['id'])
export class Question extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({nullable:true})
  title: string;
  @Column({ nullable:true })
  content: string;
  @Column({ nullable:true })
  createdDate: Date;
  @Column({ nullable:true })
  numLike: number;
  @Column({ nullable:true })
  imageId: string;
  @Column({ nullable:true })
  tagId: string;
  @Column({ nullable:true })
  language: string;

  
  //   Many To One References
  @ManyToOne(type => User, user => user.questions)
  @JoinColumn({name: 'ref_userId'})
  user: User;

  //   One To Many References
  @OneToMany(type=>Answer, answer => answer.question, {
    onDelete:'CASCADE',
    eager: true
  })
  answers: Answer[];
  @OneToMany(type=>QComment, qComment => qComment.question, {
    onDelete:'CASCADE',
    eager: true
  })
  qComments: QComment[];
  @OneToMany(type=>QLike, qLike => qLike.question, {
    onDelete:'CASCADE',
    eager: true
  })
  qLikes: QLike[];
}