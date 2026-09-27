// RULE-14-EXCEPTION: Static taxonomy
import { CategoryDef } from '../types';

export const categories: CategoryDef[] = [
  { slug: 'motors', nameEn: 'Motors', nameAr: 'سيارات ومركبات', asset: '/assets/icons/motors.jpg' },
  { slug: 'real-estate', nameEn: 'Real Estate', nameAr: 'عقارات', asset: '/assets/icons/real-estate.jpg' },
  { slug: 'mobiles', nameEn: 'Mobiles & Tablets', nameAr: 'موبايلات وتابلت', asset: '/assets/icons/mobiles.jpg' },
  { slug: 'watches', nameEn: 'Watches', nameAr: 'ساعات وإكسسوار', asset: '/assets/icons/watches.jpg' },
  { slug: 'computers', nameEn: 'Computers', nameAr: 'كمبيوتر وشاشات', asset: '/assets/icons/computers.jpg' },
  { slug: 'electronics', nameEn: 'Electronics', nameAr: 'أجهزة وإلكترونيات', asset: '/assets/icons/electronics.jpg' },
  { slug: 'furniture', nameEn: 'Furniture', nameAr: 'أثاث وديكور', asset: '/assets/icons/furniture.jpg' },
  { slug: 'fashion', nameEn: 'Fashion', nameAr: 'أزياء وملابس', asset: '/assets/icons/fashion.jpg' },
  { slug: 'services', nameEn: 'Services', nameAr: 'خدمات', asset: '/assets/icons/services.jpg' },
  { slug: 'jobs', nameEn: 'Jobs', nameAr: 'وظائف', asset: '/assets/icons/jobs.jpg' },
  { slug: 'kids', nameEn: 'Baby & Kids', nameAr: 'أطفال وألعاب', asset: '/assets/icons/kids.jpg' },
  { slug: 'beauty', nameEn: 'Beauty & Personal', nameAr: 'عناية وجمال', asset: '/assets/icons/beauty.jpg' },
  { slug: 'pets', nameEn: 'Pets', nameAr: 'حيوانات', asset: '/assets/icons/pets.jpg' },
  { slug: 'sports', nameEn: 'Sports & Outdoors', nameAr: 'رياضة وتخييم', asset: '/assets/icons/sports.jpg' },
  { slug: 'books', nameEn: 'Books & Hobbies', nameAr: 'كتب وهوايات', asset: '/assets/icons/books.jpg' },
  { slug: 'home-garden', nameEn: 'Home & Garden', nameAr: 'حديقة ومنزل', asset: '/assets/icons/home-garden.jpg' },
  { slug: 'krakeeb', nameEn: 'Miscellaneous', nameAr: 'أغراض متفرقة', asset: '/assets/icons/krakeeb.jpg' },
  { slug: 'cleaning', nameEn: 'Cleaning', nameAr: 'تنظيف', asset: '/assets/icons/cleaning.jpg' },
  { slug: 'handymen', nameEn: 'Handymen', nameAr: 'صنايعي', asset: '/assets/icons/handymen.jpg' },
  { slug: 'projects', nameEn: 'Projects & Business', nameAr: 'مشاريع للبيع أو للشراكة', asset: '/assets/icons/projects.jpg' },
];

export function categoryBySlug(slug: string): CategoryDef {
  return categories.find((c) => c.slug === slug) || categories[0];
}
