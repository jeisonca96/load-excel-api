import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@ApiTags('DTO')
export class ResponseUploadFileDto {
  @ApiProperty()
  @IsString()
  requestId: string;
}
