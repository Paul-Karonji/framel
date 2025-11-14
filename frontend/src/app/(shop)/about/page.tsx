import { Heart, Truck, Shield, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-text-primary mb-6">
            About Framel
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            We&apos;re passionate about bringing the beauty of fresh flowers to your doorstep,
            one bouquet at a time.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-6">
              Our Story
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Framel was born from a simple belief: everyone deserves to experience the joy that
              fresh flowers bring. Founded in Nairobi, we&apos;ve grown from a small flower shop into
              a trusted online destination for premium floral arrangements.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Every bouquet we create is carefully handpicked and arranged with love, ensuring
              that your special moments are celebrated with the freshest, most beautiful flowers
              available.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-12 text-center">
            Why Choose Framel
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-primary/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Fresh Quality</h3>
                <p className="text-sm text-text-secondary">
                  Hand-picked flowers guaranteed fresh for 7+ days
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Truck className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Fast Delivery</h3>
                <p className="text-sm text-text-secondary">
                  Same-day delivery available across Nairobi
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Secure Payment</h3>
                <p className="text-sm text-text-secondary">
                  Safe M-Pesa integration for your peace of mind
                </p>
              </CardContent>
            </Card>

            <Card className="border-success/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Expert Care</h3>
                <p className="text-sm text-text-secondary">
                  Professional florists with years of experience
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Have questions? We&apos;d love to hear from you. Reach out to us anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:hello@framel.co.ke" className="text-primary hover:text-primary-dark">
              hello@framel.co.ke
            </a>
            <span className="hidden sm:inline text-text-secondary">|</span>
            <a href="tel:+254700000000" className="text-primary hover:text-primary-dark">
              +254 700 000 000
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
