import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoadExcelFilesListener } from './load-excel-files.listener';
import { ExcelService } from '../../core-services/services/excel.service';
import { LoadExcelStatus } from '../constants';
import { ProcessExcelEvent } from '../events/process-excel.event';

type MockDocument = Record<'populate', jest.Mock>;
type MockQuery = Record<'select', jest.Mock>;
type MockModel = Record<'create' | 'findByIdAndUpdate', jest.Mock>;

jest.mock('../../core-services/services/excel.service');

describe('LoadExcelFilesListener', () => {
  let listener: LoadExcelFilesListener;
  let excelService: ExcelService;
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
      findByIdAndUpdate: jest.fn(() => mockQuery),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventEmitter2,
        LoadExcelFilesListener,
        {
          provide: getModelToken('LoadExcel'),
          useValue: mockModel,
        },
        ExcelService,
      ],
    }).compile();

    listener = module.get<LoadExcelFilesListener>(LoadExcelFilesListener);
    excelService = module.get<ExcelService>(ExcelService);
  });

  describe('updateRequestStatus', () => {
    it('Should update request status', async () => {
      const requestId = '621dd6f34c768b47df5cf98e';
      const status = LoadExcelStatus.PENDING;
      const findByIdAndUpdateMock =
        mockModel.findByIdAndUpdate.mockResolvedValue({});

      await listener.updateLoadExcel(requestId, { status });

      expect(findByIdAndUpdateMock).toHaveBeenCalledWith(requestId, {
        status,
      });
    });
  });

  describe('handleProcessExcelFile', () => {
    it('should process the excel file and return data', async () => {
      jest.spyOn(listener, 'updateLoadExcel').mockResolvedValue({} as any);
      const readExcelMock = jest
        .spyOn(excelService, 'readExcel')
        .mockResolvedValueOnce({
          data: [{ name: 'Jeison', age: 26 }],
          errors: null,
          processTime: 1000,
        });
      const request = new ProcessExcelEvent('request-id', Buffer.alloc(0));

      await listener.handleProcessExcelFile(request);

      expect(listener.updateLoadExcel).toHaveBeenCalledWith('request-id', {
        status: LoadExcelStatus.PROCESSING,
      });
      expect(readExcelMock).toHaveBeenCalledWith(Buffer.alloc(0));
      expect(listener.updateLoadExcel).toHaveBeenCalledWith('request-id', {
        status: LoadExcelStatus.DONE,
        errors: null,
        data: [{ name: 'Jeison', age: 26 }],
        processTime: 1000,
        countRows: 1,
      });
    });
    it('should process the excel file and return error', async () => {
      jest.spyOn(listener, 'updateLoadExcel').mockResolvedValue({} as any);
      const readExcelMock = jest
        .spyOn(excelService, 'readExcel')
        .mockResolvedValueOnce({
          data: null,
          errors: [{ message: 'Error' }],
          processTime: 1000,
        });
      const request = new ProcessExcelEvent('request-id', Buffer.alloc(0));

      await listener.handleProcessExcelFile(request);

      expect(listener.updateLoadExcel).toHaveBeenCalledWith('request-id', {
        status: LoadExcelStatus.PROCESSING,
      });
      expect(readExcelMock).toHaveBeenCalledWith(Buffer.alloc(0));
      expect(listener.updateLoadExcel).toHaveBeenCalledWith('request-id', {
        status: LoadExcelStatus.ERROR,
        errors: [{ message: 'Error' }],
        data: null,
        processTime: 1000,
        countRows: undefined,
      });
    });
  });
});
