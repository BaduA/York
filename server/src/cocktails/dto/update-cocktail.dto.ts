import { IsString, IsOptional, MinLength, MaxLength, IsEnum, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { CocktailOrigin } from '@prisma/client';

export class UpdateCocktailDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value.trim())
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value.trim())
  maker?: string;

  @IsOptional()
  @IsEnum(CocktailOrigin)
  origin?: CocktailOrigin;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredientIds?: string[];
}
