"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Brain,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Zap,
  BookOpen,
  Briefcase,
  Star,
} from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts"
import Link from "next/link"

// Mock industry data - in real app this would come from job market APIs
const INDUSTRY_REQUIREMENTS = {
  "Software Developer": {
    JavaScript: 85,
    React: 80,
    "Node.js": 75,
    Python: 70,
    Git: 90,
    SQL: 65,
    Testing: 70,
    "System Design": 60,
  },
  "Full Stack Developer": {
    JavaScript: 90,
    React: 85,
    "Node.js": 85,
    Python: 75,
    MongoDB: 70,
    Git: 90,
    Testing: 75,
    "System Design": 70,
    DevOps: 60,
  },
  "Data Scientist": {
    Python: 90,
    "Machine Learning": 85,
    SQL: 80,
    Statistics: 85,
    Pandas: 80,
    TensorFlow: 70,
    "Data Visualization": 75,
    R: 60,
  },
  "Frontend Developer": {
    JavaScript: 90,
    React: 85,
    CSS: 80,
    HTML: 85,
    TypeScript: 70,
    Git: 85,
    Testing: 70,
    "UI/UX Design": 65,
  },
}

const JOB_MARKET_TRENDS = [
  { skill: "React", demand: 95, growth: 12, avgSalary: "12-18 LPA" },
  { skill: "Python", demand: 92, growth: 15, avgSalary: "10-16 LPA" },
  { skill: "Node.js", demand: 88, growth: 10, avgSalary: "11-17 LPA" },
  { skill: "Machine Learning", demand: 85, growth: 25, avgSalary: "15-25 LPA" },
  { skill: "System Design", demand: 82, growth: 18, avgSalary: "18-30 LPA" },
  { skill: "DevOps", demand: 78, growth: 20, avgSalary: "14-22 LPA" },
]

