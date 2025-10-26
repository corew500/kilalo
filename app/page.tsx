import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-foreground">Welcome to Kilalo</h1>
          <p className="text-xl text-muted-foreground">
            Your trusted partner for business solutions
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-teal hover:bg-teal-700">
            Get Started
          </Button>
          <Button size="lg" variant="secondary" className="bg-orange hover:bg-orange-600">
            Learn More
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-teal">Strategy</CardTitle>
              <CardDescription>Strategic business planning</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We help you define and execute winning strategies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-orange">Execution</CardTitle>
              <CardDescription>Flawless implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Turn plans into reality with our execution expertise.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-forest">Growth</CardTitle>
              <CardDescription>Sustainable success</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Build lasting value and achieve your goals.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
