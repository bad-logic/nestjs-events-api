import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Event } from '../events/event.entity';
import { Attendee } from '../events/attendee.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity('users')
@ObjectType()
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: true })
  id: number;

  @Column({ unique: true })
  @Field({ nullable: true })
  username: string;

  @Column({ select: false })
  @Field({ nullable: true })
  password: string;

  @Column({ unique: true })
  @Field({ nullable: true })
  email: string;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @Field(() => Profile)
  @JoinColumn({
    name: 'profile_id',
  })
  profile: Promise<Profile>;

  @OneToMany(() => Event, (event) => event.organizer)
  @Field(() => [Event])
  events: Promise<Event[]>;

  @OneToMany(() => Attendee, (attendee) => attendee.user)
  @Field(() => [Attendee])
  attended: Promise<Attendee[]>;
}
