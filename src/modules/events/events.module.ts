import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';
import { EventService } from './events.service';
import { AttendeeService } from './attendee.service';
import { EventAttendeesController } from './events-attendees.controller';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [
    EventsController,
    EventAttendeesController,
    EventsOrganizedByUserController,
    CurrentUserEventAttendanceController,
  ],
  providers: [EventService, AttendeeService],
})
export class EventsModule {}
