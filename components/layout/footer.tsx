"use client"
import { FC, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Footer: FC = () => {
   

    return (
        <footer className="mt-auto text-black text-center p-4">
            <p className="text-sm">© 2024 <Link href="/student" className="hover:text-gray-400">
                Geome<span className='text-green-500'>Triks</span>
            </Link>. All Rights Reserved.</p>
        </footer>
    );
};

export default Footer;
