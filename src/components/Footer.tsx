import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-gray-800 text-white">
      <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-6">
        <div className="flex-1">
          <p className="text-sm">© 2023 Shop with your buddy. All rights reserved.</p>
        </div>
        <nav className="flex gap-4 text-sm font-medium">
          <Link className="hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="hover:underline" href="#">
            Privacy Policy
          </Link>
          <Link className="hover:underline" href="#">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
} 