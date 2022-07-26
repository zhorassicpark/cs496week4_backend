import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { Gotter } from './Gotter';
import { Joiner } from './Joiner';
import { Liker } from './Liker';
@Entity()

@Unique(['id'])
export class User extends BaseEntity{
  //  Basic Account Info
  @PrimaryColumn()
  id: string;
  @Column({nullable:true})
  password: string;
  @Column({ nullable:true })
  isActive: boolean;
  @Column({nullable:true})
  iskakao: boolean;

  //  Personal Info
  @Column({nullable:true})
  name: string;
  // @Column({ nullable:true })
  // imgUrl: string;
  @Column({ nullable:true })
  budget: number;
  @Column({ nullable:true })
  defState: string;
  @Column({ nullable:true })
  defArea: string;
  @Column({ nullable:true })
  defTown: string;

  //  One To Many References
  @OneToMany(type=>Liker, liker => liker.user, {
    onDelete:'CASCADE',
    eager: true
  })
  likers: Liker[];
  @OneToMany(type=>Joiner, joiner => joiner.user, {
    onDelete:'CASCADE',
    eager: true
  })
  joiners: Joiner[];
  @OneToMany(type=>Gotter, gotter => gotter.user, {
    onDelete:'CASCADE',
    eager: true
  })
  gotters: Gotter[];
}