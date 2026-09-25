export interface CategoryVisual {
  slug: string;
  image: string;
  gradient?: string;
  icon?: string;
  iconColor?: string;
}

export const CATEGORY_VISUALS: CategoryVisual[] = [
  { slug: 'motors', image: '/assets/categories/motors.jpg', gradient: 'from-blue-500 to-blue-700' },
  { slug: 'real-estate', image: '/assets/categories/real-estate.jpg', gradient: 'from-emerald-500 to-emerald-700' },
  { slug: 'mobiles', image: '/assets/categories/mobiles.jpg', gradient: 'from-purple-500 to-purple-700' },
  { slug: 'watches', image: '/assets/categories/watches.jpg', gradient: 'from-amber-500 to-amber-700' },
  { slug: 'computers', image: '/assets/categories/computers.jpg', gradient: 'from-cyan-500 to-cyan-700' },
  { slug: 'electronics', image: '/assets/categories/electronics.jpg', gradient: 'from-indigo-500 to-indigo-700' },
  { slug: 'furniture', image: '/assets/categories/furniture.jpg', gradient: 'from-orange-500 to-orange-700' },
  { slug: 'fashion', image: '/assets/categories/fashion.jpg', gradient: 'from-pink-500 to-pink-700' },
  { slug: 'services', image: '/assets/categories/services.jpg', gradient: 'from-teal-500 to-teal-700' },
  { slug: 'jobs', image: '/assets/categories/jobs.jpg', gradient: 'from-sky-500 to-sky-700' },
  { slug: 'kids', image: '/assets/categories/kids.jpg', gradient: 'from-yellow-500 to-yellow-700' },
  { slug: 'beauty', image: '/assets/categories/beauty.jpg', gradient: 'from-rose-500 to-rose-700' },
  { slug: 'pets', image: '/assets/categories/pets.jpg', gradient: 'from-lime-500 to-lime-700' },
  { slug: 'sports', image: '/assets/categories/sports.jpg', gradient: 'from-green-500 to-green-700' },
  { slug: 'books', image: '/assets/categories/books.jpg', gradient: 'from-violet-500 to-violet-700' },
  { slug: 'home-garden', image: '/assets/categories/home-garden.jpg', gradient: 'from-emerald-500 to-teal-700' },
  { slug: 'krakeeb', image: '/assets/categories/krakeeb.jpg', gradient: 'from-slate-500 to-slate-700' },
];

export function getCategoryVisual(slug: string): CategoryVisual | undefined {
  return CATEGORY_VISUALS.find((c) => c.slug === slug);
}
