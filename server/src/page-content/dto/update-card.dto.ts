import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

const t = ({ value }: { value: string }) => value?.trim();

export class UpdateCardDto {
  @IsOptional() @IsString() @MaxLength(100) @Transform(t) badgeLabel?: string;
  @IsOptional() @IsString() @MaxLength(200) @Transform(t) title?: string;
  @IsOptional() @IsString() @MaxLength(300) @Transform(t) description?: string;
  @IsOptional() @IsString() @MaxLength(500) imageUrl?: string;
}
