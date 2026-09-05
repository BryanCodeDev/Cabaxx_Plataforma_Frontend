import { classNames } from '@/utils/classNames';

import Avatar from './Avatar';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import Spinner from './Spinner';
import Pagination from './Pagination';
import Modal from './Modal';
import Table from './Table';
import ListingPage from './ListingPage';
import Textarea from './Textarea';
import Dropdown from './Dropdown';
import CommentSection from './CommentSection';
import LikeButton from './LikeButton';
import FollowButton from './FollowButton';
import StickyBottomCTA from './StickyBottomCTA';
import StickyCartSummary from './StickyCartSummary';
import CenteredContainer from './CenteredContainer';
import SkipLink from './SkipLink';
import PageSpinner from './PageSpinner';
import ScrollUtilities from './ScrollUtilities';
import ErrorBoundary from './ErrorBoundary';
import ScrollToTop from './ScrollToTop';
import ThemeToggle from './ThemeToggle';

export {
  Avatar,
  Button,
  Card,
  Input,
  Spinner,
  Pagination,
  Modal,
  Table,
  ListingPage,
  Textarea,
  Dropdown,
  CommentSection,
  LikeButton,
  FollowButton,
  StickyBottomCTA,
  StickyCartSummary,
  CenteredContainer,
  SkipLink,
  PageSpinner,
  ScrollUtilities,
  ErrorBoundary,
  ScrollToTop,
  ThemeToggle,
};

const BADGE_VARIANTS = {
  default: 'bg-white/[0.06] text-text-secondary border border-white/[0.08]',
  accent: 'bg-accent/15 text-accent border border-accent/20',
  success: 'bg-success/15 text-success border border-success/20',
  warning: 'bg-warning/15 text-warning border border-warning/20',
  error: 'bg-error/15 text-error border border-error/20',
  gold: 'bg-accent/15 text-accent border border-accent/20',
};

const BADGE_SIZES = { sm: 'text-[10px] px-2 py-0.5 tracking-[0.1em]', md: 'text-xs px-2.5 py-0.5 tracking-[0.08em]' };

export function Badge({ variant = 'default', size = 'md', children }) {
  return (
    <span className={classNames('inline-flex items-center rounded-full font-semibold uppercase', BADGE_VARIANTS[variant], BADGE_SIZES[size])}>
      {children}
    </span>
  );
}

export function Chip({ variant = 'default', icon, children, className = '' }) {
  const styles = {
    default: 'border-white/[0.08] bg-white/[0.03] text-text-secondary',
    accent:  'border-accent/25 bg-accent/10 text-accent',
    subtle:  'border-white/[0.06] bg-transparent text-text-muted',
  };
  return (
    <span className={classNames(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em]',
      styles[variant] || styles.default,
      className
    )}>
      {icon}
      {children}
    </span>
  );
}

export function EmptyState({ title, description, action, icon, className = '' }) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.015] px-6 py-14 text-center sm:py-20 ${className}`}
    >
      {icon && (
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-text-muted [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </div>
      )}
      <p className="font-display text-lg uppercase tracking-wide text-text-primary sm:text-xl">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">{description}</p>
      )}
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, action, align = 'left' }) {
  const centered = align === 'center';
  return (
    <div
      className={`flex gap-4 ${
        centered ? 'flex-col items-center text-center' : 'flex-col sm:flex-row sm:items-end sm:justify-between'
      }`}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
        )}
        <h2 className="font-display text-3xl uppercase leading-[1] tracking-tight text-text-primary md:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-white/[0.08]" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
          className={classNames(
            'relative -mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-t-sm',
            active === t.key
              ? 'border-accent text-text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
