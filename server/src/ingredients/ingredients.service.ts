import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { S3Service } from '../s3/s3.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

const INGREDIENT_SELECT = {
  id: true,
  title: true,
  description: true,
  imageUrl: true,
  typeId: true,
  type: { select: { id: true, name: true } },
  createdAt: true,
  updatedAt: true,
  _count: { select: { cocktails: true } },
} as const;

@Injectable()
export class IngredientsService {
  constructor(
    private prisma: PrismaService,
    private s3: S3Service,
  ) {}

  findAll() {
    return this.prisma.ingredient.findMany({
      select: INGREDIENT_SELECT,
      orderBy: { title: 'asc' },
    });
  }

  async findOne(id: string) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
      select: INGREDIENT_SELECT,
    });
    if (!ingredient) throw new NotFoundException('Ingredient not found');
    return ingredient;
  }

  async create(dto: CreateIngredientDto) {
    const typeExists = await this.prisma.ingredientType.findUnique({ where: { id: dto.typeId } });
    if (!typeExists) throw new NotFoundException('Ingredient type not found');

    return this.prisma.ingredient.create({
      data: {
        title: dto.title,
        description: dto.description,
        typeId: dto.typeId,
        imageUrl: dto.imageUrl,
      },
      select: INGREDIENT_SELECT,
    });
  }

  async update(id: string, dto: UpdateIngredientDto) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
      select: { id: true, imageUrl: true },
    });
    if (!ingredient) throw new NotFoundException('Ingredient not found');

    if (dto.typeId) {
      const typeExists = await this.prisma.ingredientType.findUnique({ where: { id: dto.typeId } });
      if (!typeExists) throw new NotFoundException('Ingredient type not found');
    }

    if (dto.imageUrl && ingredient.imageUrl && dto.imageUrl !== ingredient.imageUrl) {
      this.s3.deleteImageByAddress(ingredient.imageUrl);
    }

    return this.prisma.ingredient.update({
      where: { id },
      data: dto,
      select: INGREDIENT_SELECT,
    });
  }

  async remove(id: string) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
      select: { id: true, imageUrl: true, _count: { select: { cocktails: true } } },
    });
    if (!ingredient) throw new NotFoundException('Ingredient not found');
    if (ingredient._count.cocktails > 0) {
      throw new BadRequestException('Cannot delete an ingredient that is used in cocktails');
    }

    if (ingredient.imageUrl) this.s3.deleteImageByAddress(ingredient.imageUrl);

    await this.prisma.ingredient.delete({ where: { id } });
  }
}
