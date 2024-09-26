import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Priority } from "@prisma/client";
import { Transform } from "class-transformer";


export class TimerSessionDto {
  @IsOptional()
  @IsBoolean()
  isCompleted: boolean
}

export class TimerRoundDto {
  @IsNumber()
  totalSeconds: number
  @IsOptional()
  @IsBoolean()
  isCompleted: boolean
}


