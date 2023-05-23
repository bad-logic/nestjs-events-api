import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { EventService } from './events.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { currentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';

@Controller('events-attendance')
export class CurrentUserEventAttendanceController {
  logger = new Logger(CurrentUserEventAttendanceController.name);

  constructor(
    private readonly attendeeService: AttendeeService,
    private readonly eventService: EventService,
  ) {}

  @Get()
  @UseGuards(AuthGuardJwt)
  async findAll(
    @currentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.eventService.getEventsAttendedByUserIdPaginated(user.id, {
      currentPage: page,
      limit,
    });
  }

  @UseGuards(AuthGuardJwt)
  @Get('/:eventId')
  async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @currentUser() user: User,
  ) {
    const attendee = this.attendeeService.findOneByEventIdAndUserId(
      eventId,
      user.id,
    );
    if (!attendee) {
      throw new NotFoundException();
    }
    return attendee;
  }

  @Put('/:eventId')
  @UseGuards(AuthGuardJwt)
  async createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() input: CreateAttendeeDto,
    @currentUser() user: User,
  ) {
    return this.attendeeService.createOrUpdate(input, eventId, user.id);
  }
}
