import {
  Home,
  Grid1,
  Message,
  Tag,
  SearchNormal1,
  ArrowRight,
  Share,
  Heart,
  Setting4,
  Location,
  Camera,
  User,
  Setting2,
  Notification,
  ShieldTick,
  Magicpen,
} from 'iconsax-react';
import type { Icon } from 'iconsax-react';

export const NAV_ICONS: Record<string, Icon> = {
  explore: Home,
  categories: Grid1,
  messages: Message,
  'my-ads': Tag,
};

export const UI_ICONS = {
  search: SearchNormal1,
  back: ArrowRight, // RTL-aware
  share: Share,
  favorite: Heart,
  filter: Setting4,
  location: Location,
  camera: Camera,
  user: User,
  settings: Setting2,
  notifications: Notification,
  shield: ShieldTick,
  sparkles: Magicpen,
} as const;

