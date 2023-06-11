import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';
import { User } from '../auth/user.entity';
import { Expose } from 'class-transformer';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity('events')
@ObjectType()
export class Event {
  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Expose()
  @Field({ nullable: true })
  id: number;

  @Column()
  @Expose()
  @Field({ nullable: true })
  name: string;

  @Column()
  @Expose()
  @Field({ nullable: true })
  description: string;

  @Column()
  @Expose()
  @Field({ nullable: true })
  when: Date;

  @Column()
  @Expose()
  @Field({ nullable: true })
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, { cascade: true })
  attendees: Attendee[];

  @ManyToOne(() => User, (user) => user.events)
  @JoinColumn({
    name: 'organizer_id',
  })
  organizer: Promise<User>;

  @Column({ nullable: true })
  organizer_id: number;

  @Expose()
  attendeeCount?: number;

  @Expose()
  attendeeRejected?: number;

  @Expose()
  attendeeMaybe?: number;

  @Expose()
  attendeeAccepted?: number;
}
