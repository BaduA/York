import { IsBoolean, IsIn, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Transform(({ value }: { value: string }) => value.trim())
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }: { value: string }) => value?.trim())
  description?: string;

  @IsString()
  @MaxLength(50)
  @Transform(({ value }: { value: string }) => value?.trim() ?? '')
  price: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }: { value: string }) => value?.trim())
  priceNote?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  badge?: string;

  @IsOptional()
  @IsIn(['simple', 'simple-borderless', 'compact-muted', 'group-title', 'with-description', 'with-pricenote-below', 'with-pricenote-strikethrough', 'property', 'sub-header', 'mini-card'])
  itemVariant?: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder: number;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
