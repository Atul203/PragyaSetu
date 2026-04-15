"use client"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Star,
  Award,
  Target,
  ArrowRight,
  Calendar,
  ExternalLink,
  Download,
} from "lucide-react"
import Link from "next/link"

// Mock learning roadmap data
const LEARNING_ROADMAPS = {
  "React Development": {
    description: "Master React.js from basics to advanced concepts",
    duration: "8 weeks",
    difficulty: "Intermediate",
    totalModules: 6,
    estimatedHours: 40,
    modules: [
      {
        id: 1,
        title: "React Fundamentals",
        description: "Learn JSX, components, props, and state",
        duration: "1 week",
        lessons: [
          { id: 1, title: "Introduction to React", duration: "30 min", completed: true },
          { id: 2, title: "JSX and Components", duration: "45 min", completed: true },
          { id: 3, title: "Props and State", duration: "60 min", completed: false },
          { id: 4, title: "Event Handling", duration: "45 min", completed: false },
        ],
        project: "Build a Todo App",
        completed: false,
      },
      {
        id: 2,
        title: "React Hooks",
        description: "Master useState, useEffect, and custom hooks",
        duration: "1.5 weeks",
        lessons: [
          { id: 5, title: "useState Hook", duration: "40 min", completed: false },
          { id: 6, title: "useEffect Hook", duration: "50 min", completed: false },
          { id: 7, title: "Custom Hooks", duration: "60 min", completed: false },
          { id: 8, title: "Hook Best Practices", duration: "30 min", completed: false },
        ],
        project: "Weather App with Hooks",
        completed: false,
      },
      {
        id: 3,
        title: "State Management",
        description: "Learn Context API and Redux",
        duration: "2 weeks",
        lessons: [
          { id: 9, title: "Context API", duration: "45 min", completed: false },
          { id: 10, title: "Redux Basics", duration: "60 min", completed: false },
          { id: 11, title: "Redux Toolkit", duration: "50 min", completed: false },
          { id: 12, title: "Async Actions", duration: "40 min", completed: false },
        ],
        project: "E-commerce Cart System",
        completed: false,
      },
      {
        id: 4,
        title: "React Router",
        description: "Navigation and routing in React applications",
        duration: "1 week",
        lessons: [
          { id: 13, title: "Basic Routing", duration: "35 min", completed: false },
          { id: 14, title: "Dynamic Routes", duration: "40 min", completed: false },
          { id: 15, title: "Route Guards", duration: "45 min", completed: false },
        ],
        project: "Multi-page Portfolio",
        completed: false,
      },
      {
        id: 5,
        title: "Testing React Apps",
        description: "Unit testing and integration testing",
        duration: "1.5 weeks",
        lessons: [
          { id: 16, title: "Jest Basics", duration: "40 min", completed: false },
          { id: 17, title: "React Testing Library", duration: "50 min", completed: false },
          { id: 18, title: "Testing Hooks", duration: "45 min", completed: false },
        ],
        project: "Test Suite for Todo App",
        completed: false,
      },
      {
        id: 6,
        title: "Advanced React",
        description: "Performance optimization and advanced patterns",
        duration: "1 week",
        lessons: [
          { id: 19, title: "React.memo and useMemo", duration: "45 min", completed: false },
          { id: 20, title: "Code Splitting", duration: "40 min", completed: false },
          { id: 21, title: "Error Boundaries", duration: "35 min", completed: false },
        ],
        project: "Optimized Dashboard App",
        completed: false,
      },
    ],
  },
}

const RECOMMENDED_RESOURCES = [
  {
    title: "React Official Documentation",
    type: "Documentation",
    url: "https://react.dev",
    rating: 5,
    free: true,
  },
  {
    title: "React - The Complete Guide",
    type: "Course",
    provider: "Udemy",
    rating: 4.8,
    price: "₹3,499",
    free: false,
  },
  {
    title: "freeCodeCamp React Course",
    type: "Course",
    provider: "freeCodeCamp",
    rating: 4.7,
    free: true,
  },
  {
    title: "React Patterns",
    type: "Book",
    author: "Michael Chan",
    rating: 4.6,
    price: "₹1,999",
    free: false,
  },
]

const MILESTONES = [
  {
    id: 1,
    title: "React Basics Mastery",
    description: "Complete first 2 modules and build 2 projects",
    targetDate: "Week 3",
    reward: "React Fundamentals Certificate",
    completed: false,
  },
  {
    id: 2,
    title: "State Management Expert",
    description: "Master Context API and Redux",
    targetDate: "Week 5",
    reward: "State Management Badge",
    completed: false,
  },
  {
    id: 3,
    title: "Full Stack Ready",
    description: "Complete all modules and final project",
    targetDate: "Week 8",
    reward: "React Developer Certificate",
    completed: false,
  },
]

