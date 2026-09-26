-- CreateEnum
CREATE TYPE "CocktailOrigin" AS ENUM ('PREMADE', 'USER_MADE');

-- CreateTable
CREATE TABLE "IngredientType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IngredientType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "typeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cocktail" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "maker" TEXT NOT NULL,
    "imageUrl" TEXT,
    "origin" "CocktailOrigin" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cocktail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CocktailIngredient" (
    "cocktailId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,

    CONSTRAINT "CocktailIngredient_pkey" PRIMARY KEY ("cocktailId","ingredientId")
);

-- CreateIndex
CREATE UNIQUE INDEX "IngredientType_name_key" ON "IngredientType"("name");

-- CreateIndex
CREATE INDEX "Ingredient_typeId_idx" ON "Ingredient"("typeId");

-- CreateIndex
CREATE INDEX "CocktailIngredient_ingredientId_idx" ON "CocktailIngredient"("ingredientId");

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "IngredientType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CocktailIngredient" ADD CONSTRAINT "CocktailIngredient_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "Cocktail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CocktailIngredient" ADD CONSTRAINT "CocktailIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
