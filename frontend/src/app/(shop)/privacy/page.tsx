export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-gray-600">Last updated: November 25, 2025</p>
            </div>

            <div className="prose prose-rose max-w-none text-gray-600 space-y-8">
                <section>
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">1. Introduction</h2>
                    <p>
                        Welcome to Framel ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                    <p>
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    </p>
                    <ul className="list-disc pl-5 mt-4 space-y-2">
                        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                        <li><strong>Financial Data:</strong> includes payment card details and M-Pesa transaction details.</li>
                        <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">3. How We Use Your Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-5 mt-4 space-y-2">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., delivering flowers).</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">4. Data Security</h2>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                        In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">5. Contact Us</h2>
                    <p>
                        If you have any questions about this privacy policy or our privacy practices, please contact us at:
                    </p>
                    <div className="mt-4 bg-gray-50 p-6 rounded-lg">
                        <p><strong>Email:</strong> privacy@framel.co.ke</p>
                        <p><strong>Address:</strong> Westlands, Nairobi, Kenya</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
