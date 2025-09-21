"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card,CardContent } from "@/components/ui/card";

import { Navigation } from "@/components/navigation";
import { WireframeLoader } from "@/components/wireframe-loader";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  Globe,
  CreditCard,
  PiggyBank,
  Building,
  Phone,
  Mail,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";

const heroSlides = [
  {
    image: "/images/hero-bg-1.jpg",
    title: "Empowering your Business future with trusted banking solutions",
    subtitle:
      "Experience seamless banking with our innovative digital platform",
    cta: "Get Started Today",
  },
  {
    image: "/images/hero-bg-2.jpg",
    title: "Secure Investment Banking for Modern Entrepreneurs",
    subtitle: "Grow your wealth with our expert financial advisory services",
    cta: "Explore Investments",
  },
  {
    image: "/images/hero-bg-3.jpg",
    title: "International Trade Finance Made Simple",
    subtitle: "Connect globally with our comprehensive trade solutions",
    cta: "Learn More",
  },
];

const services = [
  {
    icon: Globe,
    title: "International Trade",
    description:
      "Comprehensive trade finance solutions for global business expansion",
    image: "/international-trade-finance.jpg",
  },
  {
    icon: CreditCard,
    title: "Retail Banking",
    description: "Personal banking services tailored to your financial needs",
    image: "/retail-banking-services.jpg",
  },
  {
    icon: TrendingUp,
    title: "Investment Banking",
    description:
      "Strategic investment solutions for wealth growth and portfolio management",
    image: "/investment-banking-portfolio.jpg",
  },
];

const additionalServices = [
  {
    title: "Online Banking",
    description: "24/7 access to your accounts",
    image: "/online-banking-interface.jpg",
  },
  {
    title: "IT Solutions",
    description: "Advanced technology for modern banking",
    image: "/banking-technology-solutions.jpg",
  },
  {
    title: "Credit Cards",
    description: "Flexible payment solutions",
    image: "/credit-cards-banking.png",
  },
  {
    title: "Investment Products",
    description: "Diversified investment opportunities",
    image: "/investment-products-portfolio.jpg",
  },
  {
    title: "Savings",
    description: "High-yield savings accounts",
    image: "/savings-account-banking.jpg",
  },
  {
    title: "Loans",
    description: "Competitive loan rates",
    image: "/bank-loans-financing.jpg",
  },
];

const stats = [
  { icon: Users, label: "Personal Loan", value: "500000+" },
  { icon: Building, label: "Account Request", value: "1M+" },
  { icon: TrendingUp, label: "5 in 1", value: "24/7 Online Support" },
  { icon: PiggyBank, label: "Mortgage Loan", value: "Available 24/7" },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <WireframeLoader isLoading={isLoading}>
      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${heroSlides[currentSlide].image})`,
                }}
              />
              <div className="absolute inset-0 bg-primary/60" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-6xl font-bold mb-6 text-balance"
              >
                {heroSlides[currentSlide].title}
              </motion.h1>
              <motion.p
                key={`subtitle-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl mb-8 text-pretty"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6"
                  asChild
                >
                  <Link href="/register">
                    {heroSlides[currentSlide].cta}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-accent" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center text-accent-foreground"
                >
                  <stat.icon className="w-12 h-12 mx-auto mb-4" />
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">
                What We Offer
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.title}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <service.icon className="w-8 h-8 text-secondary mb-4" />
                        <h3 className="text-xl font-semibold mb-3">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {service.description}
                        </p>
                        <Button variant="outline" size="sm">
                          Read More <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-accent-foreground mb-4">
                We look forward to doing great things with you anywhere in the
                world.
              </h2>
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Additional Services Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group cursor-pointer"
                >
                  <Card className="overflow-hidden h-64">
                    <CardContent className="p-0 relative h-full">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                        <div className="text-center text-white">
                          <h3 className="text-xl font-bold mb-2">
                            {service.title}
                          </h3>
                          <p className="text-sm">{service.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support & Exchange Rates Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Support Centre */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-8">Support Centre</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Shield className="w-6 h-6 text-secondary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Security Center</h3>
                      <p className="text-muted-foreground text-sm">
                        Our Security Center protects you from online fraud and
                        helps keep your information secure.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Users className="w-6 h-6 text-secondary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Customer Care</h3>
                      <p className="text-muted-foreground text-sm">
                        24/7 customer support for all your banking needs.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Building className="w-6 h-6 text-secondary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Properties</h3>
                      <p className="text-muted-foreground text-sm">
                        Find out more about our Properties for sale and rent.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Exchange Rates */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-8">Exchange Rates</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="font-medium">Dollar (CAD)</span>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            Buy: 1.35
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Sell: 1.32
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="font-medium">Pound (GBP)</span>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            Buy: 0.82
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Sell: 0.79
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">Euro (EUR)</span>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            Buy: 0.92
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Sell: 0.89
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-accent text-accent-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold">American Horizon</span>
                </div>
                <p className="text-sm mb-4">
                  © Copyright 2024 American Horizon. All rights reserved. American Horizon
                  Bank is committed to providing secure and innovative banking
                  solutions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Company Information</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-secondary transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/careers"
                      className="hover:text-secondary transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/investor-relations"
                      className="hover:text-secondary transition-colors"
                    >
                      Investor Relations
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Banking Services</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/services/personal"
                      className="hover:text-secondary transition-colors"
                    >
                      Personal Banking
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services/business"
                      className="hover:text-secondary transition-colors"
                    >
                      Business Banking
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services/investment"
                      className="hover:text-secondary transition-colors"
                    >
                      Investment Banking
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Who We Are ?</h3>
                <p className="text-sm mb-4">
                  American Horizon is a leading financial institution committed to
                  providing innovative banking solutions worldwide.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>info@americanhorizon.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>New York, NY 10001</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </WireframeLoader>
  );
}
