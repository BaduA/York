import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ReorderDto } from './dto/reorder.dto';

const ITEMS_INCLUDE = { orderBy: { sortOrder: 'asc' as const } };

const GROUP_INCLUDE = {
  orderBy: { sortOrder: 'asc' as const },
  include: { items: ITEMS_INCLUDE },
};

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  findPublic() {
    return this.prisma.menuSection.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        groups: {
          where: { isVisible: true },
          ...GROUP_INCLUDE,
          include: {
            items: {
              where: { isVisible: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.menuSection.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { groups: { ...GROUP_INCLUDE } },
    });
  }

  async createSection(dto: CreateSectionDto) {
    const existing = await this.prisma.menuSection.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('A section with this slug already exists');
    return this.prisma.menuSection.create({ data: dto, include: { groups: GROUP_INCLUDE } });
  }

  async updateSection(id: string, dto: UpdateSectionDto) {
    await this.requireSection(id);
    return this.prisma.menuSection.update({ where: { id }, data: dto, include: { groups: GROUP_INCLUDE } });
  }

  async deleteSection(id: string) {
    await this.requireSection(id);
    await this.prisma.menuSection.delete({ where: { id } });
  }

  async reorderSections(dto: ReorderDto) {
    await this.prisma.$transaction(
      dto.items.map(({ id, sortOrder }) =>
        this.prisma.menuSection.update({ where: { id }, data: { sortOrder } }),
      ),
    );
  }

  async createGroup(sectionId: string, dto: CreateGroupDto) {
    await this.requireSection(sectionId);
    return this.prisma.menuGroup.create({
      data: { ...dto, sectionId },
      include: { items: ITEMS_INCLUDE },
    });
  }

  async updateGroup(id: string, dto: UpdateGroupDto) {
    await this.requireGroup(id);
    return this.prisma.menuGroup.update({
      where: { id },
      data: dto,
      include: { items: ITEMS_INCLUDE },
    });
  }

  async deleteGroup(id: string) {
    await this.requireGroup(id);
    await this.prisma.menuGroup.delete({ where: { id } });
  }

  async reorderGroups(dto: ReorderDto) {
    await this.prisma.$transaction(
      dto.items.map(({ id, sortOrder }) =>
        this.prisma.menuGroup.update({ where: { id }, data: { sortOrder } }),
      ),
    );
  }

  async createItem(groupId: string, dto: CreateItemDto) {
    await this.requireGroup(groupId);
    return this.prisma.menuItem.create({ data: { ...dto, groupId } });
  }

  async updateItem(id: string, dto: UpdateItemDto) {
    await this.requireItem(id);
    return this.prisma.menuItem.update({ where: { id }, data: dto });
  }

  async deleteItem(id: string) {
    await this.requireItem(id);
    await this.prisma.menuItem.delete({ where: { id } });
  }

  async reorderItems(dto: ReorderDto) {
    await this.prisma.$transaction(
      dto.items.map(({ id, sortOrder }) =>
        this.prisma.menuItem.update({ where: { id }, data: { sortOrder } }),
      ),
    );
  }

  private async requireSection(id: string) {
    const s = await this.prisma.menuSection.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Menu section not found');
    return s;
  }

  private async requireGroup(id: string) {
    const g = await this.prisma.menuGroup.findUnique({ where: { id } });
    if (!g) throw new NotFoundException('Menu group not found');
    return g;
  }

  private async requireItem(id: string) {
    const i = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!i) throw new NotFoundException('Menu item not found');
    return i;
  }
}
