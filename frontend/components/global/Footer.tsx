import React, { ReactElement } from 'react';
import Link from 'next/link';
import { Mail, DollarSign } from 'lucide-react';

interface footerLinks {
    link: string,
    element: string | ReactElement
}

const quickLinks: footerLinks[] = [
    {
        link: '/dashboard',
        element: 'Dashboard',
    },
    {
        link: '/transactions',
        element: 'Transactions',
    },
    {
        link: '/reports',
        element: 'Reports',
    },
    {
        link: '/budget',
        element: 'Budget',
    },
];

const resources: footerLinks[] = [
    {
        link: '/help',
        element: 'Help Center',
    },
    {
        link: '/guides',
        element: 'Guides',
    },
    {
        link: '/api',
        element: 'API',
    },
    {
        link: '/privacy',
        element: 'Privacy Policy',
    },
];

const contacts: footerLinks[] = [
    {
        link: 'mailto:contact@expensetracker.com',
        element: <Mail size={20} />,
    },
];

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-[5%]">
                    <div className="space-y-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary">
                            <DollarSign className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg">
                            FinFlow
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Track your expenses, manage your budget,
                            and achieve your financial goals.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h4 className="font-medium">Quick Links</h4>
                        <ul className="space-y-2">
                            {quickLinks.map((ql) => (
                                <li>
                                    <Link
                                        href={ql.link}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {ql.element}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-medium">Resources</h4>
                        <ul className="space-y-2">
                            {resources.map((resource) => (
                                <li>
                                    <Link
                                        href={resource.link}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {resource.element}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-medium">Connect</h4>
                        <div className="flex space-x-4">
                            {contacts.map((contact) => (
                                <Link
                                    href={contact.link}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {contact.element}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {currentYear} FinFlow. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
