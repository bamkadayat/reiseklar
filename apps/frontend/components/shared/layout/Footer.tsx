import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-4 px-4 border-t border-border bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <p className="text-center">
            © {new Date().getFullYear()} Reiseklar. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/help" className="hover:text-foreground transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
