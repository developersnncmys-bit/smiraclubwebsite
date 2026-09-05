import {
  BedDouble, Building2, Palmtree, Home, Landmark, Plane, Users, Tent, LifeBuoy,
  UtensilsCrossed, Gamepad2, Sparkles, Waves, Mountain, Clapperboard, HeartPulse,
  Heart, Search, CircleUser, MoreHorizontal, MapPin, Bell, ChevronDown, ChevronRight,
  ChevronLeft, Calendar, User, Play, ArrowRight, Crown, X, Menu, Check, Star, Phone,
} from 'lucide-react';

const ICONS = {
  BedDouble, Building2, Palmtree, Home, Landmark, Plane, Users, Tent, LifeBuoy,
  UtensilsCrossed, Gamepad2, Sparkles, Waves, Mountain, Clapperboard, HeartPulse,
  Heart, Search, CircleUser, MoreHorizontal, MapPin, Bell, ChevronDown, ChevronRight,
  ChevronLeft, Calendar, User, Play, ArrowRight, Crown, X, Menu, Check, Star, Phone,
};

/** One lookup, so content files can name an icon as a string. */
export default function Icon({ name, ...props }) {
  const Glyph = ICONS[name] || Sparkles;
  return <Glyph {...props} />;
}
