import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateIngredientTypeDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  @Transform(({ value }: { value: string }) => value.trim())
  name?: string;
}
