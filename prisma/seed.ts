import { PrismaClient, Role, ProductGender } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin User ──
  const adminPassword = await hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@velour.in' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@velour.in',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // ── Test Customer ──
  const customerPassword = await hash('Customer@123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'customer@test.com',
      password: customerPassword,
      role: Role.CUSTOMER,
      phone: '+91-98765-43210',
    },
  });

  // ── Brands ──
  const brands = await Promise.all(
    [
      { name: 'VELOUR', slug: 'velour', description: 'Our house brand — premium, minimal, timeless.' },
      { name: 'Urban Thread', slug: 'urban-thread', description: 'Street-smart everyday essentials.' },
      { name: 'Luxe Lane', slug: 'luxe-lane', description: 'Premium fabrics, elevated basics.' },
      { name: 'Petit Monde', slug: 'petit-monde', description: 'Stylish comfort for kids.' },
      { name: 'Studio Noir', slug: 'studio-noir', description: 'Dark-toned fashion-forward pieces.' },
    ].map((b) =>
      prisma.brand.upsert({ where: { slug: b.slug }, update: {}, create: b })
    )
  );

  // ── Categories ──
  const menCat = await prisma.category.upsert({
    where: { slug: 'men' },
    update: {},
    create: { name: 'Men', slug: 'men', description: 'Men\'s clothing', displayOrder: 1 },
  });
  const womenCat = await prisma.category.upsert({
    where: { slug: 'women' },
    update: {},
    create: { name: 'Women', slug: 'women', description: 'Women\'s clothing', displayOrder: 2 },
  });
  const kidsCat = await prisma.category.upsert({
    where: { slug: 'kids' },
    update: {},
    create: { name: 'Kids', slug: 'kids', description: 'Kids\' clothing', displayOrder: 3 },
  });

  // Sub-categories
  const subCats = await Promise.all(
    [
      { name: 'T-Shirts', slug: 'men-tshirts', parentId: menCat.id, displayOrder: 1 },
      { name: 'Shirts', slug: 'men-shirts', parentId: menCat.id, displayOrder: 2 },
      { name: 'Jeans', slug: 'men-jeans', parentId: menCat.id, displayOrder: 3 },
      { name: 'Jackets', slug: 'men-jackets', parentId: menCat.id, displayOrder: 4 },
      { name: 'Trousers', slug: 'men-trousers', parentId: menCat.id, displayOrder: 5 },
      { name: 'Dresses', slug: 'women-dresses', parentId: womenCat.id, displayOrder: 1 },
      { name: 'Tops', slug: 'women-tops', parentId: womenCat.id, displayOrder: 2 },
      { name: 'Skirts', slug: 'women-skirts', parentId: womenCat.id, displayOrder: 3 },
      { name: 'Jeans', slug: 'women-jeans', parentId: womenCat.id, displayOrder: 4 },
      { name: 'Kurtas', slug: 'women-kurtas', parentId: womenCat.id, displayOrder: 5 },
      { name: 'Boys', slug: 'kids-boys', parentId: kidsCat.id, displayOrder: 1 },
      { name: 'Girls', slug: 'kids-girls', parentId: kidsCat.id, displayOrder: 2 },
    ].map((c) =>
      prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
    )
  );

  // ── Products ──
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Navy', hex: '#1B2A4A' },
    { name: 'Charcoal', hex: '#333333' },
    { name: 'Olive', hex: '#556B2F' },
    { name: 'Burgundy', hex: '#722F37' },
    { name: 'Cream', hex: '#FFFDD0' },
    { name: 'Dusty Rose', hex: '#DCAE96' },
  ];
  const placeholderImage = 'https://placehold.co/800x1000/1A1A1A/C4A882?text=VELOUR';

  interface ProductSeed {
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    categoryId: string;
    brandId: string;
    basePrice: number;
    comparePrice: number | null;
    gender: ProductGender;
    isFeatured: boolean;
    isNewArrival: boolean;
    isBestSeller: boolean;
    tags: string[];
    colorIndices: number[];
  }

  const productDefs: ProductSeed[] = [
    // Men's T-Shirts (6)
    { name: 'Classic Crew Neck Tee', slug: 'classic-crew-neck-tee', description: 'A wardrobe essential crafted from premium 100% cotton. This classic crew neck offers a relaxed fit perfect for everyday wear.', shortDescription: 'Premium cotton crew neck tee', categoryId: subCats[0].id, brandId: brands[0].id, basePrice: 1299, comparePrice: 1799, gender: ProductGender.MEN, isFeatured: true, isNewArrival: false, isBestSeller: true, tags: ['basics', 'cotton', 'everyday'], colorIndices: [0, 1, 2] },
    { name: 'Graphic Print Tee - Urban', slug: 'graphic-print-tee-urban', description: 'Bold graphic prints on soft jersey fabric. Street-ready style with premium comfort.', shortDescription: 'Graphic print street tee', categoryId: subCats[0].id, brandId: brands[1].id, basePrice: 1499, comparePrice: null, gender: ProductGender.MEN, isFeatured: false, isNewArrival: true, isBestSeller: false, tags: ['graphic', 'streetwear', 'casual'], colorIndices: [0, 1, 3] },
    { name: 'Henley Long Sleeve', slug: 'henley-long-sleeve', description: 'A modern take on the henley. Slim fit with waffle-knit texture and button placket detail.', shortDescription: 'Waffle-knit henley', categoryId: subCats[0].id, brandId: brands[0].id, basePrice: 1899, comparePrice: 2499, gender: ProductGender.MEN, isFeatured: false, isNewArrival: false, isBestSeller: true, tags: ['henley', 'long-sleeve', 'casual'], colorIndices: [0, 2, 3] },
    { name: 'Vintage Wash Tee', slug: 'vintage-wash-tee', description: 'Pre-washed for that perfectly lived-in feel. Relaxed shoulder drop with a modern boxy silhouette.', shortDescription: 'Vintage washed boxy tee', categoryId: subCats[0].id, brandId: brands[4].id, basePrice: 1699, comparePrice: null, gender: ProductGender.MEN, isFeatured: false, isNewArrival: true, isBestSeller: false, tags: ['vintage', 'boxy', 'washed'], colorIndices: [0, 3, 4] },
    { name: 'Performance Dry-Fit Tee', slug: 'performance-dry-fit-tee', description: 'Moisture-wicking fabric keeps you cool during workouts. Lightweight with 4-way stretch.', shortDescription: 'Athletic dry-fit tee', categoryId: subCats[0].id, brandId: brands[1].id, basePrice: 1599, comparePrice: 2199, gender: ProductGender.MEN, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: ['athletic', 'performance', 'workout'], colorIndices: [0, 2, 4] },
    { name: 'Polo Knit Classic', slug: 'polo-knit-classic', description: 'Refined polo in fine piqué cotton. Perfect for smart-casual occasions.', shortDescription: 'Classic piqué polo', categoryId: subCats[0].id, brandId: brands[2].id, basePrice: 2299, comparePrice: 2999, gender: ProductGender.MEN, isFeatured: true, isNewArrival: false, isBestSeller: false, tags: ['polo', 'smart-casual', 'pique'], colorIndices: [0, 1, 2, 5] },

    // Men's Shirts (5)
    { name: 'Oxford Button-Down Shirt', slug: 'oxford-button-down-shirt', description: 'The definitive oxford. Woven from Japanese cotton with a modern slightly tapered fit.', shortDescription: 'Japanese cotton oxford', categoryId: subCats[1].id, brandId: brands[0].id, basePrice: 2999, comparePrice: 3999, gender: ProductGender.MEN, isFeatured: true, isNewArrival: false, isBestSeller: true, tags: ['oxford', 'formal', 'japanese-cotton'], colorIndices: [1, 2, 6] },
    { name: 'Linen Camp Collar', slug: 'linen-camp-collar', description: 'Relaxed camp collar shirt in breathable pure linen. Perfect for warm weather.', shortDescription: 'Pure linen camp shirt', categoryId: subCats[1].id, brandId: brands[0].id, basePrice: 2799, comparePrice: null, gender: ProductGender.MEN, isFeatured: false, isNewArrival: true, isBestSeller: false, tags: ['linen', 'summer', 'resort'], colorIndices: [1, 4, 6] },
    { name: 'Flannel Check Shirt', slug: 'flannel-check-shirt', description: 'Brushed flannel in a heritage check pattern. Warm, soft, and perfect for layering.', shortDescription: 'Brushed flannel check', categoryId: subCats[1].id, brandId: brands[1].id, basePrice: 2499, comparePrice: 3299, gender: ProductGender.MEN, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: ['flannel', 'check', 'layering'], colorIndices: [2, 5] },
    { name: 'Slim Fit Formal Shirt', slug: 'slim-fit-formal-shirt', description: 'Crisp poplin shirt with a slim silhouette. Features a hidden button-down collar.', shortDescription: 'Slim formal poplin shirt', categoryId: subCats[1].id, brandId: brands[2].id, basePrice: 3499, comparePrice: null, gender: ProductGender.MEN, isFeatured: false, isNewArrival: false, isBestSeller: true, tags: ['formal', 'slim-fit', 'office'], colorIndices: [1, 2] },
    { name: 'Denim Shirt Jacket', slug: 'denim-shirt-jacket', description: 'Heavyweight denim overshirt that works as a light jacket. Stone-washed finish.', shortDescription: 'Denim overshirt', categoryId: subCats[1].id, brandId: brands[4].id, basePrice: 3999, comparePrice: 4999, gender: ProductGender.MEN, isFeatured: false, isNewArrival: true, isBestSeller: false, tags: ['denim', 'overshirt', 'layering'], colorIndices: [2, 3] },

    // Men's Jeans (4)
    { name: 'Slim Tapered Jeans', slug: 'slim-tapered-jeans', description: 'Modern slim taper in rigid selvedge denim. Japanese fabric, Italian hardware.', shortDescription: 'Selvedge slim tapered', categoryId: subCats[2].id, brandId: brands[0].id, basePrice: 3999, comparePrice: 5499, gender: ProductGender.MEN, isFeatured: true, isNewArrival: false, isBestSeller: true, tags: ['selvedge', 'slim', 'denim'], colorIndices: [0, 2, 3] },
    { name: 'Relaxed Straight Jeans', slug: 'relaxed-straight-jeans', description: 'Easy-going straight leg with a relaxed rise. Vintage wash with natural fading.', shortDescription: 'Relaxed fit straight leg', categoryId: subCats[2].id, brandId: brands[1].id, basePrice: 2999, comparePrice: null, gender: ProductGender.MEN, isFeatured: false, isNewArrival: true, isBestSeller: false, tags: ['relaxed', 'straight', 'vintage-wash'], colorIndices: [2, 3] },
    { name: 'Black Skinny Jeans', slug: 'black-skinny-jeans', description: 'Stretch-denim skinny jeans in jet black. The foundation of any dark wardrobe.', shortDescription: 'Stretch skinny black', categoryId: subCats[2].id, brandId: brands[4].id, basePrice: 3499, comparePrice: 4499, gender: ProductGender.MEN, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: ['skinny', 'stretch', 'black'], colorIndices: [0] },
    { name: 'Carpenter Work Pants', slug: 'carpenter-work-pants', description: 'Utility-inspired carpenter jeans with reinforced stitching and tool loop detail.', shortDescription: 'Carpenter utility jeans', categoryId: subCats[2].id, brandId: brands[1].id, basePrice: 3299, comparePrice: null, gender: ProductGender.MEN, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: ['carpenter', 'utility', 'workwear'], colorIndices: [3, 4] },

    // Men's Jackets (3)
    { name: 'Leather Biker Jacket', slug: 'leather-biker-jacket', description: 'Genuine lambskin leather biker jacket. Asymmetric zip with quilted shoulder detail.', shortDescription: 'Lambskin biker jacket', categoryId: subCats[3].id, brandId: brands[4].id, basePrice: 12999, comparePrice: 16999, gender: ProductGender.MEN, isFeatured: true, isNewArrival: false, isBestSeller: true, tags: ['leather', 'biker', 'premium'], colorIndices: [0] },
    { name: 'Quilted Bomber Jacket', slug: 'quilted-bomber-jacket', description: 'Lightweight quilted bomber with ribbed cuffs and hem. Water-resistant shell.', shortDescription: 'Quilted bomber', categoryId: subCats[3].id, brandId: brands[0].id, basePrice: 5999, comparePrice: 7999, gender: ProductGender.MEN, isFeatured: false, isNewArrival: true, isBestSeller: false, tags: ['bomber', 'quilted', 'water-resistant'], colorIndices: [0, 2, 4] },
    { name: 'Wool Overcoat', slug: 'wool-overcoat', description: 'Double-breasted wool-blend overcoat. Long line silhouette for a distinguished look.', shortDescription: 'Wool-blend overcoat', categoryId: subCats[3].id, brandId: brands[2].id, basePrice: 9999, comparePrice: null, gender: ProductGender.MEN, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: ['overcoat', 'wool', 'formal'], colorIndices: [0, 3, 6] },

    // Women's Dresses (6)
    { name: 'Silk Wrap Dress', slug: 'silk-wrap-dress', description: 'Elegant wrap dress in flowing silk. Adjustable tie waist creates a flattering silhouette.', shortDescription: 'Flowing silk wrap dress', categoryId: subCats[5].id, brandId: brands[2].id, basePrice: 6999, comparePrice: 8999, gender: ProductGender.WOMEN, isFeatured: true, isNewArrival: false, isBestSeller: true, tags: ['silk', 'wrap', 'elegant'], colorIndices: [0, 5, 7] },
    { name: 'Cotton Midi Dress', slug: 'cotton-midi-dress', description: 'Effortless midi dress in organic cotton. Puffed sleeves with a cinched waist.', shortDescription: 'Organic cotton midi', categoryId: subCats[5].id, brandId: brands[0].id, basePrice: 3999, comparePrice: null, gender: ProductGender.WOMEN, isFeatured: false, isNewArrival: true, isBestSeller: false, tags: ['cotton', 'midi', 'organic'], colorIndices: [1, 6, 7] },
    { name: 'Little Black Dress', slug: 'little-black-dress', description: 'The ultimate LBD. Structured bodice with a subtle A-line skirt. Timeless.', shortDescription: 'Classic little black dress', categoryId: subCats[5].id, brandId: brands[4].id, basePrice: 4999, comparePrice: 6499, gender: ProductGender.WOMEN, isFeatured: true, isNewArrival: false, isBestSeller: true, tags: ['lbd', 'classic', 'evening'], colorIndices: [0] },
    { name: 'Floral Maxi Dress', slug: 'floral-maxi-dress', description: 'Floor-length maxi in botanical print. V-neck with a smocked waist and tiered skirt.', shortDescription: 'Botanical print maxi', categoryId: subCats[5].id, brandId: brands[0].id, basePrice: 4499, comparePrice: null, gender: ProductGender.WOMEN, isFeatured: false, isNewArrival: true, isBestSeller: false, tags: ['floral', 'maxi', 'summer'], colorIndices: [6, 7] },
    { name: 'Bodycon Knit Dress', slug: 'bodycon-knit-dress', description: 'Ribbed knit bodycon that hugs in all the right places. Perfect for date night.', shortDescription: 'Ribbed bodycon dress', categoryId: subCats[5].id, brandId: brands[4].id, basePrice: 3499, comparePrice: 4999, gender: ProductGender.WOMEN, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: ['bodycon', 'knit', 'evening'], colorIndices: [0, 5] },
    { name: 'Shirt Dress Utility', slug: 'shirt-dress-utility', description: 'Oversized shirt dress with utility pockets. Belt included for waist definition.', shortDescription: 'Utility shirt dress', categoryId: subCats[5].id, brandId: brands[1].id, basePrice: 3299, comparePrice: null, gender: ProductGender.WOMEN, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: ['utility', 'shirt-dress', 'casual'], colorIndices: [3, 4, 6] },

    // Women's Tops (5)
    { name: 'Cashmere V-Neck Sweater', slug: 'cashmere-vneck-sweater', description: 'Luxuriously soft cashmere sweater with a relaxed V-neck. Lightweight and warm.', shortDescription: 'Pure cashmere V-neck', categoryId: subCats[6].id, brandId: brands[2].id, basePrice: 7999, comparePrice: 9999, gender: ProductGender.WOMEN, isFeatured: true, isNewArrival: false, isBestSeller: true, tags: ['cashmere', 'sweater', 'luxury'], colorIndices: [0, 6, 7] },
    { name: 'Satin Camisole', slug: 'satin-camisole', description: 'Delicate satin cami with lace trim. Layered or standalone, always chic.', shortDescription: 'Lace-trim satin cami', categoryId: subCats[6].id, brandId: brands[0].id, basePrice: 1999, comparePrice: null, gender: ProductGender.WOMEN, isFeatured: false, isNewArrival: true, isBestSeller: false, tags: ['satin', 'camisole', 'layering'], colorIndices: [0, 1, 5, 7] },
    { name: 'Oversized Blazer', slug: 'oversized-blazer-women', description: 'Power dressing meets relaxed tailoring. Slightly oversized single-button blazer.', shortDescription: 'Relaxed oversized blazer', categoryId: subCats[6].id, brandId: brands[4].id, basePrice: 5999, comparePrice: 7499, gender: ProductGender.WOMEN, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: ['blazer', 'oversized', 'power'], colorIndices: [0, 3, 6] },
    { name: 'Crop Top Ribbed', slug: 'crop-top-ribbed', description: 'Fitted ribbed crop top in stretch cotton. Pairs perfectly with high-waisted everything.', shortDescription: 'Ribbed cotton crop top', categoryId: subCats[6].id, brandId: brands[1].id, basePrice: 1299, comparePrice: 1799, gender: ProductGender.WOMEN, isFeatured: false, isNewArrival: true, isBestSeller: false, tags: ['crop', 'ribbed', 'stretch'], colorIndices: [0, 1, 5, 7] },
    { name: 'Peplum Blouse', slug: 'peplum-blouse', description: 'Structured peplum blouse with a sweetheart neckline. From boardroom to brunch.', shortDescription: 'Sweetheart peplum blouse', categoryId: subCats[6].id, brandId: brands[0].id, basePrice: 2499, comparePrice: null, gender: ProductGender.WOMEN, isFeatured: false, isNewArrival: false, isBestSeller: true, tags: ['peplum', 'blouse', 'office'], colorIndices: [0, 1, 5] },

    // Women's Jeans (3)
    { name: 'High-Rise Straight Jeans', slug: 'high-rise-straight-jeans-women', description: 'Flattering high-rise straight leg in premium stretch denim. Vintage-inspired.', shortDescription: 'High-rise straight leg', categoryId: subCats[8].id, brandId: brands[0].id, basePrice: 3999, comparePrice: 4999, gender: ProductGender.WOMEN, isFeatured: true, isNewArrival: false, isBestSeller: true, tags: ['high-rise', 'straight', 'premium'], colorIndices: [0, 2, 3] },
    { name: 'Mom Jeans Relaxed', slug: 'mom-jeans-relaxed', description: 'The perfect mom jean. High waist, relaxed through the hip and thigh.', shortDescription: 'Relaxed mom jeans', categoryId: subCats[8].id, brandId: brands[1].id, basePrice: 2999, comparePrice: null, gender: ProductGender.WOMEN, isFeatured: false, isNewArrival: true, isBestSeller: false, tags: ['mom-jeans', 'relaxed', 'high-waist'], colorIndices: [2, 3] },
    { name: 'Wide Leg Palazzo Jeans', slug: 'wide-leg-palazzo-jeans', description: 'Dramatic wide-leg palazzo jeans in dark indigo wash. Statement denim.', shortDescription: 'Wide leg palazzo jeans', categoryId: subCats[8].id, brandId: brands[4].id, basePrice: 3499, comparePrice: 4499, gender: ProductGender.WOMEN, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: ['wide-leg', 'palazzo', 'statement'], colorIndices: [2] },

    // Women's Kurtas (3)
    { name: 'Chanderi Silk Kurta', slug: 'chanderi-silk-kurta', description: 'Handwoven Chanderi silk kurta with intricate zari border. Festive elegance.', shortDescription: 'Handwoven Chanderi kurta', categoryId: subCats[9].id, brandId: brands[2].id, basePrice: 5999, comparePrice: 7999, gender: ProductGender.WOMEN, isFeatured: true, isNewArrival: true, isBestSeller: false, tags: ['chanderi', 'silk', 'festive'], colorIndices: [5, 6, 7] },
    { name: 'Cotton Printed Kurta', slug: 'cotton-printed-kurta', description: 'Block-printed cotton kurta in Jaipur heritage prints. Comfortable and stylish.', shortDescription: 'Block-print cotton kurta', categoryId: subCats[9].id, brandId: brands[0].id, basePrice: 2499, comparePrice: 3299, gender: ProductGender.WOMEN, isFeatured: false, isNewArrival: false, isBestSeller: true, tags: ['block-print', 'cotton', 'ethnic'], colorIndices: [2, 5, 6] },
    { name: 'Anarkali Kurta Set', slug: 'anarkali-kurta-set', description: 'Flowing anarkali kurta with matching dupatta. Perfect for festive occasions.', shortDescription: 'Anarkali with dupatta set', categoryId: subCats[9].id, brandId: brands[2].id, basePrice: 7999, comparePrice: null, gender: ProductGender.WOMEN, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: ['anarkali', 'set', 'festive'], colorIndices: [5, 6] },

    // Kids (6)
    { name: 'Kids Graphic Tee Set', slug: 'kids-graphic-tee-set', description: 'Fun graphic tee and shorts set for active kids. Soft jersey fabric.', shortDescription: 'Graphic tee + shorts set', categoryId: subCats[10].id, brandId: brands[3].id, basePrice: 1499, comparePrice: 1999, gender: ProductGender.KIDS, isFeatured: false, isNewArrival: true, isBestSeller: true, tags: ['set', 'graphic', 'comfortable'], colorIndices: [0, 1, 2] },
    { name: 'Kids Denim Dungaree', slug: 'kids-denim-dungaree', description: 'Classic denim dungaree with adjustable straps. Durable and adorable.', shortDescription: 'Denim dungarees', categoryId: subCats[10].id, brandId: brands[3].id, basePrice: 1999, comparePrice: null, gender: ProductGender.KIDS, isFeatured: true, isNewArrival: false, isBestSeller: false, tags: ['dungaree', 'denim', 'classic'], colorIndices: [2] },
    { name: 'Kids Puffer Jacket', slug: 'kids-puffer-jacket', description: 'Lightweight puffer jacket for chilly days. Water-resistant with fleece lining.', shortDescription: 'Water-resistant puffer', categoryId: subCats[10].id, brandId: brands[3].id, basePrice: 2999, comparePrice: 3999, gender: ProductGender.KIDS, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: ['puffer', 'winter', 'water-resistant'], colorIndices: [0, 2, 4] },
    { name: 'Girls Floral Dress', slug: 'girls-floral-dress', description: 'Sweet floral dress with a full skirt and peter pan collar. Made from soft cotton.', shortDescription: 'Cotton floral dress', categoryId: subCats[11].id, brandId: brands[3].id, basePrice: 1799, comparePrice: 2499, gender: ProductGender.KIDS, isFeatured: false, isNewArrival: true, isBestSeller: true, tags: ['floral', 'dress', 'cotton'], colorIndices: [5, 6, 7] },
    { name: 'Girls Legging Set', slug: 'girls-legging-set', description: 'Comfy legging and tunic set with playful prints. Stretch cotton for all-day wear.', shortDescription: 'Legging + tunic set', categoryId: subCats[11].id, brandId: brands[3].id, basePrice: 1299, comparePrice: null, gender: ProductGender.KIDS, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: ['legging', 'set', 'play'], colorIndices: [5, 7] },
    { name: 'Kids Hoodie Classic', slug: 'kids-hoodie-classic', description: 'Cozy fleece-lined hoodie with kangaroo pocket. A playground staple.', shortDescription: 'Fleece hoodie', categoryId: subCats[10].id, brandId: brands[3].id, basePrice: 1999, comparePrice: 2799, gender: ProductGender.KIDS, isFeatured: false, isNewArrival: false, isBestSeller: false, tags: ['hoodie', 'fleece', 'warm'], colorIndices: [0, 2, 3] },
  ];

  let prodIdx = 0;
  const createdProducts = [];

  for (const def of productDefs) {
    prodIdx++;
    const skuPrefix = def.slug.substring(0, 8).toUpperCase().replace(/-/g, '');
    const product = await prisma.product.upsert({
      where: { slug: def.slug },
      update: {},
      create: {
        name: def.name,
        slug: def.slug,
        description: def.description,
        shortDescription: def.shortDescription,
        categoryId: def.categoryId,
        brandId: def.brandId,
        basePrice: def.basePrice,
        comparePrice: def.comparePrice,
        gender: def.gender,
        isFeatured: def.isFeatured,
        isNewArrival: def.isNewArrival,
        isBestSeller: def.isBestSeller,
        tags: def.tags,
        sku: `VLR-${String(prodIdx).padStart(4, '0')}`,
        isActive: true,
        seoTitle: `${def.name} | VELOUR`,
        seoDescription: def.shortDescription,
        images: {
          create: [
            { url: placeholderImage, altText: def.name, isPrimary: true, order: 0 },
            { url: placeholderImage, altText: `${def.name} - 2`, isPrimary: false, order: 1 },
            { url: placeholderImage, altText: `${def.name} - 3`, isPrimary: false, order: 2 },
          ],
        },
        variants: {
          create: def.colorIndices.flatMap((ci, colorIdx) =>
            sizes.slice(1, 5).map((size, sizeIdx) => ({
              size,
              color: colors[ci].name,
              colorHex: colors[ci].hex,
              stock: Math.floor(Math.random() * 30) + 5,
              additionalPrice: 0,
              sku: `${skuPrefix}-${colorIdx}${sizeIdx}`,
            }))
          ),
        },
      },
    });
    createdProducts.push(product);
  }

  console.log(`✅ Created ${createdProducts.length} products`);

  // ── Coupons ──
  await Promise.all([
    prisma.coupon.upsert({
      where: { code: 'WELCOME10' },
      update: {},
      create: {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minOrderValue: 999,
        maxDiscount: 500,
        usageLimit: 1000,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        firstOrderOnly: true,
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'FLAT500' },
      update: {},
      create: {
        code: 'FLAT500',
        type: 'fixed',
        value: 500,
        minOrderValue: 2999,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'SUMMER20' },
      update: {},
      create: {
        code: 'SUMMER20',
        type: 'percentage',
        value: 20,
        minOrderValue: 1999,
        maxDiscount: 1500,
        usageLimit: 500,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);
  console.log('✅ Created coupons');

  // ── Banners ──
  await Promise.all([
    prisma.banner.create({
      data: {
        title: 'Summer Collection 2025',
        subtitle: 'Up to 40% off on new arrivals',
        image: 'https://placehold.co/1920x700/1A1A1A/C4A882?text=Summer+Collection',
        mobileImage: 'https://placehold.co/800x600/1A1A1A/C4A882?text=Summer+Collection',
        link: '/products?tag=summer',
        position: 'hero',
        order: 0,
        isActive: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Premium Denim',
        subtitle: 'Crafted from the finest selvedge',
        image: 'https://placehold.co/1920x700/333333/FFFFFF?text=Premium+Denim',
        link: '/category/men-jeans',
        position: 'hero',
        order: 1,
        isActive: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Free Shipping',
        subtitle: 'On orders above ₹1,999',
        image: 'https://placehold.co/600x300/C4A882/1A1A1A?text=Free+Shipping',
        link: '/products',
        position: 'promo',
        order: 0,
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Created banners');

  // ── Reviews ──
  const reviewTexts = [
    { title: 'Love the quality!', body: 'Amazing fabric quality and the fit is perfect. Definitely ordering more!', rating: 5 },
    { title: 'Great value', body: 'For the price, this is incredibly well-made. The stitching is impeccable.', rating: 4 },
    { title: 'Exceeded expectations', body: 'The color is exactly as shown. Comfortable to wear all day long.', rating: 5 },
    { title: 'Solid purchase', body: 'Good quality, true to size. Delivery was quick too.', rating: 4 },
    { title: 'Will buy again', body: 'The material feels premium. Washed it twice and it still looks brand new.', rating: 5 },
    { title: 'Decent product', body: 'Good for the price. Fabric could be slightly thicker but overall happy.', rating: 3 },
  ];

  for (let i = 0; i < Math.min(12, createdProducts.length); i++) {
    const review = reviewTexts[i % reviewTexts.length];
    await prisma.review.create({
      data: {
        productId: createdProducts[i].id,
        userId: customer.id,
        rating: review.rating,
        title: review.title,
        body: review.body,
        isVerified: true,
        isApproved: true,
      },
    });
  }
  console.log('✅ Created reviews');

  // ── Blog Posts ──
  await Promise.all([
    prisma.blogPost.upsert({
      where: { slug: 'building-a-capsule-wardrobe' },
      update: {},
      create: {
        title: 'Building a Capsule Wardrobe: The Complete Guide',
        slug: 'building-a-capsule-wardrobe',
        excerpt: 'Learn how to build a versatile wardrobe with just 30 pieces that work for every occasion.',
        content: 'A capsule wardrobe is a collection of essential, timeless clothing that can be mixed and matched to create a variety of outfits. The concept was popularized by Susie Faux in the 1970s and has become a cornerstone of sustainable fashion...',
        coverImage: 'https://placehold.co/1200x600/1A1A1A/C4A882?text=Capsule+Wardrobe',
        author: 'VELOUR Editorial',
        tags: ['fashion', 'capsule-wardrobe', 'sustainable', 'guide'],
        category: 'Style Guide',
        isPublished: true,
        publishedAt: new Date(),
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: 'summer-trends-2025' },
      update: {},
      create: {
        title: 'Summer 2025 Trends You Need to Know',
        slug: 'summer-trends-2025',
        excerpt: 'From earth tones to oversized silhouettes, these are the trends defining this summer.',
        content: 'This season is all about embracing natural textures, earthy palettes, and relaxed fits. Think linen camp shirts, wide-leg trousers, and layered accessories that tell a story...',
        coverImage: 'https://placehold.co/1200x600/C4A882/1A1A1A?text=Summer+Trends',
        author: 'VELOUR Editorial',
        tags: ['trends', 'summer', '2025', 'fashion'],
        category: 'Trends',
        isPublished: true,
        publishedAt: new Date(),
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: 'behind-the-stitch' },
      update: {},
      create: {
        title: 'Behind the Stitch: How We Source Our Fabrics',
        slug: 'behind-the-stitch',
        excerpt: 'A look inside our fabric sourcing process — from Indian mills to Japanese selvedge houses.',
        content: 'Quality begins with the raw material. At VELOUR, we partner directly with fabric mills across India, Japan, and Italy to source the finest materials for our collections...',
        coverImage: 'https://placehold.co/1200x600/333333/FFFFFF?text=Behind+The+Stitch',
        author: 'VELOUR Editorial',
        tags: ['behind-the-scenes', 'fabric', 'quality', 'sourcing'],
        category: 'Behind the Scenes',
        isPublished: true,
        publishedAt: new Date(),
      },
    }),
  ]);
  console.log('✅ Created blog posts');

  // ── Size Guides ──
  await Promise.all([
    prisma.sizeGuide.upsert({
      where: { category: 'tops' },
      update: {},
      create: {
        category: 'tops',
        tableData: {
          headers: ['Size', 'Chest (in)', 'Length (in)', 'Shoulder (in)'],
          rows: [
            ['XS', '34-36', '26', '15'],
            ['S', '36-38', '27', '16'],
            ['M', '38-40', '28', '17'],
            ['L', '40-42', '29', '17.5'],
            ['XL', '42-44', '30', '18'],
            ['XXL', '44-46', '31', '18.5'],
          ],
        },
        tips: 'Measure your chest at the widest point. If between sizes, we recommend sizing up for a relaxed fit.',
      },
    }),
    prisma.sizeGuide.upsert({
      where: { category: 'bottoms' },
      update: {},
      create: {
        category: 'bottoms',
        tableData: {
          headers: ['Size', 'Waist (in)', 'Hip (in)', 'Inseam (in)'],
          rows: [
            ['28', '28', '34', '30'],
            ['30', '30', '36', '31'],
            ['32', '32', '38', '32'],
            ['34', '34', '40', '32'],
            ['36', '36', '42', '32'],
            ['38', '38', '44', '33'],
          ],
        },
        tips: 'Measure your natural waist where the belt sits. Our jeans use a mid-rise cut unless otherwise noted.',
      },
    }),
  ]);
  console.log('✅ Created size guides');

  // ── Customer Address ──
  await prisma.address.upsert({
    where: { id: 'seed-address-1' },
    update: {},
    create: {
      id: 'seed-address-1',
      userId: customer.id,
      label: 'Home',
      fullName: 'John Doe',
      phone: '+91-98765-43210',
      line1: '42, Park Avenue',
      line2: 'Near Central Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      isDefault: true,
    },
  });
  console.log('✅ Created customer address');

  console.log('\n🎉 Seeding complete!');
  console.log('───────────────────────');
  console.log('Admin:    admin@velour.in / Admin@123');
  console.log('Customer: customer@test.com / Customer@123');
  console.log('───────────────────────');
  void admin;
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
