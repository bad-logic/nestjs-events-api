import { Controller, Get, Logger, Param } from '@nestjs/common';
import { AttendeeService } from './attendee.service';

@Controller('events/:eventId/attendees')
export class EventAttendeesController {
  logger = new Logger(EventAttendeesController.name);

  constructor(private readonly attendeesService: AttendeeService) {}

  @Get()
  async findAll(@Param('eventId') eventId: number) {
    return this.attendeesService.findByEventId(eventId);
  }
}
