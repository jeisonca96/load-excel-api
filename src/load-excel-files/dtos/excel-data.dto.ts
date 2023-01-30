import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsArray, IsString, IsNumber } from 'class-validator';
import { LoadExcelStatus } from '../constants';

@ApiTags('DTO')
export class ExcelDataDto {
  @ApiProperty()
  @IsString()
  requestId: string;

  @ApiProperty()
  @IsEnum(LoadExcelStatus)
  status: string;

  @ApiPropertyOptional()
  @IsArray()
  errors?: Record<any, any>[];

  @ApiPropertyOptional()
  @IsNumber()
  countRows: number;

  @ApiPropertyOptional()
  @IsArray()
  data?: Record<any, any>[];

  @ApiProperty()
  @IsString()
  processTime: string;
}
