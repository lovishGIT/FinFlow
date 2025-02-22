import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Download,
    Building2,
    Users,
    PieChart,
    Clock,
    Shield,
    TrendingUp,
    DollarSign,
    CreditCard,
    Wallet,
    LineChart,
    Briefcase,
} from 'lucide-react';

import HeroSection from './heroSection';

const Home = () => {
    const stats = [
        {
            label: 'Companies Trust Us',
            value: '500+',
            icon: Building2,
        },
        { label: 'Active Users', value: '50,000+', icon: Users },
        {
            label: 'Highest Money Saved',
            value: '₹20 Crores+',
            icon: CreditCard,
        },
    ];

    const features = [
        {
            title: 'Real-time Tracking',
            description:
                'Monitor your expenses as they happen with instant updates and smart categorization',
            icon: Clock,
        },
        {
            title: 'Smart Analytics',
            description:
                'Get detailed insights into your spending patterns with beautiful charts and reports',
            icon: PieChart,
        },
        {
            title: 'Bank-level Security',
            description:
                'Your financial data is protected with enterprise-grade encryption and security measures',
            icon: Shield,
        },
    ];

    const portfolioTypes = [
        {
            title: 'Cryptocurrency',
            description:
                'Connect your crypto wallets and exchange accounts to track your digital assets in real-time',
            icon: Wallet,
        },
        {
            title: 'Mutual Funds',
            description:
                'Import your mutual fund investments from major platforms and track their performance',
            icon: LineChart,
        },
        {
            title: 'Stock Portfolio',
            description:
                'Link your demat accounts and monitor your stock investments all in one place',
            icon: Briefcase,
        },
    ];

    return (
        <div className="bg-background">
            <HeroSection />

            {/* Stats Section */}
            <div className="py-16 bg-secondary/10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {stats.map((stat, index) => (
                            <Card
                                key={index}
                                className="border-none bg-background/50 backdrop-blur"
                            >
                                <CardContent className="pt-6">
                                    <stat.icon className="mx-auto h-12 w-12 text-primary" />
                                    <h2 className="mt-4 text-3xl font-bold tracking-tight">
                                        {stat.value}
                                    </h2>
                                    <p className="text-base leading-7 text-muted-foreground">
                                        {stat.label}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Portfolio Connection Section */}
            <div className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">
                        Connect All Your Investments
                    </h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Track all your investments in one place.
                        Simply connect your accounts and let FinFlow
                        do the rest.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {portfolioTypes.map((type, index) => (
                            <Card
                                key={index}
                                className="border border-border/50 hover:border-primary/50 transition-colors duration-300"
                            >
                                <CardContent className="pt-6">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <type.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {type.title}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {type.description}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        className="mt-4 w-full"
                                    >
                                        Connect Account
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">
                        Why Choose FinFlow?
                    </h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Our platform combines powerful features with
                        simplicity to give you the best expense
                        tracking experience.
                    </p>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <CardContent className="pt-6">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
