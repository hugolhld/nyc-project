'use client'

import Link from 'next/link'
import { useState } from 'react'

const NavButton = ({ href, children, isActive, onClick }: { href: string, children: string, isActive: boolean, onClick: () => void }) => {
    return (
        <li>
            <Link href={href} onClick={onClick} className={`m-4 ${isActive && 'font-semibold'} hover:opacity-50 transition-opacity hover:transition-opacity`}>
                {children}
            </Link>
        </li>
    )
}

const Header = () => {
    const [pathname, setPathname] = useState(window.location.pathname);

    return (
        <header className='bg-white-600 p-4 flex justify-between items-center  shadow-lg'>
            <h1 className='text-3xl text-center font-semibold'>
                <Link href='/' onClick={() => setPathname('/')}>NYC Project</Link>
            </h1>
            <nav>
                <ul className='flex justify-center gap-4'>
                    <NavButton href='/' onClick={() => setPathname('/')} isActive={pathname === '/'}>Home</NavButton>
                    <NavButton href='/map' onClick={() => setPathname('/map')} isActive={pathname === '/map'}>Map</NavButton>
                    <NavButton href='/statistics' onClick={() => setPathname('/statistics')} isActive={pathname === '/statistics'}>Statistics</NavButton>
                </ul>
            </nav>
        </header>
    )
}

export default Header