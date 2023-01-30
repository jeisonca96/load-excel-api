import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../../exceptions/dtos/api-error-response.dto';
import { ResponseUploadFileDto } from '../dtos/response-upload-file.dto';
import { ExcelDataDto } from '../dtos/excel-data.dto';

export const UploadExcelFileApiDocs = () =>
  applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({
      description: 'Make a request to upload excel file',
      summary: 'Upload excel file',
    }),
    ApiBody({
      type: 'formData',
      description: 'Excel file',
      required: true,
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'The excel file to upload',
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'Response requestId for upload excel file',
      type: ResponseUploadFileDto,
    }),
    ApiBadRequestResponse({
      description: 'File is required',
      type: ApiErrorResponseDto,
    }),
  );

export const GetExcelDataDocs = () =>
  applyDecorators(
    ApiOperation({
      description: 'Get data from excel file by requestId',
      summary: 'Get data from excel file',
    }),
    ApiParam({ name: 'requestId', type: 'string', description: 'Request Id' }),
    ApiOkResponse({
      description: 'Response data from excel file',
      type: ExcelDataDto,
    }),
    ApiNotFoundResponse({
      description: 'Load excel not found',
      type: ApiErrorResponseDto,
    }),
  );
