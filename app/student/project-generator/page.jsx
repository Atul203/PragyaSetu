"use client"

import React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Lightbulb,
  Zap,
  Code,
  Database,
  Globe,
  Smartphone,
  Brain,
  Clock,
  Star,
  ExternalLink,
  Download,
  BookOpen,
  Target,
  Rocket,
} from "lucide-react"
import Link from "next/link"

// Mock project templates and data
const PROJECT_CATEGORIES = {
  "Web Development": {
    icon: Globe,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  "Mobile Development": {
    icon: Smartphone,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  "Data Science": {
    icon: Database,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  "AI/ML": {
    icon: Brain,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  "Full Stack": {
    icon: Code,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
}

const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"]

export default function ProjectGeneratorPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("generator")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProjects, setGeneratedProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

  // Form state for project generation
  const [formData, setFormData] = useState({
    skills: [],
    interests: "",
    difficulty: "",
    duration: "",
    category: "",
    projectType: "",
  })

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const generateProjects = async () => {
  if (!formData.category || !formData.difficulty) {
    alert("Please select category and difficulty");
    return;
  }
  setIsGenerating(true);
  try {
    const response = await fetch("/api/generate-projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("AI generation failed");
    }

    const data = await response.json();

    setGeneratedProjects(Array.isArray(data) ? data : data.projects || []);
    setActiveTab("results");
setSelectedProject(null);
  } catch (error) {
    console.error("Project generation error:", error);
    alert("AI project generation failed");
  } finally {
    setIsGenerating(false);
  }
};

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

  const AVAILABLE_SKILLS = [
    "React",
    "Node.js",
    "Python",
    "JavaScript",
    "TypeScript",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Express",
    "FastAPI",
    "Django",
    "Flask",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Chart.js",
    "D3.js",
    "Socket.io",
    "WebRTC",
    "Redis",
    "Docker",
    "AWS",
    "Firebase",
    "Next.js",
    "Vue.js",
    "Angular",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/student/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Project Generator</h1>
                <p className="text-sm text-muted-foreground">Generate personalized project ideas</p>
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
          <h2 className="text-3xl font-bold text-foreground mb-2">AI-Powered Project Ideas</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get personalized project recommendations based on your skills, interests, and career goals
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generator">Generate Projects</TabsTrigger>
            <TabsTrigger value="results" disabled={generatedProjects.length === 0}>
              Generated Ideas
            </TabsTrigger>
            <TabsTrigger value="templates">Project Templates</TabsTrigger>
            <TabsTrigger value="showcase">Student Showcase</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Preferences</CardTitle>
                <CardDescription>
                  Tell us about your skills and interests to get personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skills Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Your Skills</Label>
                  <p className="text-sm text-muted-foreground">Select the technologies you're comfortable with</p>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_SKILLS.map((skill) => (
                      <Badge
                        key={skill}
                        variant={formData.skills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="category">Project Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(PROJECT_CATEGORIES).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTY_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Duration and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="duration">Project Duration</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                        <SelectItem value="3-4 weeks">3-4 weeks</SelectItem>
                        <SelectItem value="5-8 weeks">5-8 weeks</SelectItem>
                        <SelectItem value="2+ months">2+ months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="projectType">Project Type</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, projectType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal Project</SelectItem>
                        <SelectItem value="portfolio">Portfolio Piece</SelectItem>
                        <SelectItem value="startup">Startup Idea</SelectItem>
                        <SelectItem value="learning">Learning Exercise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <Label htmlFor="interests">Interests & Goals</Label>
                  <Textarea
                    id="interests"
                    placeholder="Describe your interests, career goals, or specific problems you'd like to solve..."
                    value={formData.interests}
                    onChange={(e) => setFormData((prev) => ({ ...prev, interests: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="text-center">
                  <Button onClick={generateProjects} disabled={isGenerating} size="lg" className="px-8">
                    {isGenerating ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        Generating Projects...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Generate AI Projects
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {generatedProjects.length === 0 && (
  <div className="text-center py-10">
    <p className="text-muted-foreground">
      No projects generated yet. Go to Generate Projects tab.
    </p>
  </div>
)}

            {generatedProjects.length > 0 && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Your Personalized Projects</h3>
                  <p className="text-muted-foreground">AI-generated project ideas tailored to your skills and goals</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {generatedProjects.map((project, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {PROJECT_CATEGORIES[project.category] && (
                              <div className={`p-2 rounded-lg ${PROJECT_CATEGORIES[project.category].bgColor}`}>
                                {React.createElement(PROJECT_CATEGORIES[project.category].icon, {
                                  className: `w-4 h-4 ${PROJECT_CATEGORIES[project.category].color}`,
                                })}
                              </div>
                            )}
                            <Badge variant="outline">{project.category}</Badge>
                          </div>
                          <Badge className={getDifficultyColor(project.difficulty)}>{project.difficulty}</Badge>
                        </div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription className="text-sm">{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{project.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Code className="w-4 h-4" />
                              <span>{project.skills?.length || 0} skills</span>

                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-foreground mb-2">Key Technologies</h5>
                            <div className="flex flex-wrap gap-1">
                              {project.skills?.slice(0, 4).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {project.skills?.length > 4 && (
  <Badge variant="outline" className="text-xs">
    +{(project.skills?.length || 0) - 4} more
  </Badge>
)}

                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => setSelectedProject(project)}
                            >
                              View Details
                            </Button>
                            <Button size="sm" className="flex-1">
                              <Rocket className="w-3 h-3 mr-1" />
                              Start Project
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(PROJECT_CATEGORIES).map(([category, config]) => (
                <Card key={category} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      {React.createElement(config.icon, { className: `w-6 h-6 ${config.color}` })}
                    </div>
                    <CardTitle>{category}</CardTitle>
                    <CardDescription>Ready-to-use project templates and starter code</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Templates available:</span>
                          <span className="font-medium">
  {generatedProjects.filter((p) => p.category === category).length}
</span>

                        </div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Browse Templates
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="showcase" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Project Showcase</CardTitle>
                <CardDescription>Get inspired by projects built by other students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Smart Campus Navigation",
                      author: "Priya Sharma",
                      college: "IIT Delhi",
                      tech: ["React Native", "Firebase", "Google Maps"],
                      rating: 4.8,
                    },
                    {
                      title: "AI Study Planner",
                      author: "Rahul Kumar",
                      college: "NIT Trichy",
                      tech: ["Python", "TensorFlow", "React"],
                      rating: 4.9,
                    },
                    {
                      title: "Local Business Directory",
                      author: "Sneha Patel",
                      college: "BITS Pilani",
                      tech: ["Next.js", "PostgreSQL", "Stripe"],
                      rating: 4.7,
                    },
                  ].map((project, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card">
                      <h4 className="font-medium text-foreground mb-2">{project.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        by {project.author} • {project.college}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{project.rating}</span>
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
          </TabsContent>
        </Tabs>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedProject.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{selectedProject.description}</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedProject(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{selectedProject.difficulty}</div>
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{selectedProject.duration}</div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{selectedProject.skills?.length || 0}</div>
                    <p className="text-sm text-muted-foreground">Technologies</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{selectedProject.features?.length || 0}</div>
                    <p className="text-sm text-muted-foreground">Features</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {selectedProject.features?.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">Learning Outcomes</h4>
                  <ul className="space-y-2">
                    {selectedProject.learningOutcomes?.map((outcome, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-secondary" />
                        <span className="text-sm">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.skills?.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button className="flex-1">
                    <Rocket className="w-4 h-4 mr-2" />
                    Start This Project
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
