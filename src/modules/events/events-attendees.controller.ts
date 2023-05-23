import { Controller, Get, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { AttendeeService } from './attendee.service';

@Controller('events/:eventId/attendees')
export class EventAttendeesController {
  logger = new Logger(EventAttendeesController.name);

  constructor(private readonly attendeesService: AttendeeService) {}

  @Get()
  async findAll(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.attendeesService.findByEventId(eventId);
  }
}
