"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { WireframeLoader } from "@/components/wireframe-loader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Award, Globe, Shield, TrendingUp, Heart } from "lucide-react"

const values = [
  {
    icon: Shield,
    title: "Trust & Security",
    description:
      "We prioritize the security of your financial assets with state-of-the-art encryption and fraud protection.",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Our customers are at the heart of everything we do, driving our commitment to exceptional service.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "We continuously evolve our services to meet the changing needs of modern banking.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "With international presence, we connect you to opportunities worldwide.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in every interaction and service we provide.",
  },
  {
    icon: Heart,
    title: "Community",
    description: "We're committed to supporting the communities where we operate and serve.",
  },
]

const leadership = [
  {
    name: "Sarah Johnson",
    position: "Chief Executive Officer",
    image: "/professional-woman-ceo.png",
    bio: "With over 20 years in banking, Sarah leads American Digit Bank's vision for innovative financial services.",
  },
  {
    name: "Michael Chen",
    position: "Chief Technology Officer",
    image: "/professional-man-cto.png",
    bio: "Michael drives our digital transformation initiatives and ensures cutting-edge banking technology.",
  },
  {
    name: "Emily Rodriguez",
    position: "Chief Financial Officer",
    image: "/professional-woman-cfo.png",
    bio: "Emily oversees financial strategy and ensures sustainable growth for our organization.",
  },
]

export default function AboutPage() {
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
              <h1 className="text-5xl font-bold mb-6">About American Digit Bank</h1>
              <p className="text-xl max-w-3xl mx-auto text-pretty">
                Empowering financial futures through innovative banking solutions, trusted partnerships, and unwavering
                commitment to our customers' success.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-6 text-secondary">Our Mission</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      To provide innovative, secure, and accessible banking services that empower individuals and
                      businesses to achieve their financial goals while contributing to economic growth and community
                      development.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-6 text-secondary">Our Vision</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      To be the leading digital-first bank that transforms the financial landscape through cutting-edge
                      technology, exceptional customer experience, and sustainable banking practices that benefit all
                      stakeholders.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide our decisions and shape our culture
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <value.icon className="w-12 h-12 text-secondary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Leadership Team</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Meet the experienced professionals leading American Digit Bank into the future
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leadership.map((leader, index) => (
                <motion.div
                  key={leader.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <img
                        src={leader.image || "/placeholder.svg"}
                        alt={leader.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="text-xl font-semibold mb-2">{leader.name}</h3>
                      <p className="text-secondary font-medium mb-3">{leader.position}</p>
                      <p className="text-muted-foreground text-sm">{leader.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-accent-foreground mb-6">Ready to Experience American Digit Banking?</h2>
              <p className="text-xl text-accent-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust American Digit Bank for their financial needs.
              </p>
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Open Your Account Today
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </WireframeLoader>
  )
}
