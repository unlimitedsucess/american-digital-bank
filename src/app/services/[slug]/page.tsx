"use client";

import { useParams } from "next/navigation";
import { services } from "@/data/services";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Service not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-6 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <service.icon className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
          <p className="text-lg text-muted-foreground">{service.description}</p>
        </div>

        {/* Image */}
        <div className="mb-12">
          <img
            src={service.image}
            alt={service.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Features */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <Link href="/register">Open an Account</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
