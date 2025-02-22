import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DollarSign, Download, TrendingUp } from 'lucide-react';
import dashboardImage from '@/assets/dashboardImage.png';

const HeroSection = () => {
    return (
        <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
                    {/* Text Content */}
                    <div className="text-left lg:text-left">
                        <div className="flex items-center gap-2 mb-6">
                            <DollarSign className="w-8 h-8 text-primary" />
                            <span className="text-xl font-semibold text-primary">
                                FinFlow
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Master Your Money
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl">
                            Take control of your finances with our
                            intelligent expense tracking and budgeting
                            solution. Perfect for both personal and
                            business use.
                        </p>
                        <div className="mt-10 flex items-center gap-4 md:gap-6">
                            <Button
                                size="lg"
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                            >
                                <Download size={20} />
                                Get Started Free
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="flex items-center gap-2"
                            >
                                <TrendingUp size={20} />
                                View Demo
                            </Button>
                        </div>
                    </div>

                    {/* Dashboard Image */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[600px] aspect-[16/10] rounded-xl overflow-hidden shadow-2xl">
                            <Image
                                src={dashboardImage}
                                alt="FinFlow Dashboard"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
