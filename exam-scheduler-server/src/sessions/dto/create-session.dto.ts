// AI-GENERATED
import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSessionDto {
  @IsUUID()
  @IsNotEmpty()
  examId: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string; // validated as future date in service layer
}
