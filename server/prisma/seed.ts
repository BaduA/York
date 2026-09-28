import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding menu...');

  await prisma.menuItem.deleteMany();
  await prisma.menuGroup.deleteMany();
  await prisma.menuSection.deleteMany();
  await prisma.sushiVocabEntry.deleteMany();
  await prisma.menuPageHero.deleteMany();
  await prisma.menuPageCard.deleteMany();
  await prisma.menuPageCta.deleteMany();

  const sections = [
    {
      slug: 'promo-bar',
      title: 'PROMO & BAR',
      subtitle: 'Fıçı Biralar, Şişeler, Shot Menüleri ve Günün Balığı',
      icon: 'mdi:beer',
      badge: 'YORK SPECIALS',
      sortOrder: 1,
      gridTemplate: '1fr 1fr 1fr',
      groups: [
        {
          title: 'Buzzz Gibi Bira',
          sortOrder: 1,
          groupType: 'card',
          colStart: 1,
          colSpan: 1,
          glowEffect: true,
          titleStyle: 'badge-primary',
          titleBorderBottom: false,
          itemVariant: 'with-pricenote-below',
          itemLayout: 'rows',
          items: [
            { name: 'Bud Fıçı',  description: '33 cl / 50 cl', price: '245 ₺', priceNote: '275 ₺', sortOrder: 1 },
            { name: 'Efes Fıçı', description: '33 cl / 50 cl', price: '240 ₺', priceNote: '270 ₺', sortOrder: 2 },
            { name: 'Kova Fırsatları', itemVariant: 'sub-header', price: '', sortOrder: 3 },
            { name: "4'lü Kova", itemVariant: 'compact-muted', price: '1.150 ₺', sortOrder: 4 },
            { name: "5'li Kova", itemVariant: 'compact-muted', price: '1.380 ₺', sortOrder: 5 },
            { name: "6'lı Kova", itemVariant: 'compact-muted', price: '1.650 ₺', sortOrder: 6 },
          ],
        },
        {
          title: 'Wine & Shot',
          sortOrder: 3,
          groupType: 'card',
          colStart: 2,
          colSpan: 1,
          titleStyle: 'badge-primary',
          titleBorderBottom: false,
          itemVariant: 'with-pricenote-strikethrough',
          itemLayout: 'rows',
          items: [
            { name: '5+1 Tekila', price: '1.450 ₺', priceNote: '1.560 ₺', sortOrder: 1 },
            { name: '5+1 Jäger', price: '1.500 ₺', priceNote: '1.620 ₺', sortOrder: 2 },
            { name: '5+1 Viski', price: '1.550 ₺', priceNote: '1.680 ₺', sortOrder: 3 },
            { name: '1 Şişe Şarap', description: 'Kırmızı / Rose / Beyaz', price: '1.550 ₺', sortOrder: 4 },
          ],
        },
        {
          title: 'Günün Balığı',
          sortOrder: 4,
          groupType: 'card',
          colStart: 3,
          colSpan: 1,
          borderHighlight: true,
          cornerBadge: 'Sadece 675₺',
          titleStyle: 'badge-secondary',
          titleBorderBottom: false,
          descriptionText: 'Her gün taze deniz ürünleri servisi:',
          itemVariant: 'property',
          itemLayout: 'rows',
          items: [
            { name: 'Pazartesi', description: 'Somon Izgara', price: '', sortOrder: 1 },
            { name: 'Salı', description: 'Levrek Izgara', price: '', sortOrder: 2 },
            { name: 'Çarşamba', description: 'Çipura Izgara', price: '', sortOrder: 3 },
            { name: 'Perşembe', description: 'Fish & Chips', price: '', sortOrder: 4 },
            { name: 'Cuma', description: 'Levrek Izgara', price: '', sortOrder: 5 },
            { name: 'Cmt / Pzr', description: 'Tüm Balık Çeşitleri', price: '', sortOrder: 6 },
          ],
        },
      ],
    },
    {
      slug: 'sushi-bar',
      title: 'SUSHI BAR',
      subtitle: 'Taze Somon, Yılan Balığı, Tempura Karides & Roll Çeşitleri',
      icon: 'mdi:fish',
      badge: 'HANDCRAFTED DAILY',
      sortOrder: 2,
      gridTemplate: '5fr 7fr',
      groups: [
        {
          title: 'Sushi Sözlüğü',
          sortOrder: 0,
          groupType: 'description-box',
          descriptionBoxPos: 'top',
          items: [],
        },
        {
          title: 'Sashimi',
          sortOrder: 1,
          groupType: 'card',
          colStart: 1,
          colSpan: 1,
          titleStyle: 'plain',
          titleNote: '4 pcs',
          titleRightIcon: 'solar:fire-square-bold',
          titleBorderBottom: true,
          itemVariant: 'simple-borderless',
          itemLayout: 'rows',
          items: [
            { name: 'Sake Sashimi (Somon)', price: '440 ₺', sortOrder: 1 },
            { name: 'Suzuki Sashimi (Levrek)', price: '430 ₺', sortOrder: 2 },
            { name: 'Nigiri', description: '2 pcs', itemVariant: 'group-title', price: '', sortOrder: 3 },
            { name: 'Sake Nigiri', price: '335 ₺', sortOrder: 4 },
            { name: 'Suzuki Nigiri', price: '355 ₺', sortOrder: 5 },
            { name: 'Ebi Nigiri', price: '345 ₺', sortOrder: 6 },
            { name: 'Kani Nigiri', price: '335 ₺', sortOrder: 7 },
            { name: 'Unagi Nigiri (Tütsülenmiş Yılan Balığı)', price: '435 ₺', sortOrder: 8 },
          ],
        },
        {
          title: 'Maki',
          sortOrder: 3,
          groupType: 'card',
          colStart: 1,
          colSpan: 1,
          titleStyle: 'plain',
          titleNote: '8 pcs',
          titleBorderBottom: true,
          itemVariant: 'simple',
          itemLayout: 'grid-2col',
          items: [
            { name: 'Kappa Maki (Salatalık)', price: '340 ₺', sortOrder: 1 },
            { name: 'Sake Maki (Somon)', price: '345 ₺', sortOrder: 2 },
            { name: 'Kani Maki (Yengeç)', price: '335 ₺', sortOrder: 3 },
            { name: 'Avocado Maki', price: '320 ₺', sortOrder: 4 },
            { name: 'Kani Ebi Maki', price: '370 ₺', sortOrder: 5 },
            { name: 'Ebi Avocado Maki', price: '365 ₺', sortOrder: 6 },
            { name: 'Sake Avocado Maki', price: '370 ₺', sortOrder: 7 },
            { name: 'Unagi Maki', price: '480 ₺', sortOrder: 8 },
            { name: 'Ebi Tempura Maki', price: '370 ₺', sortOrder: 9 },
            { name: 'Suzuki Tempura Maki', price: '375 ₺', sortOrder: 10 },
            { name: 'Kani Tempura Maki', price: '360 ₺', sortOrder: 11 },
          ],
        },
        {
          title: 'Special Uramaki Rolls',
          sortOrder: 4,
          groupType: 'card',
          colStart: 2,
          colSpan: 1,
          titleStyle: 'plain',
          titleNote: '8 pcs',
          titleRightBadge: 'İmza',
          titleBorderBottom: true,
          subtitle: 'Tüm rulo sosları ve malzemeleri şefin özel reçetesidir',
          itemVariant: 'mini-card',
          itemLayout: 'grid-2col',
          items: [
            { name: 'Mi-Sake Roll', price: '555 ₺', description: 'İçi: Tempura Somon, Salatalık, Krem Peynir, Avokado | Dışı: Krispi ve Trüflü Mayonez', sortOrder: 1 },
            { name: 'Dragon Roll', price: '655 ₺', description: 'İçi: Tempura Yengeç, Salatalık, Krem Peynir, Avokado | Dışı: Tütsülenmiş Yılan Balığı, Unagi Sos', sortOrder: 2 },
            { name: 'Tiger Roll', price: '565 ₺', description: 'İçi: Tempura Karides, Salatalık, Krem Peynir, Avokado | Dışı: Balık Yumurtası, Kibrit Patates, Teriyaki Sos', sortOrder: 3 },
            { name: 'Crunchy Roll', price: '555 ₺', description: 'İçi: Somon, Yengeç, Balık Yumurtası, Salatalık | Dışı: Tempura Panko, Spicy Sos, Teriyaki', sortOrder: 4 },
            { name: 'Philadelphia Roll', price: '555 ₺', description: 'İçi: Yengeç Surimi, Salatalık, Krem Peynir, Avokado | Dışı: Taze Somon', sortOrder: 5 },
            { name: 'Rainbow Roll', price: '555 ₺', description: 'İçi: Yengeç Surimi, Salatalık, Krem Peyniri, Avokado | Dışı: Somon, Levrek, Karides, Avokado', sortOrder: 6 },
            { name: 'Ebi Ten Roll', price: '565 ₺', description: 'İçi: Tempura Karides, Salatalık, Krem Peynir, Avokado | Dışı: Krispy Kaplama, Teriyaki Sos', sortOrder: 7 },
            { name: 'Vegas Roll', price: '555 ₺', description: 'İçi: Tempura Karides, Yengeç, Salatalık, Krem Peynir | Dışı: Tütsülenmiş Somon, Cornflakes, Unagi Sos', sortOrder: 8 },
            { name: 'Sesame California', price: '530 ₺', description: 'İçi: Yengeç Surimi, Salatalık, Krem Peynir, Avokado, Karides | Dışı: Susam', sortOrder: 9 },
            { name: 'Midori Veggie Roll', price: '515 ₺', description: 'İçi: Salatalık, Havuç, Avokado | Dışı: Dilim Avokado (Vejetaryen)', sortOrder: 10 },
          ],
        },
      ],
    },
    {
      slug: 'bentolar',
      title: 'BENTOLAR',
      subtitle: 'Kombine Asya Menüleri (Noodle + Ana Yemek + Roll Çeşitleri)',
      icon: 'solar:box-minimalistic-bold',
      badge: 'BEST VALUE',
      sortOrder: 3,
      gridTemplate: '1fr 1fr 1fr',
      groups: [
        {
          title: null,
          sortOrder: 1,
          groupType: 'card-item',
          items: [
            { name: 'BENTO 1', price: '570 ₺', description: 'Tavuklu Noodle, Moğol İşi Tavuk, Sesame California Roll (4 pcs)', sortOrder: 1 },
            { name: 'BENTO 2', price: '620 ₺', description: 'Dana Etli Noodle, Moğol İşi Tavuk, Sesame California Roll (4 pcs)', sortOrder: 2 },
            { name: 'BENTO 3 (VEGGIE)', price: '555 ₺', description: 'Sebzeli Noodle, Haşlanmış Sebze, Veggie Roll (4 pcs)', sortOrder: 3 },
            { name: 'BENTO 4', price: '595 ₺', description: 'General Tavuk, Sebzeli Noodle, Sesame California Roll (4 pcs)', sortOrder: 4 },
            { name: 'BENTO 6', price: '575 ₺', description: 'Moğol İşi Tavuk, Sebzeli Noodle, Sesame California Roll (4 pcs)', sortOrder: 5 },
            { name: 'BENTO 10 (SUSHI MIX)', price: '720 ₺', description: 'Sesame California (4 pcs), Philadelphia (4 pcs), Kappa Maki (4 pcs), Sake Maki (4 pcs), Ön Salata', sortOrder: 6 },
          ],
        },
      ],
    },
    {
      slug: 'noodles-rice',
      title: 'NOODLE & PİRİNÇ',
      subtitle: 'Egg Noodle, Japon Udon, Tayland Pad Thai ve Yakimeshi Pirinçleri',
      icon: 'solar:fire-square-bold',
      badge: 'WOK SIZZLED',
      sortOrder: 4,
      gridTemplate: '1fr 1fr 1fr 1fr',
      groups: [
        {
          title: 'Egg Noodle',
          sortOrder: 1,
          groupType: 'card',
          colStart: 1,
          colSpan: 1,
          titleStyle: 'plain',
          titleRightLabel: 'Yumurtalı Buğday',
          titleBorderBottom: true,
          itemVariant: 'simple',
          itemLayout: 'rows',
          items: [
            { name: 'Sebzeli', price: '440 ₺', sortOrder: 1 },
            { name: 'Tavuklu', price: '470 ₺', sortOrder: 2 },
            { name: 'Dana Etli', price: '555 ₺', sortOrder: 3 },
            { name: 'Karidesli', price: '570 ₺', sortOrder: 4 },
            { name: 'Deniz Mix', price: '575 ₺', sortOrder: 5 },
            { name: 'Katsu Tavuklu', price: '470 ₺', sortOrder: 6 },
          ],
        },
        {
          title: 'Udon Noodle',
          sortOrder: 2,
          groupType: 'card',
          colStart: 2,
          colSpan: 1,
          titleStyle: 'plain',
          titleRightLabel: 'Kalın Japon',
          titleBorderBottom: true,
          itemVariant: 'simple',
          itemLayout: 'rows',
          items: [
            { name: 'Sebzeli', price: '545 ₺', sortOrder: 1 },
            { name: 'Tavuklu', price: '575 ₺', sortOrder: 2 },
            { name: 'Dana Etli', price: '645 ₺', sortOrder: 3 },
            { name: 'Karidesli', price: '615 ₺', sortOrder: 4 },
            { name: 'Deniz Mix Udon', price: '635 ₺', sortOrder: 5 },
          ],
        },
        {
          title: 'Pad Thai',
          sortOrder: 3,
          groupType: 'card',
          colStart: 3,
          colSpan: 1,
          titleStyle: 'plain',
          titleRightLabel: 'Pirinç Eriştesi',
          titleBorderBottom: true,
          itemVariant: 'simple',
          itemLayout: 'rows',
          items: [
            { name: 'Tavuklu Pad Thai', price: '505 ₺', sortOrder: 1 },
            { name: 'Dana Etli Pad Thai', price: '570 ₺', sortOrder: 2 },
            { name: 'Karidesli Pad Thai', price: '565 ₺', sortOrder: 3 },
            { name: 'Deniz Mix Pad Thai', price: '570 ₺', sortOrder: 4 },
          ],
        },
        {
          title: 'Özel Pirinçler',
          sortOrder: 4,
          groupType: 'card',
          colStart: 4,
          colSpan: 1,
          titleStyle: 'plain',
          titleRightLabel: 'Wok Fried',
          titleBorderBottom: true,
          itemVariant: 'simple',
          itemLayout: 'rows',
          items: [
            { name: 'Sade / Sebzeli Rice', price: '265 - 315 ₺', sortOrder: 1 },
            { name: 'Tavuklu Yakimeshi', price: '425 ₺', sortOrder: 2 },
            { name: 'Dana Etli Yakimeshi', price: '520 ₺', sortOrder: 3 },
            { name: 'Tavuklu Bangkok Rice', price: '445 ₺', sortOrder: 4 },
            { name: 'Karidesli Bangkok Rice', price: '545 ₺', sortOrder: 5 },
          ],
        },
      ],
    },
    {
      slug: 'main-kitchen',
      title: 'ANA MUTFAK & BURGERLER',
      subtitle: 'Wok Tavukları, Izgara Etler, Deniz Mahsulleri ve Özel Burgerler',
      icon: 'solar:chef-hat-heart-bold',
      badge: "CHEF'S KITCHEN",
      sortOrder: 5,
      gridTemplate: '1fr 1fr 1fr',
      groups: [
        {
          title: 'Tavuk & Kırmızı Etler',
          sortOrder: 1,
          groupType: 'card',
          colStart: 1,
          colSpan: 1,
          titleStyle: 'plain',
          titleBorderBottom: true,
          itemVariant: 'with-description',
          itemLayout: 'rows',
          items: [
            { name: 'Moğol İşi Tavuk', description: 'Özel Moğol sos, taze soğan', price: '485 ₺', sortOrder: 1 },
            { name: 'General Tavuk', description: 'Tatlı acı zencefil glaze', price: '550 ₺', sortOrder: 2 },
            { name: 'Tatlı Ekşi Soslu Tavuk', description: 'Ananas ve renkli biberler', price: '550 ₺', sortOrder: 3 },
            { name: 'Katsu Tavuk', description: 'Panko kaplı çıtır göğüs', price: '530 ₺', sortOrder: 4 },
            { name: 'Yeşil Biberli Dana Eti', description: 'Wokta sotelenmiş dana bonfile', price: '740 ₺', sortOrder: 5 },
            { name: 'Mantarlı Dana Eti', description: 'Kültür mantarı ve soya glaze', price: '755 ₺', sortOrder: 6 },
          ],
        },
        {
          title: 'Balık & Deniz Ürünleri',
          sortOrder: 2,
          groupType: 'card',
          colStart: 2,
          colSpan: 1,
          titleStyle: 'plain',
          titleBorderBottom: true,
          itemVariant: 'with-description',
          itemLayout: 'rows',
          items: [
            { name: 'Çıtır Balık', description: 'Tempura dil balığı', price: '505 ₺', sortOrder: 1 },
            { name: 'Fish Taco', description: 'Tempura levrek & salsa', price: '460 ₺', sortOrder: 2 },
            { name: 'Kalamar Tava', description: 'Tartar sos ile', price: '580 ₺', sortOrder: 3 },
            { name: 'Fish & Chips', description: 'Klasik pub usulü çıtır balık', price: '670 ₺', sortOrder: 4 },
            { name: 'Izgara Norveç Somon', description: 'Haşlanmış sebzeler ile', price: '750 ₺', sortOrder: 5 },
            { name: 'Izgara Levrek / Çipura', description: 'Taze baharat soslu fileto', price: '740 - 750 ₺', sortOrder: 6 },
          ],
        },
        {
          title: 'Bilkent Burgerler',
          sortOrder: 3,
          groupType: 'card',
          colStart: 3,
          colSpan: 1,
          titleStyle: 'plain',
          titleBorderBottom: true,
          itemVariant: 'with-description',
          itemLayout: 'rows',
          items: [
            { name: 'Peaky Burger', description: 'Domates, Köz Soğan, Füme Kaburga, Peaky Sos', price: '120g: 540₺ | 240g: 730₺', sortOrder: 1 },
            { name: 'Last Penny Burger', description: 'Domates, Iceberg, Köz Soğan, Turşu, Penny Sos', price: '120g: 515₺ | 240g: 705₺', sortOrder: 2 },
            { name: 'Kajun Burger', description: 'Kajun baharatlı çıtır tavuk, domates, iceberg', price: '505 ₺', sortOrder: 3 },
            { name: 'Fish Burger', description: 'Çıtır balık fileto, roka, turşu, tartar sos', price: '525 ₺', sortOrder: 4 },
          ],
        },
      ],
    },
    {
      slug: 'aperatifler',
      title: 'APERATİF, SALATA & ÇORBA',
      subtitle: 'Başlangıç Sepetleri, Edamame, Karides Cipsi ve Taze Salatalar',
      icon: 'solar:slider-vertical-bold',
      badge: 'PAYLAŞMAK İÇİN',
      sortOrder: 6,
      gridTemplate: '1fr 1fr 1fr',
      groups: [
        {
          title: 'Aperatifler',
          sortOrder: 1,
          groupType: 'card',
          colStart: 1,
          colSpan: 1,
          titleStyle: 'plain',
          titleBorderBottom: true,
          itemVariant: 'simple',
          itemLayout: 'rows',
          items: [
            { name: 'Karides Cipsi', price: '230 ₺', sortOrder: 1 },
            { name: 'Edamame (Kaya Tuzlu)', price: '295 ₺', sortOrder: 2 },
            { name: 'Çin Böreği (Spring Rolls)', price: '290 ₺', sortOrder: 3 },
            { name: 'Mısır Tempura', price: '330 ₺', sortOrder: 4 },
            { name: 'Rockn Roll Soslu Karides', price: '695 ₺', sortOrder: 5 },
            { name: 'Aperatif Mix Sepeti', price: '590 ₺', sortOrder: 6 },
            { name: 'Aperatif Balık Sepeti', price: '720 ₺', sortOrder: 7 },
          ],
        },
        {
          title: 'Salatalar',
          sortOrder: 2,
          groupType: 'card',
          colStart: 2,
          colSpan: 1,
          titleStyle: 'plain',
          titleBorderBottom: true,
          itemVariant: 'simple',
          itemLayout: 'rows',
          items: [
            { name: 'Kinoa Akdeniz Salata', price: '390 ₺', sortOrder: 1 },
            { name: 'Mozerella Akdeniz Salata', price: '415 ₺', sortOrder: 2 },
            { name: 'Izgara Tavuklu Salata', price: '435 ₺', sortOrder: 3 },
            { name: 'Bonfile Dilimli Salata', price: '480 ₺', sortOrder: 4 },
            { name: 'Izgara Balıklı Salata', price: '495 ₺', sortOrder: 5 },
            { name: 'Katsu Tavuk Salata', price: '455 ₺', sortOrder: 6 },
          ],
        },
        {
          title: 'Çorbalar',
          sortOrder: 3,
          groupType: 'card',
          colStart: 3,
          colSpan: 1,
          titleStyle: 'plain',
          titleBorderBottom: true,
          itemVariant: 'simple',
          itemLayout: 'rows',
          items: [
            { name: 'Acılı Ekşili Çorba', price: '310 ₺', sortOrder: 1 },
            { name: 'Balık Çorbası', price: '325 ₺', sortOrder: 2 },
            { name: 'Tavuklu Mısır Çorbası', price: '290 ₺', sortOrder: 3 },
            { name: 'Kids York', itemVariant: 'group-title', price: '', sortOrder: 4 },
            { name: '1/2 Balık ve Haşlanmış Sebze', price: '420 ₺', sortOrder: 5 },
            { name: 'Hamyorgel & Patates', price: '455 ₺', sortOrder: 6 },
            { name: 'Pişmiş Sushi & Karides Cipsi', price: '575 ₺', sortOrder: 7 },
          ],
        },
      ],
    },
    {
      slug: 'coffee-soft',
      title: 'KAHVE & TATLILAR',
      subtitle: 'Sıcak/Soğuk Kahveler, Bitki Çayları, Alkolsüz Kokteyller ve Asya Tatlıları',
      icon: 'solar:cup-hot-bold',
      badge: 'SICAK BİR KUCAKLAŞMA',
      sortOrder: 7,
      gridTemplate: '1fr 1fr 1fr 1fr',
      groups: [
        {
          title: 'Sıcak Kahveler',
          sortOrder: 1,
          groupType: 'card',
          colStart: 1,
          colSpan: 1,
          titleStyle: 'plain',
          titleBorderBottom: true,
          itemVariant: 'simple',
          itemLayout: 'rows',
          items: [
            { name: 'Espresso', price: '140 ₺', sortOrder: 1 },
            { name: 'Espresso Macchiato', price: '170 ₺', sortOrder: 2 },
            { name: 'Cappuccino / Latte', price: '205 ₺', sortOrder: 3 },
            { name: 'Flat White', price: '205 ₺', sortOrder: 4 },
            { name: 'White Chocolate Mocha', price: '215 ₺', sortOrder: 5 },
            { name: 'Americano', price: '180 ₺', sortOrder: 6 },
            { name: 'Türk Kahvesi', price: '165 ₺', sortOrder: 7 },
          ],
        },
        {
          title: 'Soğuk Kahveler',
          sortOrder: 2,
          groupType: 'card',
          colStart: 2,
          colSpan: 1,
          titleStyle: 'plain',
          titleBorderBottom: true,
          itemVariant: 'simple',
          itemLayout: 'rows',
          items: [
            { name: 'Ice Americano', price: '175 ₺', sortOrder: 1 },
            { name: 'Ice Latte', price: '205 ₺', sortOrder: 2 },
            { name: 'Ice Mocha', price: '215 ₺', sortOrder: 3 },
            { name: 'Ice Macchiato Vanilya', price: '215 ₺', sortOrder: 4 },
            { name: 'Ice Macchiato Caramel', price: '215 ₺', sortOrder: 5 },
          ],
        },
        {
          title: 'Çaylar (Fincan)',
          sortOrder: 3,
          groupType: 'card',
          colStart: 3,
          colSpan: 1,
          titleStyle: 'plain',
          titleBorderBottom: true,
          itemVariant: 'simple',
          itemLayout: 'rows',
          items: [
            { name: 'Siyah Çay (Bildiğimiz Çay)', price: '80 ₺', sortOrder: 1 },
            { name: 'Papatya / Yeşil Çay', price: '90 ₺', sortOrder: 2 },
            { name: 'Hibiscus (Mayhoş)', price: '90 ₺', sortOrder: 3 },
            { name: 'Yasemin / Rezene', price: '90 ₺', sortOrder: 4 },
            { name: 'Energic Fruits (Yaban Mersini)', price: '90 ₺', sortOrder: 5 },
          ],
        },
        {
          title: 'Tatlılar & Soft',
          sortOrder: 4,
          groupType: 'card',
          colStart: 4,
          colSpan: 1,
          titleStyle: 'plain',
          titleBorderBottom: true,
          itemVariant: 'simple',
          itemLayout: 'rows',
          items: [
            { name: 'Balda Kızarmış Muz', price: '270 ₺', sortOrder: 1 },
            { name: 'Kızarmış Dondurma', price: '295 ₺', sortOrder: 2 },
            { name: 'Mochi (2 Adet Seçmeli)', price: '290 ₺', sortOrder: 3 },
            { name: 'Alkolsüz Ekşi Kokteyl', price: '360 ₺', sortOrder: 4 },
            { name: 'Çilekli Limonata', price: '195 ₺', sortOrder: 5 },
            { name: 'Pepsi / 7Up / Ice Tea', price: '145 ₺', sortOrder: 6 },
          ],
        },
      ],
    },
  ] as const;

  for (const section of sections) {
    const { groups, ...sectionData } = section;
    const created = await prisma.menuSection.create({ data: sectionData as any });
    for (const group of groups) {
      const { items, ...groupData } = group;
      const createdGroup = await prisma.menuGroup.create({
        data: { ...groupData, title: (groupData as any).title ?? null, sectionId: created.id } as any,
      });
      for (const item of items) {
        await prisma.menuItem.create({ data: { ...item, groupId: createdGroup.id } });
      }
    }
    console.log(`  ✓ ${created.title}`);
  }

  // ─── Page content ───────────────────────────────────────────────────────────

  await prisma.menuPageHero.create({
    data: {
      id: 'singleton',
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
    },
  });

  await prisma.menuPageCard.createMany({
    data: [
      {
        slot: 1,
        badgeLabel: 'Sushi Bar',
        title: 'Taze Sushi & Rolls',
        description: 'Uramaki, Maki, Nigiri & Sashimi spesiyalleri',
        imageUrl:
          'https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/ZMi4cF0X5kb/components/AAIvuxGxRFa.jpeg',
      },
      {
        slot: 2,
        badgeLabel: 'Bar & Promo',
        title: 'Fıçı & 5+1 Shotlar',
        description: 'Bud, Efes, Kovalar, Tekila & Jäger paketleri',
        imageUrl:
          'https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/ZMi4cF0X5kb/components/Qryfgpi8vmj.jpeg',
      },
    ],
  });

  await prisma.menuPageCta.create({
    data: {
      id: 'singleton',
      badgeText: 'Aylık Kokteyl Yarışması',
      headingMain: 'Kendi Kokteylini Yarat,',
      headingHighlight: 'Menüye İsmini Yazdır',
      description:
        'Favori içkilerini, taze aromaları ve özel garnitürleri seç. Her ay en çok oyu alan özel reçete Bilkent York resmi menüsüne girsin!',
    },
  });

  const sushiVocab = [
    { term: 'Sake', translation: 'Somon', sortOrder: 1 },
    { term: 'Suzuki', translation: 'Levrek', sortOrder: 2 },
    { term: 'Ebi', translation: 'Karides', sortOrder: 3 },
    { term: 'Kani', translation: 'Yengeç Surimi', sortOrder: 4 },
    { term: 'Unagi', translation: 'Yılan Balığı', sortOrder: 5 },
    { term: 'Tobiko', translation: 'Uçan Balık Yumurtası', sortOrder: 6 },
  ];
  await prisma.sushiVocabEntry.createMany({ data: sushiVocab });
  console.log('  ✓ Page content & sushi vocabulary');

  console.log('Done!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
