import {
  IsBoolean, IsIn, IsInt, IsOptional, IsString, MaxLength, Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const trim = ({ value }: { value: string }) => value?.trim();

export class CreateGroupDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Transform(trim)
  title?: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder: number;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  // ─── Layout ───────────────────────────────────────────────────────────────

  @IsOptional()
  @IsIn(['card', 'card-item', 'description-box'])
  groupType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  colStart?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  colSpan?: number;

  // ─── Card appearance ──────────────────────────────────────────────────────

  @IsOptional()
  @IsBoolean()
  borderHighlight?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(trim)
  cornerBadge?: string;

  @IsOptional()
  @IsBoolean()
  glowEffect?: boolean;

  // ─── Title options ────────────────────────────────────────────────────────

  @IsOptional()
  @IsIn(['plain', 'badge-primary', 'badge-secondary'])
  titleStyle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(trim)
  titleNote?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(trim)
  titleRightIcon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(trim)
  titleRightLabel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(trim)
  titleRightBadge?: string;

  @IsOptional()
  @IsBoolean()
  titleBorderBottom?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  @Transform(trim)
  subtitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(trim)
  descriptionText?: string;

  @IsOptional()
  @IsIn(['top', 'bottom'])
  descriptionBoxPos?: string;

  // ─── Item options ─────────────────────────────────────────────────────────

  @IsOptional()
  @IsIn(['simple', 'with-description', 'with-pricenote-below', 'with-pricenote-strikethrough', 'property', 'sub-header', 'mini-card'])
  itemVariant?: string;

  @IsOptional()
  @IsIn(['rows', 'grid-2col'])
  itemLayout?: string;

  @IsOptional()
  @IsIn(['normal', 'compact'])
  itemSize?: string;

  @IsOptional()
  @IsBoolean()
  mergeWithPrev?: boolean;
}
