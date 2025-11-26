export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Terms of Service</h1>
                <p className="text-gray-600">Last updated: November 25, 2025</p>
            </div>

            <div className="prose prose-rose max-w-none text-gray-600 space-y-8">
                <section>
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
                    <p>
                        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot;) and Framel (&quot;we,&quot; &quot;us&quot; or &quot;our&quot;),
                        concerning your access to and use of the Framel website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the &quot;Site&quot;).
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">2. Products and Services</h2>
                    <p>
                        We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site.
                        However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors,
                        and your electronic display may not accurately reflect the actual colors and details of the products.
                    </p>
                    <p className="mt-4">
                        All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason.
                        Prices for all products are subject to change.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">3. Purchases and Payment</h2>
                    <p>
                        We accept the following forms of payment:
                    </p>
                    <ul className="list-disc pl-5 mt-4 space-y-2">
                        <li>M-Pesa</li>
                        <li>Credit/Debit Cards (via supported gateways)</li>
                    </ul>
                    <p className="mt-4">
                        You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site.
                        You further agree to promptly update your account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">4. Return and Refund Policy</h2>
                    <p>
                        Due to the perishable nature of our products (fresh flowers), we generally do not accept returns.
                        However, if you are not satisfied with the quality of your arrangement, please contact us within 24 hours of delivery with photos of the product.
                        We will assess the situation and may offer a replacement or refund at our discretion.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">5. Delivery</h2>
                    <p>
                        Delivery times are estimates and commence from the date of shipping, rather than the date of order.
                        Delivery times are to be used as a guide only and are subject to the acceptance and approval of your order.
                        We are not responsible for any delays caused by destination customs clearance processes or other unforeseen circumstances.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">6. Contact Us</h2>
                    <p>
                        In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
                    </p>
                    <div className="mt-4 bg-gray-50 p-6 rounded-lg">
                        <p><strong>Email:</strong> legal@framel.co.ke</p>
                        <p><strong>Address:</strong> Westlands, Nairobi, Kenya</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
