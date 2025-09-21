"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { WireframeLoader } from "@/components/wireframe-loader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, TrendingUp, Building, Globe, Shield, Smartphone, ArrowRight, Check, Star } from "lucide-react"
import Link from "next/link"

const products = [
  {
    category: "Personal Banking",
    icon: CreditCard,
    products: [
      {
        name: "Premium Checking Account",
        description: "Full-featured checking with no monthly fees and unlimited transactions",
        features: ["No monthly maintenance fee", "Unlimited transactions", "Free online banking", "Mobile deposit"],
        rate: "0.05% APY",
        badge: "Popular",
      },
      {
        name: "High-Yield Savings",
        description: "Competitive interest rates to help your money grow",
        features: ["High interest rates", "No minimum balance", "FDIC insured", "24/7 access"],
        rate: "4.50% APY",
        badge: "Best Rate",
      },
      {
        name: "Personal Credit Cards",
        description: "Flexible credit solutions with rewards and benefits",
        features: ["Cashback rewards", "No annual fee", "Fraud protection", "Travel benefits"],
        rate: "13.99% - 24.99% APR",
        badge: null,
      },
    ],
  },
  {
    category: "Business Banking",
    icon: Building,
    products: [
      {
        name: "Business Checking",
        description: "Streamlined banking solutions for your business needs",
        features: ["Free business checks", "Online banking", "Mobile deposits", "Cash management"],
        rate: "No monthly fee",
        badge: null,
      },
      {
        name: "Business Loans",
        description: "Flexible financing options to grow your business",
        features: ["Competitive rates", "Quick approval", "Flexible terms", "Dedicated support"],
        rate: "Starting at 6.99%",
        badge: "Fast Approval",
      },
      {
        name: "Merchant Services",
        description: "Accept payments anywhere with our merchant solutions",
        features: ["Point-of-sale systems", "Online payments", "Mobile processing", "24/7 support"],
        rate: "2.9% + 30¢",
        badge: null,
      },
    ],
  },
  {
    category: "Investment Banking",
    icon: TrendingUp,
    products: [
      {
        name: "Investment Portfolios",
        description: "Professionally managed investment solutions",
        features: ["Diversified portfolios", "Expert management", "Regular rebalancing", "Performance tracking"],
        rate: "0.75% management fee",
        badge: "Professional",
      },
      {
        name: "Retirement Planning",
        description: "Secure your financial future with our retirement solutions",
        features: ["401(k) plans", "IRA accounts", "Financial planning", "Tax advantages"],
        rate: "Various options",
        badge: null,
      },
      {
        name: "Wealth Management",
        description: "Comprehensive wealth management for high-net-worth clients",
        features: ["Personal advisor", "Estate planning", "Tax optimization", "Private banking"],
        rate: "Custom pricing",
        badge: "Premium",
      },
    ],
  },
]

const features = [
  {
    icon: Smartphone,
    title: "Mobile Banking",
    description: "Bank on-the-go with our award-winning mobile app",
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Advanced security measures to protect your accounts",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Access your accounts from anywhere in the world",
  },
  {
    icon: Star,
    title: "24/7 Support",
    description: "Round-the-clock customer service when you need it",
  },
]

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <WireframeLoader isLoading={isLoading}>
      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl font-bold mb-6">Our Products</h1>
              <p className="text-xl max-w-3xl mx-auto text-pretty">
                Discover comprehensive banking solutions designed to meet your personal and business financial needs
              </p>
            </motion.div>
          </div>
        </section>

        {/* Products Sections */}
        {products.map((category, categoryIndex) => (
          <section
            key={category.category}
            className={`py-20 ${categoryIndex % 2 === 0 ? "bg-background" : "bg-muted"}`}
          >
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <category.icon className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h2 className="text-4xl font-bold mb-4">{category.category}</h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {category.products.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 relative">
                      {product.badge && (
                        <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                          {product.badge}
                        </Badge>
                      )}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-3">{product.name}</h3>
                        <p className="text-muted-foreground mb-4">{product.description}</p>
                        <div className="text-lg font-bold text-secondary mb-4">{product.rate}</div>
                        <ul className="space-y-2 mb-6">
                          {product.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full bg-transparent" variant="outline">
                          Learn More <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Features Section */}
        <section className="py-20 bg-accent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-accent-foreground mb-4">Why Choose American Horizon?</h2>
              <p className="text-xl text-accent-foreground max-w-2xl mx-auto">
                Experience banking with features designed for your convenience and security
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center text-accent-foreground"
                >
                  <feature.icon className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Open your account today and experience the difference of modern banking
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                  <Link href="/register">Open Account</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </WireframeLoader>
  )
}
