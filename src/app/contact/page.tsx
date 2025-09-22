"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { WireframeLoader } from "@/components/wireframe-loader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: [
      "Customer Service: 1-800-SKYFLEX",
      "International: +1-555-123-4567",
      "Business Banking: 1-800-BIZ-FLEX",
    ],
  },
  {
    icon: Mail,
    title: "Email",
    details: [
      "General: info@skyflexbank.com",
      "Support: support@skyflexbank.com",
      "Business: business@skyflexbank.com",
    ],
  },
  {
    icon: MapPin,
    title: "Address",
    details: [
      "American Horizon Headquarters",
      "123 Financial District",
      "New York, NY 10001",
    ],
  },
  {
    icon: Clock,
    title: "Hours",
    details: [
      "Online Banking: 24/7",
      "Customer Service: 24/7",
      "Branch: Mon-Fri 9AM-5PM",
    ],
  },
];

const branches = [
  {
    name: "Manhattan Branch",
    address: "123 Financial District, New York, NY 10001",
    phone: "(555) 123-4567",
    hours: "Mon-Fri: 9AM-5PM, Sat: 9AM-2PM",
  },
  {
    name: "Brooklyn Branch",
    address: "456 Brooklyn Heights, Brooklyn, NY 11201",
    phone: "(555) 234-5678",
    hours: "Mon-Fri: 9AM-5PM, Sat: 9AM-2PM",
  },
  {
    name: "Queens Branch",
    address: "789 Queens Plaza, Queens, NY 11101",
    phone: "(555) 345-6789",
    hours: "Mon-Fri: 9AM-5PM, Sat: 9AM-2PM",
  },
];

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });

  const { loading, sendHttpRequest: contactRequest } = useHttp();

  const contactSuccess = (res: any) => {
    console.log("Response from contact request:", res);
  };
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.fullName ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill in all fields!");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    // Contact request
    contactRequest({
      requestConfig: {
        url: "/contact/us",
        method: "POST",
        body: {
          email: formData.email,
          fullName: formData.fullName,
          subject: formData.subject,
          message: formData.message,
          phoneNumber: formData.phoneNumber,
        },
        userType: "customer",
        successMessage: "Contact request successful!",
      },
      successRes: contactSuccess,
    });
    console.log("Form submitted:", formData);
  };

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
              <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl max-w-3xl mx-auto text-pretty">
                Get in touch with our team for personalized banking solutions
                and exceptional customer service
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're here to help with all your banking needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <info.icon className="w-12 h-12 text-secondary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-4">
                        {info.title}
                      </h3>
                      <div className="space-y-2">
                        {info.details.map((detail, detailIndex) => (
                          <p
                            key={detailIndex}
                            className="text-sm text-muted-foreground"
                          >
                            {detail}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Contact Form and Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">
                      Send us a Message
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="mt-1"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        size="lg"
                        className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      >
                        {loading ? <LoadingSpinner /> : "Send Message "}
                        {loading? "":<Send className="ml-2 w-4 h-4" />}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-0">
                    <div className="h-full min-h-[500px] bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-16 h-16 text-secondary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          Find Our Locations
                        </h3>
                        <p className="text-muted-foreground">
                          Interactive map coming soon
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Branch Locations */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Branch Locations</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Visit us at one of our convenient branch locations
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {branches.map((branch, index) => (
                <motion.div
                  key={branch.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">
                        {branch.name}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                          <p className="text-sm text-muted-foreground">
                            {branch.address}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-secondary" />
                          <p className="text-sm text-muted-foreground">
                            {branch.phone}
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Clock className="w-5 h-5 text-secondary mt-0.5" />
                          <p className="text-sm text-muted-foreground">
                            {branch.hours}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-4 bg-transparent"
                      >
                        Get Directions
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-accent-foreground mb-6">
                Need Immediate Assistance?
              </h2>
              <p className="text-xl text-accent-foreground mb-8 max-w-2xl mx-auto">
                For urgent banking matters, lost cards, or fraud reporting,
                contact us immediately
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Report Fraud: 1-800-FRAUD-HELP
                </Button>
                <Button
                  size="lg"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  24/7 Support: 1-800-SKYFLEX
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </WireframeLoader>
  );
}
