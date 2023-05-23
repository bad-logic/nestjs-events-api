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

@Entity('users')
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @JoinColumn({
    name: 'profile_id',
  })
  profile: Profile;

  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];

  @OneToMany(() => Attendee, (attendee) => attendee.user)
  attended: Attendee[];
}
