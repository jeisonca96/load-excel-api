import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException } from '@nestjs/common';
import { LoadExcelFilesService } from './load-excel-files.service';
import { ExcelService } from '../../core-services/services/excel.service';
import { Events, LoadExcelStatus } from '../constants';
import { ProcessExcelEvent } from '../events/process-excel.event';

type MockDocument = Record<'populate', jest.Mock>;
type MockQuery = Record<'select', jest.Mock>;
type MockModel = Record<'create' | 'findById', jest.Mock>;

jest.mock('../../core-services/services/excel.service');

describe('LoadExcelFilesService', () => {
  let service: LoadExcelFilesService;
  let eventEmitter: EventEmitter2;
  let mockQuery: MockQuery;
  let mockModel: MockModel;
  let mockDocument: MockDocument;

  beforeEach(() => jest.clearAllMocks());

  beforeAll(async () => {
    mockQuery = {
      select: jest.fn(),
    };

    mockModel = {
      create: jest.fn((dataCreated) =>
        Object.assign(mockDocument, dataCreated, {
          created: new Date(),
          modified: new Date(),
        }),
      ),
      findById: jest.fn(() => mockQuery),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventEmitter2,
        LoadExcelFilesService,
        {
          provide: getModelToken('LoadExcel'),
          useValue: mockModel,
        },
        ExcelService,
      ],
    }).compile();

    service = module.get<LoadExcelFilesService>(LoadExcelFilesService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  describe('uploadExcelFile', () => {
    it('Should request for uploading excel file', async () => {
      const _id = '621dd6f34c768b47df5cf98e';
      mockModel.create.mockResolvedValue({ _id });
      const emitEventSpy = jest.spyOn(eventEmitter, 'emit');

      const response = await service.uploadExcelFile(Buffer.alloc(0));

      expect(mockModel.create).toHaveBeenCalledWith({
        status: LoadExcelStatus.PENDING,
      });
      expect(emitEventSpy).toHaveBeenCalledWith(
        Events.ProcessExcelFileEvent,
        new ProcessExcelEvent(_id, Buffer.alloc(0)),
      );
      expect(response).toEqual({ requestId: _id });
    });
  });

  describe('findLoadExcel', () => {
    it('Should find a specific load excel', async () => {
      const requestId = '621dd6f34c768b47df5cf98e';
      mockModel.findById.mockReturnValue({
        status: LoadExcelStatus.DONE,
      });

      const response = await service.findLoadExcel(requestId);

      expect(response).toEqual({
        status: LoadExcelStatus.DONE,
      });
    });

    it('Should throw NotFoundException when not found requestId', async () => {
      const requestId = '621dd6f34c768b47df5cf98e';
      mockModel.findById.mockReturnValue(null);

      return expect(service.findLoadExcel(requestId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('getExcelData', () => {
    it('Should request for uploading excel file', async () => {
      const requestId = '621dd6f34c768b47df5cf98e';
      const findLoadExcelMock = jest
        .spyOn(service, 'findLoadExcel')
        .mockResolvedValueOnce({
          status: LoadExcelStatus.DONE,
          countRows: 1,
          data: [{ name: 'test' }],
          processTime: 1,
          errors: [],
        } as any);

      const response = await service.getExcelData(requestId);

      expect(findLoadExcelMock).toHaveBeenCalledWith(requestId);
      expect(response).toEqual({
        requestId,
        status: LoadExcelStatus.DONE,
        errors: [],
        countRows: 1,
        data: [{ name: 'test' }],
        processTime: '1ms',
      });
    });
  });
});
