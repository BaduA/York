import { IsString, IsOptional, MinLength, MaxLength, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateIngredientDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value.trim())
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @Transform(({ value }: { value: string }) => value.trim())
  description: string;

  @IsString()
  typeId: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
