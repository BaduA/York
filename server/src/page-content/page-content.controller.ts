import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PageContentService } from './page-content.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { UpdateCtaDto } from './dto/update-cta.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateSushiVocabDto } from './dto/create-sushi-vocab.dto';
import { UpdateSushiVocabDto } from './dto/update-sushi-vocab.dto';
import { ReorderDto } from '../menu/dto/reorder.dto';

@Controller('page-content')
export class PageContentController {
  constructor(private readonly service: PageContentService) {}

  // ─── Public ───────────────────────────────────────────────────────────────

  @Get('menu')
  getMenuPageContent() {
    return this.service.getMenuPageContent();
  }

  // ─── Hero ─────────────────────────────────────────────────────────────────

  @UseGuards(AdminGuard)
  @Patch('menu/hero')
  updateHero(@Body() dto: UpdateHeroDto) {
    return this.service.updateHero(dto);
  }

  // ─── CTA ──────────────────────────────────────────────────────────────────

  @UseGuards(AdminGuard)
  @Patch('menu/cta')
  updateCta(@Body() dto: UpdateCtaDto) {
    return this.service.updateCta(dto);
  }

  // ─── Hero cards ───────────────────────────────────────────────────────────

  @UseGuards(AdminGuard)
  @Patch('menu/cards/:slot')
  updateCard(
    @Param('slot', ParseIntPipe) slot: number,
    @Body() dto: UpdateCardDto,
  ) {
    return this.service.updateCard(slot, dto);
  }

  // ─── Sushi vocabulary ─────────────────────────────────────────────────────

  @UseGuards(AdminGuard)
  @Post('menu/sushi-vocab')
  createSushiVocab(@Body() dto: CreateSushiVocabDto) {
    return this.service.createSushiVocab(dto);
  }

  @UseGuards(AdminGuard)
  @Patch('menu/sushi-vocab/reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  reorderSushiVocab(@Body() dto: ReorderDto) {
    return this.service.reorderSushiVocab(dto);
  }

  @UseGuards(AdminGuard)
  @Patch('menu/sushi-vocab/:id')
  updateSushiVocab(@Param('id') id: string, @Body() dto: UpdateSushiVocabDto) {
    return this.service.updateSushiVocab(id, dto);
  }

  @UseGuards(AdminGuard)
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  @Delete('menu/sushi-vocab/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSushiVocab(@Param('id') id: string) {
    return this.service.deleteSushiVocab(id);
  }
}
