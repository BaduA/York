import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

const t = ({ value }: { value: string }) => value?.trim();

export class UpdateHeroDto {
  @IsOptional() @IsString() @MaxLength(200) @Transform(t) badgeText?: string;
  @IsOptional() @IsString() @MaxLength(200) @Transform(t) headingMain?: string;
  @IsOptional() @IsString() @MaxLength(200) @Transform(t) headingHighlight?: string;
  @IsOptional() @IsString() @MaxLength(500) @Transform(t) description?: string;
  @IsOptional() @IsString() @MaxLength(100) pill1Icon?: string;
  @IsOptional() @IsString() @MaxLength(200) @Transform(t) pill1Text?: string;
  @IsOptional() @IsString() @MaxLength(100) pill2Icon?: string;
  @IsOptional() @IsString() @MaxLength(200) @Transform(t) pill2Text?: string;
  @IsOptional() @IsString() @MaxLength(100) pill3Icon?: string;
  @IsOptional() @IsString() @MaxLength(200) @Transform(t) pill3Text?: string;
}
