// AI-GENERATED
import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  examName: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string; // validated as future date in service layer

  @IsInt()
  @Min(1)
  durationMinutes: number;
}
