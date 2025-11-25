'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success('Message sent successfully! We will get back to you soon.');
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Contact Us</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Have a question about our flowers or your order? We're here to help!
                    Fill out the form below or reach out to us directly.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Information */}
                <div className="space-y-8">
                    <div className="bg-rose-50 p-8 rounded-2xl">
                        <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-900">Get in Touch</h2>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-white p-3 rounded-full shadow-sm">
                                    <Phone className="w-6 h-6 text-rose-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Phone</h3>
                                    <p className="text-gray-600">+254 712 345 678</p>
                                    <p className="text-sm text-gray-500">Mon-Sat 8am to 6pm</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-white p-3 rounded-full shadow-sm">
                                    <Mail className="w-6 h-6 text-rose-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Email</h3>
                                    <p className="text-gray-600">hello@framel.co.ke</p>
                                    <p className="text-sm text-gray-500">24/7 Support</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-white p-3 rounded-full shadow-sm">
                                    <MapPin className="w-6 h-6 text-rose-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Location</h3>
                                    <p className="text-gray-600">Westlands, Nairobi</p>
                                    <p className="text-sm text-gray-500">Kenya</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="h-64 bg-gray-100 rounded-2xl overflow-hidden relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.278768667!2d36.799729!3d-1.267814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c0a1f9de7%3A0xad2c84df1f7f2ec8!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1625143200000!5m2!1sen!2ske"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            className="absolute inset-0"
                        />
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-900">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                                <Input id="name" required placeholder="Your name" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                                <Input id="email" type="email" required placeholder="your@email.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                            <Input id="subject" required placeholder="How can we help?" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                            <Textarea
                                id="message"
                                required
                                placeholder="Tell us more about your inquiry..."
                                className="min-h-[150px]"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                'Sending...'
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Message
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
