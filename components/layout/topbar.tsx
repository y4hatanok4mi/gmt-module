'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CircleUserRound, Settings, LogOut } from 'lucide-react'; // Example icons from Lucide

const TopBar: FC = () => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();

  const togglePopover = () => setPopoverOpen((prev) => !prev);

  const closePopover = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setPopoverOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', closePopover);
    return () => {
      document.removeEventListener('click', closePopover);
    };
  }, []);

  const isActive = (link: string) => pathname === link;

  return (
    <header className="p-5 flex justify-between items-center">
      {/* Logo Section */}
      <div className="text-2xl font-bold">
        <Link href="/student">
          <span className="block sm:hidden">
            <span className="text-green-500">G</span>
            <span className="text-black">T</span>
          </span>
          <span className="hidden sm:block hover:text-green-500">
            Geome<span className="text-green-500 hover:text-black">Triks</span>
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex gap-2">
        <div
          className={`relative ${
            isActive('/student') ? 'bg-green-500' : ''
          } py-2 px-3 rounded-md`}
        >
          <Link
            href="/student"
            className={` ${
              isActive('/student') ? 'text-white' : 'hover:text-green-500'
            }`}
          >
            Home
          </Link>
        </div>

        <div
          className={`relative ${
            isActive('/student/lessons') ? 'bg-green-500' : ''
          } py-2 px-3 rounded-md`}
        >
          <Link
            href="/student/lessons"
            className={` ${
              isActive('/student/lessons') ? 'text-white' : 'hover:text-green-500'
            }`}
          >
            Modules
          </Link>
        </div>

        <div
          className={`relative ${
            isActive('/student/leaderboard') ? 'bg-green-500' : ''
          } py-2 px-3 rounded-md`}
        >
          <Link
            href="/student/leaderboard"
            className={` ${
              isActive('/student/leaderboard')
                ? 'text-white'
                : 'hover:text-green-500'
            }`}
          >
            Leaderboard
          </Link>
        </div>
      </nav>

      {/* Profile Image Section */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={togglePopover}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300"
        >
          <Image
            src="/user.png"
            alt="Profile"
            width={40}
            height={40}
            className="object-cover"
          />
        </button>

        {/* Popover */}
        {isPopoverOpen && (
          <div
            ref={popoverRef}
            className="absolute top-full right-0 mt-2 w-48 p-4 bg-white shadow-lg rounded-md"
          >
            <div className="text-gray-800 font-bold">Profile</div>
            <div className="my-1 border-t border-gray-200" />
            {/* Divider */}
            <ul className="mt-2">
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <CircleUserRound className="text-gray-700" />
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-gray-500"
                >
                  View Profile
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer mt-3">
                <Settings className="text-gray-700" />
                <Link
                  href="/settings"
                  className="text-gray-700 hover:text-gray-500"
                >
                  Settings
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer mt-3">
                <LogOut className="text-gray-700" />
                <Link
                  href="/logout"
                  className="text-gray-700 hover:text-gray-500"
                >
                  Log Out
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
