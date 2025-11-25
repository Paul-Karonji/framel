'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        category: 'Orders & Delivery',
        items: [
            {
                question: 'How long does delivery take?',
                answer: 'We offer same-day delivery for orders placed before 2 PM within Nairobi. For other areas, delivery typically takes 1-2 business days.'
            },
            {
                question: 'Do you deliver on weekends?',
                answer: 'Yes! We deliver on Saturdays and Sundays. However, orders for Sunday delivery must be placed by Saturday 5 PM.'
            },
            {
                question: 'Can I track my order?',
                answer: 'Absolutely. Once your order is dispatched, you will receive a tracking link via SMS and email to monitor your delivery in real-time.'
            }
        ]
    },
    {
        category: 'Payments',
        items: [
            {
                question: 'What payment methods do you accept?',
                answer: 'We primarily accept M-Pesa. You can pay directly through our website using the STK push prompt or via Paybill.'
            },
            {
                question: 'Is it safe to pay online?',
                answer: 'Yes, our payments are processed securely through Safaricom\'s Daraja API. We do not store your PIN or sensitive banking information.'
            }
        ]
    },
    {
        category: 'Products & Care',
        items: [
            {
                question: 'How long do the flowers last?',
                answer: 'With proper care, our fresh cut flowers typically last 5-7 days. We include a packet of flower food and care instructions with every bouquet.'
            },
            {
                question: 'Can I customize a bouquet?',
                answer: 'Yes! You can choose a "Custom Arrangement" option or contact us directly to create a bespoke bouquet for your special occasion.'
            }
        ]
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggleAccordion = (index: string) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                <p className="text-gray-600">
                    Find answers to common questions about our delivery, payment, and products.
                </p>
            </div>

            <div className="space-y-12">
                {faqs.map((category, catIndex) => (
                    <div key={catIndex}>
                        <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6 border-b pb-2">
                            {category.category}
                        </h2>
                        <div className="space-y-4">
                            {category.items.map((item, itemIndex) => {
                                const uniqueId = `${catIndex}-${itemIndex}`;
                                const isOpen = openIndex === uniqueId;

                                return (
                                    <div
                                        key={itemIndex}
                                        className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-rose-200 transition-colors"
                                    >
                                        <button
                                            onClick={() => toggleAccordion(uniqueId)}
                                            className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                                        >
                                            <span className="font-medium text-gray-900 text-lg">{item.question}</span>
                                            {isOpen ? (
                                                <ChevronUp className="w-5 h-5 text-rose-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            )}
                                        </button>

                                        {isOpen && (
                                            <div className="p-5 pt-0 text-gray-600 leading-relaxed bg-gray-50/50">
                                                {item.answer}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center bg-rose-50 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h3>
                <p className="text-gray-600 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-500 hover:bg-rose-600 transition-colors"
                >
                    Get in Touch
                </a>
            </div>
        </div>
    );
}
