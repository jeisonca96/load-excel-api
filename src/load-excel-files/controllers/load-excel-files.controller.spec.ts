import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MockedService } from '../../lib/test-utils/mock-types';
import { LoadExcelFilesController } from './load-excel-files.controller';
import { LoadExcelFilesService } from '../services/load-excel-files.service';

jest.mock('../services/load-excel-files.service');

describe('LoadExcelFilesController', () => {
  let service: MockedService<LoadExcelFilesService>;
  let controller: LoadExcelFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoadExcelFilesController],
      providers: [LoadExcelFilesService],
    }).compile();

    controller = module.get<LoadExcelFilesController>(LoadExcelFilesController);
    service = module.get(LoadExcelFilesService);
  });

  describe('uploadExcelFile', () => {
    it('should call loadExcelFilesService.uploadExcelFile with file buffer', async () => {
      const file = { buffer: Buffer.from([1, 2, 3]) };
      await controller.uploadExcelFile(file);
      expect(service.uploadExcelFile).toHaveBeenCalledWith(file.buffer);
    });

    it('should throw BadRequestException if file is missing', async () => {
      await expect(controller.uploadExcelFile(undefined)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getExcelData', () => {
    it('should call to getExcelData service function', async () => {
      service.getExcelData.mockResolvedValueOnce({} as any);
      const requestId = 'requestId';

      const response = await controller.getExcelData(requestId);

      expect(response).toBeDefined();
      expect(service.getExcelData).toHaveBeenCalledWith(requestId);
    });
    it('should re-throw errors from service', async () => {
      service.getExcelData.mockRejectedValueOnce(new Error('n-error'));

      const promise = controller.getExcelData('');

      await expect(promise).rejects.toThrow('n-error');
    });
  });
});