export default function SkillAnalyzerPage() {
  const { user } = useAuth()
  const [selectedRole, setSelectedRole] = useState("Software Developer")
  const [currentSkills, setCurrentSkills] = useState({})
  const [analysisResults, setAnalysisResults] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("assessment")

  // Initialize current skills from user profile or defaults
  useEffect(() => {
    const defaultSkills = {}
    Object.keys(INDUSTRY_REQUIREMENTS[selectedRole]).forEach((skill) => {
      defaultSkills[skill] = Math.floor(Math.random() * 60) + 20 // Mock current levels
    })
    setCurrentSkills(defaultSkills)
  }, [selectedRole])

  const handleSkillChange = (skill, value) => {
    setCurrentSkills((prev) => ({
      ...prev,
      [skill]: value[0],
    }))
  }

  const runAnalysis = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const requirements = INDUSTRY_REQUIREMENTS[selectedRole]
    const gaps = {}
    const strengths = []
    const criticalGaps = []
    let totalScore = 0
    let maxScore = 0

    Object.entries(requirements).forEach(([skill, required]) => {
      const current = currentSkills[skill] || 0
      const gap = Math.max(0, required - current)
      gaps[skill] = {
        current,
        required,
        gap,
        percentage: (current / required) * 100,
      }

      if (gap <= 10) {
        strengths.push(skill)
      } else if (gap > 30) {
        criticalGaps.push(skill)
      }

      totalScore += current
      maxScore += required
    })

    const employabilityScore = Math.round((totalScore / maxScore) * 100)

    setAnalysisResults({
      employabilityScore,
      gaps,
      strengths,
      criticalGaps,
      recommendations: generateRecommendations(gaps, selectedRole),
      marketInsights: getMarketInsights(Object.keys(requirements)),
    })

    setIsAnalyzing(false)
    setActiveTab("results")
  }

  const generateRecommendations = (gaps, role) => {
    const recommendations = []

    Object.entries(gaps).forEach(([skill, data]) => {
      if (data.gap > 20) {
        recommendations.push({
          skill,
          priority: data.gap > 40 ? "High" : "Medium",
          action: `Complete advanced ${skill} course`,
          timeEstimate: `${Math.ceil(data.gap / 10)} weeks`,
          resources: [`${skill} Masterclass`, `${skill} Certification Program`, `${skill} Practice Projects`],
        })
      }
    })

    return recommendations.slice(0, 5) // Top 5 recommendations
  }

  const getMarketInsights = (skills) => {
    return JOB_MARKET_TRENDS.filter((trend) =>
      skills.some((skill) => skill.toLowerCase().includes(trend.skill.toLowerCase())),
    )
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const radarData = analysisResults
    ? Object.entries(analysisResults.gaps).map(([skill, data]) => ({
        skill: skill.length > 10 ? skill.substring(0, 10) + "..." : skill,
        current: data.current,
        required: data.required,
        fullSkill: skill,
      }))
    : []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/student/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Skill Gap Analyzer</h1>
                <p className="text-sm text-muted-foreground">Powered by PragyaSetu</p>
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
          <h2 className="text-3xl font-bold text-foreground mb-2">Discover Your Skill Gaps</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get AI-powered analysis of your skills compared to industry requirements and receive personalized
            recommendations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assessment">Skill Assessment</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysisResults}>
              Analysis Results
            </TabsTrigger>
            <TabsTrigger value="market" disabled={!analysisResults}>
              Market Insights
            </TabsTrigger>
            <TabsTrigger value="roadmap" disabled={!analysisResults}>
              Learning Roadmap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Target Role Selection</CardTitle>
                <CardDescription>Choose the role you want to analyze your skills against</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Target Role</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your target role" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(INDUSTRY_REQUIREMENTS).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Required Skills for {selectedRole}</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(INDUSTRY_REQUIREMENTS[selectedRole]).map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Skill Assessment</CardTitle>
                <CardDescription>Rate your current proficiency in each skill (0-100)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(INDUSTRY_REQUIREMENTS[selectedRole]).map(([skill, required]) => (
                    <div key={skill} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{skill}</Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Required: {required}</span>
                          <Badge variant="outline" className="text-xs">
                            Current: {currentSkills[skill] || 0}
                          </Badge>
                        </div>
                      </div>
                      <Slider
                        value={[currentSkills[skill] || 0]}
                        onValueChange={(value) => handleSkillChange(skill, value)}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button onClick={runAnalysis} disabled={isAnalyzing} size="lg" className="px-8">
                    {isAnalyzing ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Skills...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Run AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {analysisResults && (
              <>
                {/* Employability Score */}
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle>Your Employability Score</CardTitle>
                    <CardDescription>Based on industry requirements for {selectedRole}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center space-x-8">
                      <div className="text-center">
                        <div className={`text-6xl font-bold ${getScoreColor(analysisResults.employabilityScore)}`}>
                          {analysisResults.employabilityScore}
                        </div>
                        <p className="text-muted-foreground mt-2">Out of 100</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Strengths: {analysisResults.strengths.length}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">
                            Areas to improve:{" "}
                            {Object.keys(analysisResults.gaps).length - analysisResults.strengths.length}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-red-600" />
                          <span className="text-sm">Critical gaps: {analysisResults.criticalGaps.length}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Skill Radar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills Overview</CardTitle>
                      <CardDescription>Current vs Required skill levels</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="skill" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar name="Current" dataKey="current" stroke="#0891b2" fill="#0891b2" fillOpacity={0.3} />
                          <Radar name="Required" dataKey="required" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Detailed Gap Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Gap Analysis</CardTitle>
                      <CardDescription>Skill-by-skill breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-80 overflow-y-auto">
                        {Object.entries(analysisResults.gaps).map(([skill, data]) => (
                          <div key={skill} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{skill}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground">
                                  {data.current}/{data.required}
                                </span>
                                {data.gap > 20 && <AlertTriangle className="w-3 h-3 text-destructive" />}
                                {data.gap <= 10 && <CheckCircle className="w-3 h-3 text-green-600" />}
                              </div>
                            </div>
                            <Progress value={data.percentage} className="h-2" />
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                {data.gap > 0 ? `Gap: ${data.gap} points` : "Target achieved!"}
                              </span>
                              <span className={`font-medium ${getScoreColor(data.percentage)}`}>
                                {Math.round(data.percentage)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                    <CardDescription>Personalized action plan to improve your employability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysisResults.recommendations.map((rec, index) => (
                        <div key={index} className="p-4 rounded-lg border border-border bg-card">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-foreground">{rec.skill}</h4>
                            <Badge variant={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{rec.action}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Est. Time: {rec.timeEstimate}</span>
                            <Button variant="outline" size="sm">
                              Start Learning
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            {analysisResults && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Market Demand Analysis</CardTitle>
                    <CardDescription>Current job market trends for your skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisResults.marketInsights.map((insight, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{insight.skill}</h4>
                              <p className="text-sm text-muted-foreground">Salary: {insight.avgSalary}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm text-muted-foreground">Demand:</span>
                              <span className="font-medium text-green-600">{insight.demand}%</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">Growth:</span>
                              <span className="font-medium text-primary">+{insight.growth}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Industry Insights</CardTitle>
                    <CardDescription>Key trends and opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Hot Skills</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          React and Python are seeing highest demand with 15%+ growth
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <Briefcase className="w-4 h-4 text-secondary" />
                          <span className="text-sm font-medium">Job Opportunities</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Over 10,000 openings for {selectedRole} roles this month
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium">Salary Trends</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Average salaries increased by 12% compared to last year
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            {analysisResults && (
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Learning Roadmap</CardTitle>
                  <CardDescription>Step-by-step plan to achieve your career goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analysisResults.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-foreground">{rec.action}</h4>
                            <Badge variant={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Focus on {rec.skill} to close the skill gap. Estimated completion: {rec.timeEstimate}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {rec.resources.map((resource, i) => (
                              <Button key={i} variant="outline" size="sm">
                                <BookOpen className="w-3 h-3 mr-1" />
                                {resource}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <Button size="lg" asChild>
                      <Link href="/student/learning-roadmap">
                        Start Learning Journey
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