export default function LearningRoadmapPage() {
  const { user } = useAuth()
  const [selectedRoadmap, setSelectedRoadmap] = useState("React Development")
  const [activeTab, setActiveTab] = useState("roadmap")
  const [completedLessons, setCompletedLessons] = useState(new Set())

  const roadmap = LEARNING_ROADMAPS[selectedRoadmap]

  const toggleLessonCompletion = (lessonId) => {
    setCompletedLessons((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId)
      } else {
        newSet.add(lessonId)
      }
      return newSet
    })
  }

  const calculateProgress = () => {
    const totalLessons = roadmap.modules.reduce((acc, module) => acc + module.lessons.length, 0)
    const completedCount = roadmap.modules.reduce(
      (acc, module) =>
        acc + module.lessons.filter((lesson) => lesson.completed || completedLessons.has(lesson.id)).length,
      0,
    )
    return Math.round((completedCount / totalLessons) * 100)
  }

  const getModuleProgress = (module) => {
    const completedCount = module.lessons.filter((lesson) => lesson.completed || completedLessons.has(lesson.id)).length
    return Math.round((completedCount / module.lessons.length) * 100)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/student/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Learning Roadmap</h1>
                <p className="text-sm text-muted-foreground">Personalized Learning Path</p>
              </div>
            </Link>
          </div>
          <Button variant="outline" asChild>
            <Link href="/student/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Your Personalized Learning Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Follow this AI-curated roadmap to master the skills you need for your career goals
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedRoadmap}</CardTitle>
                <CardDescription className="text-base mt-2">{roadmap.description}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{calculateProgress()}%</div>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{roadmap.duration}</div>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{roadmap.totalModules}</div>
                <p className="text-sm text-muted-foreground">Modules</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{roadmap.estimatedHours}h</div>
                <p className="text-sm text-muted-foreground">Est. Hours</p>
              </div>
              <div className="text-center">
                <Badge className={getDifficultyColor(roadmap.difficulty)}>{roadmap.difficulty}</Badge>
              </div>
            </div>
            <Progress value={calculateProgress()} className="h-3" />
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="roadmap">Learning Path</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap" className="space-y-6">
            <div className="space-y-6">
              {roadmap.modules.map((module, index) => (
                <Card key={module.id} className={`${index === 0 ? "border-primary" : ""}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                          {module.id}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{module.duration}</span>
                        </div>
                        <div className="text-sm font-medium text-primary">{getModuleProgress(module)}% Complete</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                          <Checkbox
                            checked={lesson.completed || completedLessons.has(lesson.id)}
                            onCheckedChange={() => toggleLessonCompletion(lesson.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-sm font-medium ${
                                  lesson.completed || completedLessons.has(lesson.id)
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {lesson.title}
                              </span>
                              <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-secondary" />
                        <span className="font-medium text-foreground">Project: {module.project}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Start Project
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <Progress value={getModuleProgress(module)} className="h-2 mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Learning Resources</CardTitle>
                <CardDescription>Curated resources to supplement your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {RECOMMENDED_RESOURCES.map((resource, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-foreground">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {resource.provider || resource.author} • {resource.type}
                          </p>
                        </div>
                        {resource.free ? (
                          <Badge variant="secondary">Free</Badge>
                        ) : (
                          <Badge variant="outline">{resource.price}</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(resource.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">{resource.rating}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Materials</CardTitle>
                <CardDescription>Download additional resources and cheat sheets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "React Hooks Cheat Sheet", type: "PDF", size: "2.3 MB" },
                    { title: "Component Patterns Guide", type: "PDF", size: "1.8 MB" },
                    { title: "Testing Best Practices", type: "PDF", size: "3.1 MB" },
                  ].map((material, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{material.title}</h4>
                        <Badge variant="outline">{material.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{material.size}</span>
                        <Button variant="ghost" size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Milestones</CardTitle>
                <CardDescription>Track your progress with these key achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {MILESTONES.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-start space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          milestone.completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {milestone.completed ? <CheckCircle className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{milestone.title}</h4>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{milestone.targetDate}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">Reward: {milestone.reward}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{calculateProgress()}%</div>
                    <Progress value={calculateProgress()} className="h-3 mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {roadmap.modules.filter((m) => getModuleProgress(m) === 100).length} of {roadmap.totalModules}{" "}
                      modules completed
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time Invested</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-secondary mb-2">12h</div>
                    <p className="text-sm text-muted-foreground mb-4">This week</p>
                    <div className="text-2xl font-medium text-foreground">28h</div>
                    <p className="text-sm text-muted-foreground">Total time</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent mb-2">7</div>
                    <p className="text-sm text-muted-foreground mb-4">Days in a row</p>
                    <div className="flex justify-center space-x-1">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-accent rounded-full" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Module Progress Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roadmap.modules.map((module) => (
                    <div key={module.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{module.title}</span>
                        <span className="text-sm text-muted-foreground">{getModuleProgress(module)}%</span>
                      </div>
                      <Progress value={getModuleProgress(module)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}