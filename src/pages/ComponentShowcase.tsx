// src/pages/ComponentShowcase.tsx
import { useState } from 'react'
import { Button, Input, Card } from '../components/ui'

export const ComponentShowcase = () => {
  const [isLoading, setIsLoading] = useState(false)

  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-ink">
          Component Showcase
        </h1>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-ink">Buttons</h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>

            <div>
              <Button 
                variant="primary"
                isLoading={isLoading} 
                onClick={simulateLoading}
              >
                Click to Load
              </Button>
            </div>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-ink">Inputs</h2>
          
          <div className="space-y-4 max-w-md">
            <Input
              label="Basic Input"
              placeholder="Type something..."
            />
            
            <Input
              label="With Error"
              placeholder="Error state"
              error="This field is required"
            />
            
            <Input
              label="Disabled Input"
              placeholder="Can't type here"
              disabled
            />
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-ink">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-medium mb-2">Basic Card</h3>
              <p className="text-ink-muted">
                This is a simple card component.
              </p>
            </Card>

            <Card className="bg-accent-dim">
              <h3 className="text-lg font-medium mb-2">Colored Card</h3>
              <p className="text-ink-muted">
                Cards can have different backgrounds.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-medium mb-4">Card with Button</h3>
              <p className="text-ink-muted mb-4">
                Cards can contain other components.
              </p>
              <Button variant="primary">Click Me</Button>
            </Card>

            <Card>
              <h3 className="text-lg font-medium mb-4">Card with Input</h3>
              <Input placeholder="Type here..." />
            </Card>
          </div>
        </section>

        {/* Form Example */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-ink">Form Example</h2>
          
          <Card>
            <form className="space-y-4 max-w-md">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
              />
              <Button variant="primary" className="w-full">
                Sign In
              </Button>
            </form>
          </Card>
        </section>
      </div>
    </div>
  )
}