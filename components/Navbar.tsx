"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800"
    }`;

  return (
    <nav className="w-full border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          TinyLink
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
        </div>

      </div>
    </nav>
  );
}
