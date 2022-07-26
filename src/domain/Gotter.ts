import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { Item } from './Item';
import { User } from './User';
@Entity()
@Unique(['user', 'item'])
export class Gotter extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({type: 'decimal', precision: 2, scale: 1, nullable:true})
  usersRate: number;  //  원래 0~5지만 정수로 하기 위해 0~10으로 저장.
  @Column({nullable:true})
  usersReview: string;
  @Column({nullable:true})
  reviewDate: Date;

  //   Many To One References
  @ManyToOne(type => User, user => user.gotters)
  @JoinColumn({name: 'ref_userId'})
  user: User;
  @ManyToOne(type => Item, item => item.gotters)
  @JoinColumn({name: 'ref_itemId'})
  item: Item;
}