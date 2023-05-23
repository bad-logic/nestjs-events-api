import { Repository } from 'typeorm';
import { EventsController } from './events.controller';
import { EventService } from './events.service';
import { Event } from './event.entity';
import { ListEvents } from './list.events';
import { User } from '../auth/user.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('EventController', () => {
  let eventsController: EventsController;
  let eventsService: EventService;
  let eventsRepository: Repository<Event>;

  // setup
  beforeEach(() => {
    eventsService = new EventService(eventsRepository);
    eventsController = new EventsController(eventsService);
  });

  it('should return a paginated response with list of events', async () => {
    const result = {
      current: 1,
      last: 0,
      limit: 10,
      total: 0,
      data: [],
    };

    // eventsService.getEventsWithAttendeeCountFilteredPaginated = jest
    //   .fn()
    //   .mockImplementation((): any => result);

    const spy = jest
      .spyOn(eventsService, 'getEventsWithAttendeeCountFilteredPaginated')
      .mockImplementation((): any => result);

    const events = await eventsController.findAll(new ListEvents());
    expect(events).toEqual(result);
    expect(spy).toBeCalledTimes(1);
  });

  it("should not delete an event when it's not found", async () => {
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent');
    const findSpy = jest
      .spyOn(eventsService, 'findOne')
      .mockImplementation((): any => undefined);
    try {
      await eventsController.remove(10, new User());
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(findSpy).toBeCalledTimes(1);
      expect(findSpy).toBeCalledWith(10);
      expect(deleteSpy).toBeCalledTimes(0);
    }
  });

  it('should not delete an event if it is not created by the logged in user', async () => {
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent');
    const findSpy = jest
      .spyOn(eventsService, 'findOne')
      .mockImplementation((): any => ({
        id: 2,
        name: 'event1',
        organizer_id: 5,
      }));
    try {
      const user = new User({ id: 10, username: 'user123' });

      await eventsController.remove(2, user);
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenException);
      expect(findSpy).toBeCalledTimes(1);
      expect(findSpy).toBeCalledWith(2);
      expect(deleteSpy).toBeCalledTimes(0);
    }
  });

  it('should delete an event if it is found and created by the logged in user', async () => {
    const deleteSpy = jest
      .spyOn(eventsService, 'deleteEvent')
      .mockImplementation((): any => {
        return;
      });
    const findSpy = jest
      .spyOn(eventsService, 'findOne')
      .mockImplementation((): any => ({
        id: 2,
        name: 'event1',
        organizer_id: 5,
      }));

    const user = new User({ id: 5, username: 'user123' });

    await eventsController.remove(2, user);

    expect(findSpy).toBeCalledTimes(1);
    expect(findSpy).toBeCalledWith(2);
    expect(deleteSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledWith(2);
  });
});
