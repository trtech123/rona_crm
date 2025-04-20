import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Github, Mail, Twitter } from "lucide-react"

export default function NewsletterSignup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <Card className="mx-auto w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-purple-600 p-2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M4.1 19c-1.2 0-2.1-.9-2.1-2.1 0-1.2.9-2.1 2.1-2.1h15.8c1.2 0 2.1.9 2.1 2.1 0 1.2-.9 2.1-2.1 2.1H4.1zM4.1 13.1c-1.2 0-2.1-.9-2.1-2.1 0-1.2.9-2.1 2.1-2.1h15.8c1.2 0 2.1.9 2.1 2.1 0 1.2-.9 2.1-2.1 2.1H4.1zM4.1 7.2c-1.2 0-2.1-.9-2.1-2.1 0-1.2.9-2.1 2.1-2.1h15.8c1.2 0 2.1.9 2.1 2.1 0 1.2-.9 2.1-2.1 2.1H4.1z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Subscribe to Pulse</h2>
          <p className="text-muted-foreground">Get weekly insights on productivity, design, and technology</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button variant="outline" className="w-full">
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
            <Button variant="outline" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="space-y-2">
            <Input type="email" placeholder="name@example.com" className="w-full" />
          </div>

          <Button className="w-full bg-purple-600 hover:bg-purple-700">Subscribe Now</Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Help
            </a>
          </div>
          <p className="text-center text-xs text-muted-foreground">We respect your privacy. Unsubscribe at any time.</p>
        </CardFooter>
      </Card>
    </div>
  )
}

