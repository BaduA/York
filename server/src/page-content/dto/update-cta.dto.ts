import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

const t = ({ value }: { value: string }) => value?.trim();

export class UpdateCtaDto {
  @IsOptional() @IsString() @MaxLength(200) @Transform(t) badgeText?: string;
  @IsOptional() @IsString() @MaxLength(200) @Transform(t) headingMain?: string;
  @IsOptional() @IsString() @MaxLength(200) @Transform(t) headingHighlight?: string;
  @IsOptional() @IsString() @MaxLength(500) @Transform(t) description?: string;
}
