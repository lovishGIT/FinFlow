'use client';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Menu,
    Moon,
    Sun,
    DollarSign,
    LineChart,
    Users,
    Settings,
    Book,
} from 'lucide-react';
import Link from 'next/link';

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const Navbar: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () =>
            window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems: NavItem[] = [
        { label: 'Dashboard', href: '#dashboard', icon: LineChart },
        {
            label: 'Transactions',
            href: '#transactions',
            icon: DollarSign,
        },
        { label: 'Reports', href: '#reports', icon: Book },
        { label: 'Settings', href: '#settings', icon: Settings },
    ];

    return (
        <nav
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                scrolled
                    ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm'
                    : 'bg-transparent'
            }`}
        >
            <div className="container flex h-20 items-center px-4">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <div
                        className={`flex items-center justify-center h-8 w-8 rounded-lg ${
                            scrolled ? 'bg-primary' : 'bg-primary/20'
                        }`}
                    >
                        <DollarSign
                            className={`h-5 w-5 ${
                                scrolled
                                    ? 'text-primary-foreground'
                                    : 'text-primary'
                            }`}
                        />
                    </div>
                    <span className="hidden font-bold sm:inline-block text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        FinFlow
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
                    <ul className="flex space-x-1">
                        {navItems.map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                                    ${
                                        scrolled
                                            ? 'hover:bg-secondary/80 hover:text-secondary-foreground'
                                            : 'hover:bg-white/10 hover:text-primary'
                                    }`}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex md:items-center md:space-x-4">
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setTheme(
                                    theme === 'light'
                                        ? 'dark'
                                        : 'light'
                                )
                            }
                            className="mr-4"
                        >
                            {theme === 'light' ? (
                                <Moon className="h-5 w-5" />
                            ) : (
                                <Sun className="h-5 w-5" />
                            )}
                            <span className="sr-only">
                                Toggle theme
                            </span>
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className={`gap-2 ${
                            !scrolled &&
                            'border-primary/20 hover:border-primary/40'
                        }`}
                    >
                        <Users className="h-4 w-4" />
                        Sign In
                    </Button>
                    <Button
                        className={`${
                            scrolled
                                ? 'bg-primary hover:bg-primary/90'
                                : 'bg-primary/20 hover:bg-primary/30 text-primary'
                        }`}
                    >
                        Start Free Trial
                    </Button>
                </div>

                {/* Mobile Menu */}
                <div className="flex flex-1 justify-end items-center space-x-4 md:hidden">
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setTheme(
                                    theme === 'light'
                                        ? 'dark'
                                        : 'light'
                                )
                            }
                        >
                            {theme === 'light' ? (
                                <Moon className="h-5 w-5" />
                            ) : (
                                <Sun className="h-5 w-5" />
                            )}
                            <span className="sr-only">
                                Toggle theme
                            </span>
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">
                                    Toggle menu
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-56"
                        >
                            {navItems.map((item) => (
                                <DropdownMenuItem key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="w-full flex items-center"
                                    >
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.label}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem>
                                <Link
                                    href="#signin"
                                    className="w-full flex items-center"
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Sign In
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link
                                    href="#signup"
                                    className="w-full flex items-center"
                                >
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Start Free Trial
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
