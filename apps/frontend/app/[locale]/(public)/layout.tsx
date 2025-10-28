import { ReactNode } from 'react';
import { PublicPageWrapper } from '@/components/shared/layout/PublicPageWrapper';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <PublicPageWrapper>
      {children}
    </PublicPageWrapper>
  );
}
