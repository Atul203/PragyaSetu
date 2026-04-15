"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ThemeToggle from "@/components/ThemeToggle"
import { ArrowRight, Brain, Target, TrendingUp, Users, BookOpen, Briefcase } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        if (user.profileCompleted) {
          router.push("/student/dashboard")
        } else {
          router.push("/student/profile-setup")
        }
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">PragyaSetu</h1>
          </div>

          {/* Right side - Theme Toggle + Auth Buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle /> {/* 🌙 Added Theme Toggle here */}
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          AI-Powered Career Platform
        </Badge>
        <h1 className="text-5xl font-bold text-balance mb-6 text-foreground">
          Bridge the Gap Between
          <span className="text-primary"> Learning </span>
          and
          <span className="text-secondary"> Career Success</span>
        </h1>
        <p className="text-xl text-muted-foreground text-balance mb-8 max-w-3xl mx-auto">
          An AI lattice interlinking student cognition with professional ecosystems. From informed curiosity to
          impactful careers - making Indian students job-ready before graduation.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8">
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              View Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Complete Employability Ecosystem</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform provides everything students need to become industry-ready
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Target className="w-12 h-12 text-primary mb-4" />
              <CardTitle>AI Skill Gap Analysis</CardTitle>
              <CardDescription>
                Compare your skills with industry requirements and get personalized improvement recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Real-time job market analysis</li>
                <li>• Employability score tracking</li>
                <li>• Industry-specific skill mapping</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-secondary/50 transition-colors">
            <CardHeader>
              <BookOpen className="w-12 h-12 text-secondary mb-4" />
              <CardTitle>Personalized Learning</CardTitle>
              <CardDescription>
                Get customized learning roadmaps based on your career goals and skill gaps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• AI-curated course recommendations</li>
                <li>• Progress tracking & milestones</li>
                <li>• Industry-aligned certifications</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <Briefcase className="w-12 h-12 text-accent mb-4" />
              <CardTitle>Industry Projects</CardTitle>
              <CardDescription>
                Work on real-world projects and gain practical experience through micro-internships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• AI-generated project ideas</li>
                <li>• Industry mentor guidance</li>
                <li>• Portfolio building support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-chart-1/50 transition-colors">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-chart-1 mb-4" />
              <CardTitle>Real-time Analytics</CardTitle>
              <CardDescription>
                Track your progress with comprehensive dashboards and employability metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Skill progression tracking</li>
                <li>• Market demand insights</li>
                <li>• Career readiness score</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-chart-2/50 transition-colors">
            <CardHeader>
              <Users className="w-12 h-12 text-chart-2 mb-4" />
              <CardTitle>Mock Interviews</CardTitle>
              <CardDescription>
                Practice with AI-powered interview simulations and get detailed feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Industry-specific questions</li>
                <li>• Performance analytics</li>
                <li>• Improvement suggestions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-chart-3/50 transition-colors">
            <CardHeader>
              <Brain className="w-12 h-12 text-chart-3 mb-4" />
              <CardTitle>Career Guidance</CardTitle>
              <CardDescription>
                Get AI-powered career recommendations based on your skills and market trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Personalized job matching</li>
                <li>• Career path planning</li>
                <li>• Industry trend analysis</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your Career?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already building their future with PragyaSetu
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8">
              Start Free Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">PragyaSetu</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 PragyaSetu. Empowering students for success.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
