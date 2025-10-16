import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-6 px-4 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Reiseklar. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-gray-900 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy
            </Link>
            <Link href="/help" className="hover:text-gray-900 transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
