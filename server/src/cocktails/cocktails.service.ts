import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { S3Service } from '../s3/s3.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';

const COCKTAIL_SELECT = {
  id: true,
  title: true,
  maker: true,
  imageUrl: true,
  origin: true,
  createdAt: true,
  updatedAt: true,
  ingredients: {
    select: {
      ingredient: {
        select: { id: true, title: true, imageUrl: true, type: { select: { id: true, name: true } } },
      },
    },
  },
} as const;

@Injectable()
export class CocktailsService {
  constructor(
    private prisma: PrismaService,
    private s3: S3Service,
  ) {}

  findAll() {
    return this.prisma.cocktail.findMany({
      select: COCKTAIL_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const cocktail = await this.prisma.cocktail.findUnique({
      where: { id },
      select: COCKTAIL_SELECT,
    });
    if (!cocktail) throw new NotFoundException('Cocktail not found');
    return cocktail;
  }

  async create(dto: CreateCocktailDto) {
    return this.prisma.cocktail.create({
      data: {
        title: dto.title,
        maker: dto.maker,
        origin: dto.origin,
        imageUrl: dto.imageUrl,
        ingredients: dto.ingredientIds?.length
          ? { create: dto.ingredientIds.map((ingredientId) => ({ ingredientId })) }
          : undefined,
      },
      select: COCKTAIL_SELECT,
    });
  }

  async update(id: string, dto: UpdateCocktailDto) {
    const cocktail = await this.prisma.cocktail.findUnique({
      where: { id },
      select: { id: true, imageUrl: true },
    });
    if (!cocktail) throw new NotFoundException('Cocktail not found');

    if (dto.imageUrl && cocktail.imageUrl && dto.imageUrl !== cocktail.imageUrl) {
      this.s3.deleteImageByAddress(cocktail.imageUrl);
    }

    const { ingredientIds, ...rest } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (ingredientIds !== undefined) {
        await tx.cocktailIngredient.deleteMany({ where: { cocktailId: id } });
      }

      return tx.cocktail.update({
        where: { id },
        data: {
          ...rest,
          ...(ingredientIds !== undefined && {
            ingredients: { create: ingredientIds.map((ingredientId) => ({ ingredientId })) },
          }),
        },
        select: COCKTAIL_SELECT,
      });
    });
  }

  async remove(id: string) {
    const cocktail = await this.prisma.cocktail.findUnique({
      where: { id },
      select: { id: true, imageUrl: true },
    });
    if (!cocktail) throw new NotFoundException('Cocktail not found');
    if (cocktail.imageUrl) this.s3.deleteImageByAddress(cocktail.imageUrl);
    await this.prisma.cocktail.delete({ where: { id } });
  }
}
