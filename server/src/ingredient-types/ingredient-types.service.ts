import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateIngredientTypeDto } from './dto/create-ingredient-type.dto';
import { UpdateIngredientTypeDto } from './dto/update-ingredient-type.dto';

@Injectable()
export class IngredientTypesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.ingredientType.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: { select: { ingredients: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateIngredientTypeDto) {
    const existing = await this.prisma.ingredientType.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Ingredient type with this name already exists');

    return this.prisma.ingredientType.create({
      data: { name: dto.name },
      select: { id: true, name: true, createdAt: true, _count: { select: { ingredients: true } } },
    });
  }

  async update(id: string, dto: UpdateIngredientTypeDto) {
    await this.findById(id);
    return this.prisma.ingredientType.update({
      where: { id },
      data: dto,
      select: { id: true, name: true, createdAt: true, _count: { select: { ingredients: true } } },
    });
  }

  async remove(id: string) {
    const type = await this.prisma.ingredientType.findUnique({
      where: { id },
      select: { id: true, _count: { select: { ingredients: true } } },
    });
    if (!type) throw new NotFoundException('Ingredient type not found');
    if (type._count.ingredients > 0) {
      throw new BadRequestException('Cannot delete a type that has ingredients assigned to it');
    }
    await this.prisma.ingredientType.delete({ where: { id } });
  }

  private async findById(id: string) {
    const type = await this.prisma.ingredientType.findUnique({ where: { id } });
    if (!type) throw new NotFoundException('Ingredient type not found');
    return type;
  }
}
