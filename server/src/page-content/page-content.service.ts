import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { UpdateCtaDto } from './dto/update-cta.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateSushiVocabDto } from './dto/create-sushi-vocab.dto';
import { UpdateSushiVocabDto } from './dto/update-sushi-vocab.dto';
import { ReorderDto } from '../menu/dto/reorder.dto';

const HERO_DEFAULTS = {
  badgeText: "Bilkent'in Asya & Sokak Lezzetleri Buluşma Noktası",
  headingMain: 'STREET FOOD',
  headingHighlight: '& CRAFT BAR',
  description:
    'Taze Sushi, Wok Noodle, Bento kutuları, özel burgerler ve gecenin ritmini tutan buz gibi fıçı biralar ile kendi kokteylini tasarlayabileceğin interaktif bar deneyimi.',
  pill1Icon: 'solar:cup-bold',
  pill1Text: "Buzzz Gibi Fıçı 240₺'den Başlayan",
  pill2Icon: 'mdi:fish',
  pill2Text: 'Günün Balığı Özel 675₺',
  pill3Icon: 'solar:stars-minimalistic-bold',
  pill3Text: '5+1 Shot & Şişe Fırsatları',
};

const CTA_DEFAULTS = {
  badgeText: 'Aylık Kokteyl Yarışması',
  headingMain: 'Kendi Kokteylini Yarat,',
  headingHighlight: 'Menüye İsmini Yazdır',
  description:
    'Favori içkilerini, taze aromaları ve özel garnitürleri seç. Her ay en çok oyu alan özel reçete Bilkent York resmi menüsüne girsin!',
};

const CARD_DEFAULTS: Record<number, { badgeLabel: string; title: string; description: string; imageUrl?: string }> = {
  1: {
    badgeLabel: 'Sushi Bar',
    title: 'Taze Sushi & Rolls',
    description: 'Uramaki, Maki, Nigiri & Sashimi spesiyalleri',
    imageUrl: 'https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/ZMi4cF0X5kb/components/AAIvuxGxRFa.jpeg',
  },
  2: {
    badgeLabel: 'Bar & Promo',
    title: 'Fıçı & 5+1 Shotlar',
    description: 'Bud, Efes, Kovalar, Tekila & Jäger paketleri',
    imageUrl: 'https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/ZMi4cF0X5kb/components/Qryfgpi8vmj.jpeg',
  },
};

@Injectable()
export class PageContentService {
  constructor(private prisma: PrismaService) {}

  async getMenuPageContent() {
    const [hero, cards, cta, sushiVocab] = await Promise.all([
      this.prisma.menuPageHero.upsert({
        where: { id: 'singleton' },
        create: { id: 'singleton', ...HERO_DEFAULTS },
        update: {},
      }),
      this.prisma.menuPageCard.findMany({ orderBy: { slot: 'asc' } }),
      this.prisma.menuPageCta.upsert({
        where: { id: 'singleton' },
        create: { id: 'singleton', ...CTA_DEFAULTS },
        update: {},
      }),
      this.prisma.sushiVocabEntry.findMany({ orderBy: { sortOrder: 'asc' } }),
    ]);
    return { hero, cards, cta, sushiVocab };
  }

  async updateHero(dto: UpdateHeroDto) {
    return this.prisma.menuPageHero.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...HERO_DEFAULTS, ...dto },
      update: dto,
    });
  }

  async updateCta(dto: UpdateCtaDto) {
    return this.prisma.menuPageCta.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...CTA_DEFAULTS, ...dto },
      update: dto,
    });
  }

  async updateCard(slot: number, dto: UpdateCardDto) {
    const defaults = CARD_DEFAULTS[slot] ?? { badgeLabel: '', title: '', description: '' };
    return this.prisma.menuPageCard.upsert({
      where: { slot },
      create: { slot, ...defaults, ...dto },
      update: dto,
    });
  }

  async createSushiVocab(dto: CreateSushiVocabDto) {
    return this.prisma.sushiVocabEntry.create({ data: dto });
  }

  async updateSushiVocab(id: string, dto: UpdateSushiVocabDto) {
    await this.requireVocab(id);
    return this.prisma.sushiVocabEntry.update({ where: { id }, data: dto });
  }

  async deleteSushiVocab(id: string) {
    await this.requireVocab(id);
    await this.prisma.sushiVocabEntry.delete({ where: { id } });
  }

  async reorderSushiVocab(dto: ReorderDto) {
    await this.prisma.$transaction(
      dto.items.map(({ id, sortOrder }) =>
        this.prisma.sushiVocabEntry.update({ where: { id }, data: { sortOrder } }),
      ),
    );
  }

  private async requireVocab(id: string) {
    const v = await this.prisma.sushiVocabEntry.findUnique({ where: { id } });
    if (!v) throw new NotFoundException('Sushi vocab entry not found');
    return v;
  }
}
