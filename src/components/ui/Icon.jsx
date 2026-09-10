import {
  BedDouble, Building2, Palmtree, Home, Landmark, Plane, Users, Tent, LifeBuoy,
  UtensilsCrossed, Gamepad2, Sparkles, Waves, Mountain, Clapperboard, HeartPulse,
  Heart, Search, CircleUser, MoreHorizontal, MapPin, Bell, ChevronDown, ChevronRight,
  ChevronLeft, Calendar, User, Play, ArrowRight, Crown, X, Menu, Check, Star, Phone,
  Pencil, Briefcase, Ticket, PlaneTakeoff, Wallet, Gift, CreditCard, Headset,
  Settings, Languages, FileText, ScrollText, HandCoins, FileX2, Trash2, Info, LogOut,
  BookOpen, CircleHelp,
  Wifi, Martini, Percent, Tag, Coffee, Utensils, MoreVertical,
} from 'lucide-react';

const ICONS = {
  BedDouble, Building2, Palmtree, Home, Landmark, Plane, Users, Tent, LifeBuoy,
  UtensilsCrossed, Gamepad2, Sparkles, Waves, Mountain, Clapperboard, HeartPulse,
  Heart, Search, CircleUser, MoreHorizontal, MapPin, Bell, ChevronDown, ChevronRight,
  ChevronLeft, Calendar, User, Play, ArrowRight, Crown, X, Menu, Check, Star, Phone,
  Pencil, Briefcase, Ticket, PlaneTakeoff, Wallet, Gift, CreditCard, Headset,
  Settings, Languages, FileText, ScrollText, HandCoins, FileX2, Trash2, Info, LogOut,
  BookOpen, CircleHelp,
  Wifi, Martini, Percent, Tag, Coffee, Utensils, MoreVertical,
};

/** One lookup, so content files can name an icon as a string. */
export default function Icon({ name, ...props }) {
  const Glyph = ICONS[name] || Sparkles;
  return <Glyph {...props} />;
}
