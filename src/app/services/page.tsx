"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { WireframeLoader } from "@/components/wireframe-loader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Smartphone,
  Monitor,
  Send,
  CreditCard,
  Shield,
  Headphones,
  Globe,
  ArrowRight,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Smartphone,
    title: "Mobile Banking",
    description: "Complete banking at your fingertips with our award-winning mobile app",
    features: [
      "Account balance and transaction history",
      "Mobile check deposit",
      "Bill pay and transfers",
      "ATM and branch locator",
      "Biometric login",
    ],
    image: "/mobile-banking-app.png",
  },
  {
    icon: Monitor,
    title: "Online Banking",
    description: "Secure and convenient online banking platform available 24/7",
    features: [
      "Real-time account management",
      "Advanced security features",
      "Customizable dashboard",
      "Document storage",
      "Investment tracking",
    ],
    image: "/online-banking-dashboard.jpg",
  },
  {
    icon: Send,
    title: "Wire Transfers",
    description: "Fast and secure domestic and international wire transfers",
    features: [
      "Same-day domestic transfers",
      "International wire transfers",
      "Competitive exchange rates",
      "Transfer tracking",
      "Secure encryption",
    ],
    image: "/wire-transfer-banking.jpg",
  },
  {
    icon: CreditCard,
    title: "Card Services",
    description: "Comprehensive credit and debit card solutions",
    features: [
      "Contactless payment technology",
      "Fraud monitoring",
      "Instant card replacement",
      "Spending controls",
      "Rewards programs",
    ],
    image: "/banking-credit-cards.jpg",
  },
  {
    icon: Shield,
    title: "Security Services",
    description: "Advanced security measures to protect your financial assets",
    features: [
      "Multi-factor authentication",
      "Real-time fraud alerts",
      "Identity theft protection",
      "Secure messaging",
      "Account monitoring",
    ],
    image: "/banking-security-shield.jpg",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description: "24/7 customer service with dedicated support specialists",
    features: [
      "24/7 phone support",
      "Live chat assistance",
      "Video banking",
      "Email support",
      "In-branch appointments",
    ],
    image: "/customer-service-banking.jpg",
  },
]

const digitalFeatures = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access your accounts anytime, anywhere",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Military-grade encryption protects your data",
  },
  {
    icon: CheckCircle,
    title: "Instant Notifications",
    description: "Real-time alerts for all account activities",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Manage your finances from anywhere in the world",
  },
]

export default function ServicesPage() {
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
              <h1 className="text-5xl font-bold mb-6">Banking Services</h1>
              <p className="text-xl max-w-3xl mx-auto text-pretty">
                Experience comprehensive banking services designed for the digital age with security, convenience, and
                innovation at the forefront
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive banking solutions tailored to your needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                        <div className="p-6 flex flex-col justify-center">
                          <service.icon className="w-12 h-12 text-secondary mb-4" />
                          <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                          <p className="text-muted-foreground mb-4">{service.description}</p>
                          <ul className="space-y-2 mb-6">
                            {service.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button variant="outline" className="self-start bg-transparent">
                            Learn More <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                        <div className="relative overflow-hidden">
                          <img
                            src={service.image || "/placeholder.svg"}
                            alt={service.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Digital Banking Features */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Digital Banking Advantages</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the future of banking with our digital-first approach
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {digitalFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <feature.icon className="w-12 h-12 text-secondary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Hours */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-6">Service Hours</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="font-medium">Online Banking</span>
                        <span className="text-secondary">24/7</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="font-medium">Customer Service</span>
                        <span className="text-secondary">24/7</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="font-medium">Branch Hours</span>
                        <span className="text-secondary">Mon-Fri 9AM-5PM</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">Wire Transfers</span>
                        <span className="text-secondary">Mon-Fri 9AM-3PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Headphones className="w-5 h-5 text-secondary" />
                        <div>
                          <div className="font-medium">Customer Service</div>
                          <div className="text-muted-foreground">1-800-SKYFLEX</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Send className="w-5 h-5 text-secondary" />
                        <div>
                          <div className="font-medium">Email Support</div>
                          <div className="text-muted-foreground">support@skyflexbank.com</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-secondary" />
                        <div>
                          <div className="font-medium">International</div>
                          <div className="text-muted-foreground">+1-555-123-4567</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
              <h2 className="text-3xl font-bold text-accent-foreground mb-6">Experience Modern Banking Today</h2>
              <p className="text-xl text-accent-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of customers who trust American Digit Bank for their financial needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent"
                  asChild
                >
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
