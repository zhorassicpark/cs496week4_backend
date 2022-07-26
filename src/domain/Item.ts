import { group } from 'console';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { Url } from 'url';
import { Joiner } from './Joiner';
import { Liker } from './Liker';
import { Gotter } from './Gotter';
@Entity()

@Unique(['id'])
export class Item extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({nullable:true})
  name: string;
  @Column({type: 'decimal', precision: 2, scale: 1, nullable:true})
  rate: number;
  @Column({nullable:true})
  rateMan: number;
  @Column({ nullable:true })
  orgPrice: number;
  @Column({ nullable:true })
  salePrice: number;
  @Column({ nullable:true })
  minMan: number;
  @Column({ nullable:true })
  nowMan: number;
  @Column({ nullable:true })
  dueDate: Date;
  @Column({ nullable:true })
  imgUrl: string;
  @Column({ nullable:true })
  category: string;
  @Column({ nullable:true })
  state: string;
  @Column({ nullable:true })
  area: string;
  @Column({ nullable:true })
  town: string;

  //   One To Many References
  @OneToMany(type=>Liker, liker => liker.item, {
    onDelete:'CASCADE',
    eager: true
  })
  likers: Liker[];
  @OneToMany(type=>Joiner, joiner => joiner.item, {
    onDelete:'CASCADE',
    eager: true
  })
  joiners: Joiner[];
  @OneToMany(type=>Gotter, gotter => gotter.item, {
    onDelete:'CASCADE',
    eager: true
  })
  gotters: Gotter[];
}