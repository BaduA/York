import { PartialType } from '@nestjs/mapped-types';
import { CreateSushiVocabDto } from './create-sushi-vocab.dto';

export class UpdateSushiVocabDto extends PartialType(CreateSushiVocabDto) {}
