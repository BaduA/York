import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateSushiVocabDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value.trim())
  term: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Transform(({ value }: { value: string }) => value.trim())
  translation: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder: number;
}
