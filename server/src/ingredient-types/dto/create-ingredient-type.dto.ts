import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateIngredientTypeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  @Transform(({ value }: { value: string }) => value.trim())
  name: string;
}
