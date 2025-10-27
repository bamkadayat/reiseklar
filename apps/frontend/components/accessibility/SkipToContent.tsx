'use client';

import { useTranslations } from 'next-intl';

interface SkipToContentProps {
  /**
   * The ID of the main content element to skip to
   * @default "main-content"
   */
  contentId?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SkipToContent component for keyboard navigation accessibility
 *
 * This component provides a skip link that allows keyboard users to bypass
 * repetitive navigation and jump directly to the main content.
 *
 * @example
 * ```tsx
 * // In your root layout
 * <SkipToContent />
 * <Navbar />
 * <main id="main-content">
 *   {children}
 * </main>
 * ```
 */
export function SkipToContent({ contentId = 'main-content', className = '' }: SkipToContentProps) {
  const t = useTranslations('accessibility');

  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById(contentId);

    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <a
      href={`#${contentId}`}
      onClick={handleSkip}
      className={`
        sr-only
        focus:not-sr-only
        focus:absolute
        focus:top-4
        focus:left-4
        focus:z-50
        focus:px-4
        focus:py-2
        focus:bg-blue-600
        focus:text-white
        focus:rounded-md
        focus:shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-offset-2
        transition-all
        duration-200
        ${className}
      `}
      aria-label={t('skipToContent') || 'Skip to main content'}
    >
      {t('skipToContent') || 'Skip to main content'}
    </a>
  );
}

/**
 * ScreenReaderOnly component - hides content visually but keeps it for screen readers
 *
 * @example
 * ```tsx
 * <ScreenReaderOnly>
 *   <p>This text is only for screen readers</p>
 * </ScreenReaderOnly>
 * ```
 */
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

/**
 * VisuallyHidden component - hides content visually but keeps it accessible
 * Alias for ScreenReaderOnly with the same functionality
 */
export const VisuallyHidden = ScreenReaderOnly;
