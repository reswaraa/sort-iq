'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white shadow-md border-b">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span className="text-xl font-bold text-green-700">Sort-IQ</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`text-gray-600 hover:text-green-600 transition duration-300 ${
                pathname === '/' ? 'text-green-600 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/scan"
              className={`text-gray-600 hover:text-green-600 transition duration-300 ${
                pathname === '/scan' ? 'text-green-600 font-semibold' : ''
              }`}
            >
              Real-time Detection
            </Link>
            <Link
              href="/upload"
              className={`text-gray-600 hover:text-green-600 transition duration-300 ${
                pathname === '/upload' ? 'text-green-600 font-semibold' : ''
              }`}
            >
              Static Waste Classification
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-green-600 focus:outline-none focus:text-green-600"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md ${
                  pathname === '/'
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/detect"
                className={`block px-3 py-2 rounded-md ${
                  pathname === '/detect'
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Detect Waste
              </Link>
              <Link
                href="/database"
                className={`block px-3 py-2 rounded-md ${
                  pathname === '/database'
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Recycling Database
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
