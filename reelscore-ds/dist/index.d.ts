import type * as React from 'react';

export type IconName = 'star' | 'heart' | 'eye' | 'play' | 'plus' | 'search' | 'bell' | 'chevronLeft' | 'chevronRight' | 'home' | 'film' | 'tv' | 'list' | 'check' | 'user';

export interface IconProps { name: IconName; size?: number; title?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  fullWidth?: boolean;
  href?: string;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  /** Accessible name and tooltip. Required. */
  label: string;
  variant?: 'ghost' | 'filled' | 'outline' | 'scrim';
  size?: 'sm' | 'md' | 'lg';
  /** Makes it a toggle (aria-pressed). */
  pressed?: boolean;
  /** Shows an unread dot. */
  badge?: boolean;
}
export declare function IconButton(props: IconButtonProps): React.ReactElement;

export interface NavLink { label: string; href?: string; active?: boolean }
export interface NavBarProps {
  links?: NavLink[];
  brand?: string;
  homeHref?: string;
  avatarSrc?: string;
  initials?: string;
  avatarLabel?: string;
  notifications?: number;
  sticky?: boolean;
  onSearch?: () => void;
  onNotifications?: () => void;
  onAccount?: () => void;
  className?: string;
}
export declare function NavBar(props: NavBarProps): React.ReactElement;

export interface BottomNavItem { label: string; icon?: IconName; href?: string; active?: boolean }
export interface BottomNavProps { items?: BottomNavItem[]; label?: string; fixed?: boolean; hideOnDesktop?: boolean; className?: string }
export declare function BottomNav(props: BottomNavProps): React.ReactElement;

export interface TabItem { id: string; label: string; panelId?: string }
export interface TabsProps { items: TabItem[]; value?: string; defaultValue?: string; onChange?: (id: string) => void; label?: string; overlay?: boolean; className?: string }
export declare function Tabs(props: TabsProps): React.ReactElement;

export interface GenreChipsProps { genres: string[]; selected?: string[]; defaultSelected?: string[]; onChange?: (selected: string[]) => void; label?: string; className?: string }
export declare function GenreChips(props: GenreChipsProps): React.ReactElement;

export interface AgeBadgeProps { rating: string; className?: string }
export declare function AgeBadge(props: AgeBadgeProps): React.ReactElement;

export interface RatingBadgeProps { value: number; max?: number; votes?: string; tone?: 'gold' | 'brand'; size?: 'sm' | 'md'; className?: string }
export declare function RatingBadge(props: RatingBadgeProps): React.ReactElement;

export interface RatingInputProps {
  /** Whole points 1–10; each star is two points. */
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}
export declare function RatingInput(props: RatingInputProps): React.ReactElement;

export interface MovieCardProps {
  title: string;
  poster?: string;
  href?: string;
  year?: string | number;
  kind?: string;
  rating?: number;
  liked?: boolean;
  onLike?: () => void;
  watched?: boolean;
  onWatched?: () => void;
  tone?: 'night' | 'red' | 'gold' | 'slate';
  className?: string;
}
export declare function MovieCard(props: MovieCardProps): React.ReactElement;

export interface PosterRowProps { title?: string; seeAllHref?: string; label?: string; children?: React.ReactNode; className?: string }
export declare function PosterRow(props: PosterRowProps): React.ReactElement;

export interface HeroProps {
  title: string;
  image?: string;
  ageRating?: string;
  rating?: number;
  year?: string | number;
  length?: string;
  synopsis?: string;
  watchLabel?: string;
  addLabel?: string;
  onWatch?: () => void;
  onAddToList?: () => void;
  children?: React.ReactNode;
  className?: string;
}
export declare function Hero(props: HeroProps): React.ReactElement;

export interface FooterLink { label: string; href?: string }
export interface FooterProps {
  links?: FooterLink[];
  brand?: string;
  homeHref?: string;
  /** Fills the TMDB notice: "This {productType} uses TMDB and the TMDB APIs…". */
  productType?: string;
  copyright?: string;
  /** Replaces the built-in TMDB logo (embedded, so it needs no network). Rarely needed. */
  tmdbLogoSrc?: string;
  label?: string;
  className?: string;
}
export declare function Footer(props: FooterProps): React.ReactElement;

declare global {
  interface Window {
    Reelscore: {
      Icon: typeof Icon; Button: typeof Button; IconButton: typeof IconButton; NavBar: typeof NavBar; BottomNav: typeof BottomNav;
      Tabs: typeof Tabs; GenreChips: typeof GenreChips; AgeBadge: typeof AgeBadge; RatingBadge: typeof RatingBadge;
      RatingInput: typeof RatingInput; MovieCard: typeof MovieCard; PosterRow: typeof PosterRow; Hero: typeof Hero; Footer: typeof Footer;
    };
  }
}
