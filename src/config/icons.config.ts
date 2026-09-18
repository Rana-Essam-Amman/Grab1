import {
  Home,
  LayoutGrid,
  MessageCircle,
  Tag,
  Search,
  ArrowRight,
  Share2,
  Heart,
  SlidersHorizontal,
  MapPin,
  Camera,
  User,
  Settings,
  Bell,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const NAV_ICONS: Record<string, LucideIcon> = {
  explore: Home,
  categories: LayoutGrid,
  messages: MessageCircle,
  'my-ads': Tag,
};

export const UI_ICONS = {
  search: Search,
  back: ArrowRight, // RTL-aware
  share: Share2,
  favorite: Heart,
  filter: SlidersHorizontal,
  location: MapPin,
  camera: Camera,
  user: User,
  settings: Settings,
  notifications: Bell,
  shield: ShieldCheck,
  sparkles: Sparkles,
} as const;

