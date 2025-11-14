/**
 * Home Page
 * Landing page for Framel flower shop
 */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-serif font-bold text-primary mb-4 animate-fade-in">
            Welcome to Framel
          </h1>
          <p className="text-xl text-text-secondary mb-8 animate-slide-up">
            Fresh Flowers Delivered with Love
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif text-text-primary mb-4">
              Phase 1: Frontend Setup Complete! ✨
            </h2>
            <div className="text-left space-y-3 text-text-secondary">
              <div className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>Next.js 14 with App Router configured</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>Tailwind CSS with custom Framel color palette</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>TypeScript types for all entities defined</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>Firebase authentication configured</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>API client with interceptors</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>Auth & Cart context providers</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span>Form validation with Zod schemas</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-primary/20">
              <p className="text-sm text-text-secondary">
                <strong className="text-accent">Next Steps:</strong> Run{' '}
                <code className="bg-muted px-2 py-1 rounded text-xs">npm install</code> to
                install dependencies, then start building components!
              </p>
            </div>
          </div>

          {/* Color Palette Showcase */}
          <div className="mt-12">
            <h3 className="text-2xl font-serif text-text-primary mb-6">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="w-full h-20 bg-primary rounded mb-2"></div>
                <p className="text-sm font-semibold">Blush Pink</p>
                <p className="text-xs text-text-secondary">#E89FAE</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="w-full h-20 bg-secondary rounded mb-2"></div>
                <p className="text-sm font-semibold">Sage Green</p>
                <p className="text-xs text-text-secondary">#A8C3A6</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="w-full h-20 bg-accent rounded mb-2"></div>
                <p className="text-sm font-semibold">Gold</p>
                <p className="text-xs text-text-secondary">#D9B26F</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="w-full h-20 bg-success rounded mb-2"></div>
                <p className="text-sm font-semibold">Muted Green</p>
                <p className="text-xs text-text-secondary">#7BAE7F</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
