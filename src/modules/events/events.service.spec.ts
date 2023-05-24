import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';

import { EventService } from './events.service';
import { Event } from './event.entity';

import * as paginator from '../../common/pagination/paginator';

jest.mock('../../common/pagination/paginator');

describe('EventsService', () => {
  let service: EventService;
  let repository: Repository<Event>;
  let selectQb;
  let deleteQb;
  let mockedPaginate;

  beforeEach(async () => {
    mockedPaginate = paginator.paginate as jest.Mock;
    deleteQb = {
      where: jest.fn(),
      execute: jest.fn(),
    };
    selectQb = {
      delete: jest.fn().mockReturnValue(deleteQb),
      where: jest.fn(),
      execute: jest.fn(),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(selectQb),
            delete: jest.fn(),
            where: jest.fn(),
            execute: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<EventService>(EventService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  describe('updateEvent', () => {
    it('should update the event', async () => {
      const repoSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ id: 1 } as Event);
      expect(
        service.updateEvent(new Event({ id: 1 }), { name: 'New name' }),
      ).resolves.toEqual({ id: 1 });

      expect(repoSpy).toBeCalledWith({ id: 1, name: 'New name' });
    });
  });

  describe('deleteEvent', () => {
    it('should delete the event', () => {
      const createQbSpy = jest.spyOn(repository, 'createQueryBuilder');
      const deleteQbSpy = jest
        .spyOn(selectQb, 'delete')
        .mockReturnValue(deleteQb);
      const whereSpy = jest.spyOn(deleteQb, 'where').mockReturnValue(deleteQb);
      const executeSpy = jest.spyOn(deleteQb, 'execute');

      expect(service.deleteEvent(1)).resolves.toBe(undefined);

      expect(createQbSpy).toBeCalledTimes(1);
      expect(createQbSpy).toBeCalledWith('e');

      expect(deleteQbSpy).toBeCalledTimes(1);

      expect(whereSpy).toBeCalledTimes(1);
      expect(whereSpy).toBeCalledWith('id = :id', { id: 1 });

      expect(executeSpy).toBeCalledTimes(1);
    });
  });

  describe('getEventsAttendedByUserIdPaginated', () => {
    it('should return the paginated events attended by the user', () => {
      const orderSpy = jest
        .spyOn(selectQb, 'orderBy')
        .mockReturnValue(selectQb);

      const leftJoinSpy = jest
        .spyOn(selectQb, 'leftJoinAndSelect')
        .mockReturnValue(selectQb);

      const whereSpy = jest.spyOn(selectQb, 'where').mockReturnValue(selectQb);

      mockedPaginate.mockResolvedValue({
        current: 1,
        last: 0,
        limit: 5,
        total: 0,
        data: [],
      });

      expect(
        service.getEventsAttendedByUserIdPaginated(100, {
          currentPage: 1,
          limit: 5,
        }),
      ).resolves.toEqual({
        current: 1,
        last: 0,
        limit: 5,
        total: 0,
        data: [],
      });

      expect(orderSpy).toBeCalledTimes(1);
      expect(orderSpy).toBeCalledWith('e.id', 'DESC');

      expect(leftJoinSpy).toBeCalledTimes(1);
      expect(leftJoinSpy).toBeCalledWith('e.attendees', 'a');

      expect(whereSpy).toBeCalledTimes(1);
      expect(whereSpy).toBeCalledWith('a.userId = :userId', { userId: 100 });

      expect(mockedPaginate).toBeCalledTimes(1);
      expect(mockedPaginate).toBeCalledWith(selectQb, {
        currentPage: 1,
        limit: 5,
      });
    });
  });
});
