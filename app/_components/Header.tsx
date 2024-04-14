import React, { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlusSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '../auth/AuthContext';
import { supabase } from '../supabase';

const Header = () => {
    const path = usePathname();
    const { user, isSignedIn } = useUser();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Sign out error:', error.message);
    };

    return (
        <nav className="flex justify-between p-2 items-center shadow-md w-full">
           <div className="logo">
                <Image src={"/logoipsum-259.svg"} className="p-2" width={150} height={150} alt="logo" />
            </div>
            <ul className="hidden md:flex gap-6 items-center">
                <li className={`"hover:bg-indigo-500 hover:bg-opacity-20 p-2 rounded hover:text-indigo-500 font-medium text-sm cursor-pointer" ${path == '/' && "text-indigo-500"}`}><Link href={'/'}>For Sale</Link></li>
                <li className="hover:bg-indigo-500 hover:bg-opacity-20 p-2 rounded hover:text-indigo-500 font-medium text-sm cursor-pointer"><Link href={'/'}>Rentals</Link></li>
                <li className="hover:bg-indigo-500 hover:bg-opacity-20 p-2 rounded hover:text-indigo-500 font-medium text-sm cursor-pointer"><Link href={'/'}>Agent Finder</Link></li>
            </ul>
            <div className="buttons flex gap-2">
                <Button className="bg-indigo-500 flex gap-2"><PlusSquare/> Post Your Ad</Button>
                {isSignedIn ? (
                    <>
                        <span>Welcome, {user?.email}!</span>
                        <Button className="bg-red-500" onClick={handleSignOut}>Sign Out</Button>
                    </>
                ) : (
                    <Button className="bg-cyan-500"><Link href={'/auth/signin'}>Sign In</Link></Button>
                )}
            </div>
        </nav>
    );
};

export default Header;