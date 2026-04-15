"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  BookOpen,
  Briefcase,
  Award,
  Brain,
  ChevronRight,
  Star,
  Calendar,
  Menu,
  X,
  BarChart3,
  Target,
  Lightbulb,
  User,
  RefreshCw,
  ExternalLink,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Zap,
  Activity,
  FileText,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import Link from "next/link"
const MOCK_INTERVIEW_URL = "https://ai-mock-interviews-86qb2xjhl-atul203s-projects.vercel.app/"
// Mock data - in real app this would come from Firebase/API
const mockUserData = {
  employabilityScore: 72,
  skillGaps: [
    { skill: "React", current: 60, required: 85, gap: 25 },
    { skill: "Node.js", current: 45, required: 80, gap: 35 },
    { skill: "System Design", current: 30, required: 75, gap: 45 },
    { skill: "Data Structures", current: 70, required: 90, gap: 20 },
  ],
  recentActivities: [
    { type: "course", title: "Completed React Advanced Patterns", date: "2 days ago", points: 50 },
    { type: "project", title: "Built E-commerce Dashboard", date: "1 week ago", points: 100 },
    { type: "assessment", title: "JavaScript Skills Assessment", date: "1 week ago", points: 75 },
    { type: "internship", title: "Applied to Frontend Internship", date: "2 weeks ago", points: 25 },
  ],
  learningPath: [
    { title: "Master React Ecosystem", progress: 65, totalCourses: 8, completed: 5 },
    { title: "Backend Development with Node.js", progress: 30, totalCourses: 12, completed: 4 },
    { title: "System Design Fundamentals", progress: 15, totalCourses: 6, completed: 1 },
  ],
  upcomingDeadlines: [
    { title: "React Certification Exam", date: "Dec 15, 2024", type: "exam" },
    { title: "Portfolio Project Submission", date: "Dec 20, 2024", type: "project" },
    { title: "Mock Interview Session", date: "Dec 22, 2024", type: "interview" },
  ],
  skillRadarData: [
    { skill: "Frontend", current: 75, required: 85 },
    { skill: "Backend", current: 45, required: 80 },
    { skill: "Database", current: 60, required: 75 },
    { skill: "DevOps", current: 35, required: 70 },
    { skill: "Testing", current: 50, required: 80 },
    { skill: "Soft Skills", current: 80, required: 85 },
  ],
  progressData: [
    { month: "Aug", score: 45 },
    { month: "Sep", score: 52 },
    { month: "Oct", score: 61 },
    { month: "Nov", score: 68 },
    { month: "Dec", score: 72 },
  ],
}

export default function StudentDashboard() {
  const { user, logout, loading} = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ✅ Redirect if user not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login")
    }
  }, [user, loading, router])

  const { courses, opportunities, jobs, trends, loading: realtimeLoading, error, lastUpdated, refresh } =
    useRealtimeData(user?.skills || [], 300000)

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getRealtimeStatus = () => {
    if (realtimeLoading) return { color: "text-yellow-500", text: "Updating..." }
    if (error) return { color: "text-red-500", text: "Connection Error" }
    if (lastUpdated) {
      const minutes = Math.floor((Date.now() - lastUpdated.getTime()) / 60000)
      return { color: "text-green-500", text: `Updated ${minutes}m ago` }
    }
    return { color: "text-gray-500", text: "No data" }
  }

  const realtimeStatus = getRealtimeStatus()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-6 h-6 animate-spin text-primary mr-2" />
        <span>Loading dashboard...</span>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center animate-float">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PragyaSetu
              </h1>
              <p className="text-sm text-muted-foreground">Student Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${realtimeStatus.color.replace("text-", "bg-")} animate-pulse`} />
              <span className={`text-xs ${realtimeStatus.color}`}>{realtimeStatus.text}</span>
              <Button variant="ghost" size="sm" onClick={refresh} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {user?.course} • {user?.college}
              </p>
            </div>
            <Button variant="" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 glass border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            <Link
              href="/student/dashboard"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            {/* 🟢 AI Mock Interview */}
<a
  href={MOCK_INTERVIEW_URL}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-between px-3 py-2 rounded-lg 
             bg-gradient-to-r from-accent/10 to-primary/10 
             hover:from-accent/20 hover:to-primary/20
             text-foreground border border-accent/30 transition-colors"
>
  <div className="flex items-ceoutlinenter space-x-3">
    <Brain className="w-5 h-5 text-accent" />
    <span>AI Mock Interview</span>
  </div>
  <ExternalLink className="w-4 h-4 text-muted-foreground" />
</a>

            <Link
              href="/student/resume-parser"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/50 text-foreground transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span>Resume Parser</span>
            </Link>
            <Link
              href="/student/skill-analyzer"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/50 text-foreground transition-colors"
            >
              <Target className="w-5 h-5" />
              <span>Skill Analyzer</span>
            </Link>
            <Link
              href="/student/learning-roadmap"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/50 text-foreground transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Learning Roadmap</span>
            </Link>
            <Link
              href="/student/project-generator"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/50 text-foreground transition-colors"
            >
              <Lightbulb className="w-5 h-5" />
              <span>Project Generator</span>
            </Link>
            <Link
              href="/student/profile-setup"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/50 text-foreground transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Profile Settings</span>
            </Link>
          </nav>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name?.split(" ")[0]}!
              </h2>
              <p className="text-muted-foreground text-lg">
                Track your progress and continue building your career readiness
              </p>
            </div>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Employability Score</CardTitle>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-3xl font-bold ${getScoreColor(user?.employabilityScore || mockUserData.employabilityScore)}`}
                    >
                      {user?.employabilityScore || mockUserData.employabilityScore}
                    </span>
                    <span className="text-muted-foreground">/100</span>
                  </div>
                  <div className="mt-2">
                    <Progress value={user?.employabilityScore || mockUserData.employabilityScore} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">+4 points this month</p>
                </CardContent>
              </Card>

              <Card className="glass hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Live Opportunities</CardTitle>
                    <Briefcase className="w-4 h-4 text-secondary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{opportunities.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {opportunities.filter((o) => o.featured).length} featured
                  </p>
                </CardContent>
              </Card>

              <Card className="glass hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Recommended Courses</CardTitle>
                    <BookOpen className="w-4 h-4 text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{courses.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Avg rating:{" "}
                    {courses.length > 0
                      ? (courses.reduce((acc, c) => acc + c.rating, 0) / courses.length).toFixed(1)
                      : "N/A"}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Job Matches</CardTitle>
                    <Award className="w-4 h-4 text-chart-1" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{jobs.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {jobs.filter((j) => j.remote).length} remote positions
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 glass">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="realtime">Live Feed</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="learning">Learning</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Progress Chart */}
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Employability Progress</CardTitle>
                      <CardDescription>Your score improvement over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={mockUserData.progressData}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#8b5cf6"
                            fillOpacity={1}
                            fill="url(#colorScore)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Market Trends */}
                  {trends && (
                    <Card className="glass">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Market Trends
                        </CardTitle>
                        <CardDescription>Hot skills in demand right now</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {trends.hotSkills.slice(0, 5).map((skill, index) => (
                            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${index === 0 ? "bg-green-500" : index === 1 ? "bg-blue-500" : "bg-gray-400"}`}
                                />
                                <span className="font-medium">{skill.skill}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-green-600">{skill.growth}</span>
                                <Badge variant="secondary">{skill.demand}%</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Your latest learning activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockUserData.recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              activity.type === "course"
                                ? "bg-primary"
                                : activity.type === "project"
                                  ? "bg-secondary"
                                  : activity.type === "assessment"
                                    ? "bg-accent"
                                    : "bg-chart-1"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                          </div>
                          <Badge variant="secondary">+{activity.points} pts</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Deadlines */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                    <CardDescription>Don't miss these important dates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {mockUserData.upcomingDeadlines.map((deadline, index) => (
                        <div key={index} className="p-4 rounded-lg border border-border bg-card">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">{deadline.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{deadline.date}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {deadline.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="realtime" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Live Job Opportunities */}
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Live Job Opportunities
                      </CardTitle>
                      <CardDescription>Real-time job matches from Indeed & Unstop</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {loading ? (
                          <div className="flex items-center justify-center py-8">
                            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                            <span className="ml-2">Loading opportunities...</span>
                          </div>
                        ) : (
                          opportunities.slice(0, 6).map((opp, index) => (
                            <div
                              key={index}
                              className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-foreground">{opp.title}</h4>
                                  <p className="text-sm text-muted-foreground">{opp.company}</p>
                                </div>
                                {opp.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {opp.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {opp.stipend || opp.salary || opp.prize}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {opp.applicants} applicants
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {opp.skills.slice(0, 3).map((skill, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                                <Button size="sm" variant="outline" asChild>
                                  <a href={opp.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Apply
                                  </a>
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live Course Recommendations */}
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        Course Recommendations
                      </CardTitle>
                      <CardDescription>Personalized courses from Coursera & more</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {loading ? (
                          <div className="flex items-center justify-center py-8">
                            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                            <span className="ml-2">Loading courses...</span>
                          </div>
                        ) : (
                          courses.slice(0, 6).map((course, index) => (
                            <div
                              key={index}
                              className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-foreground">{course.title}</h4>
                                  <p className="text-sm text-muted-foreground">{course.university}</p>
                                </div>
                                <Badge variant="secondary">{course.level}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  {course.rating}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {course.students}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {course.duration}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {course.skills.slice(0, 3).map((skill, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-accent">{course.price}</span>
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={course.url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      Enroll
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Salary Trends */}
                {trends && (
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Salary Trends by Role</CardTitle>
                      <CardDescription>Current market rates for different positions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={Object.entries(trends.salaryTrends).map(([role, data]) => ({
                            role: role.replace(" ", "\n"),
                            min: data.min / 1000,
                            max: data.max / 1000,
                            growth: Number.parseFloat(data.growth.replace("%", "")),
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="role" />
                          <YAxis />
                          <Tooltip
                            formatter={(value, name) => [`$${value}k`, name === "min" ? "Min Salary" : "Max Salary"]}
                          />
                          <Bar dataKey="min" fill="#8b5cf6" />
                          <Bar dataKey="max" fill="#6366f1" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Skill Radar Chart */}
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Skills Overview</CardTitle>
                      <CardDescription>Current vs Required skill levels</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={mockUserData.skillRadarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="skill" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar name="Current" dataKey="current" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                          <Radar name="Required" dataKey="required" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Skill Gaps */}
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Priority Skill Gaps</CardTitle>
                      <CardDescription>Skills that need immediate attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockUserData.skillGaps.map((skill, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-foreground">{skill.skill}</span>
                              <span className="text-xs text-muted-foreground">
                                {skill.current}% / {skill.required}%
                              </span>
                            </div>
                            <div className="space-y-1">
                              <Progress value={skill.current} className="h-2" />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Current Level</span>
                                <span className="text-destructive">Gap: {skill.gap}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-4" asChild>
                        <Link href="/student/skill-analyzer">
                          Analyze All Skills
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="learning" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {mockUserData.learningPath.map((path, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{path.title}</CardTitle>
                        <CardDescription>
                          {path.completed} of {path.totalCourses} courses completed
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">Progress</span>
                              <span className="text-sm font-medium">{path.progress}%</span>
                            </div>
                            <Progress value={path.progress} className="h-2" />
                          </div>
                          <Button variant="outline" className="w-full bg-transparent">
                            Continue Learning
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recommended Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended for You</CardTitle>
                    <CardDescription>AI-curated courses based on your skill gaps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          title: "Advanced React Patterns",
                          provider: "Tech Academy",
                          rating: 4.8,
                          duration: "6 weeks",
                        },
                        { title: "Node.js Masterclass", provider: "Code Institute", rating: 4.9, duration: "8 weeks" },
                        {
                          title: "System Design Interview",
                          provider: "Interview Prep",
                          rating: 4.7,
                          duration: "4 weeks",
                        },
                      ].map((course, index) => (
                        <div key={index} className="p-4 rounded-lg border border-border bg-card">
                          <h4 className="font-medium text-foreground mb-2">{course.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{course.provider}</p>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{course.rating}</span>
                            </div>
                            <span className="text-muted-foreground">{course.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Projects</CardTitle>
                      <CardDescription>Projects you're currently working on</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            title: "E-commerce Dashboard",
                            progress: 75,
                            deadline: "Dec 20, 2024",
                            tech: ["React", "Node.js"],
                          },
                          {
                            title: "Task Management App",
                            progress: 45,
                            deadline: "Jan 15, 2025",
                            tech: ["Vue.js", "Firebase"],
                          },
                        ].map((project, index) => (
                          <div key={index} className="p-4 rounded-lg border border-border bg-card">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-foreground">{project.title}</h4>
                              <span className="text-sm text-muted-foreground">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2 mb-3" />
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-1">
                                {project.tech.map((tech, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{project.deadline}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Project Suggestions</CardTitle>
                      <CardDescription>AI-generated project ideas for your skill level</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            title: "Real-time Chat Application",
                            difficulty: "Intermediate",
                            skills: ["WebSocket", "React", "Node.js"],
                          },
                          {
                            title: "Machine Learning Dashboard",
                            difficulty: "Advanced",
                            skills: ["Python", "TensorFlow", "React"],
                          },
                          {
                            title: "Mobile Banking App",
                            difficulty: "Advanced",
                            skills: ["React Native", "Security", "APIs"],
                          },
                        ].map((project, index) => (
                          <div key={index} className="p-4 rounded-lg border border-border bg-card">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-foreground">{project.title}</h4>
                              <Badge variant={project.difficulty === "Advanced" ? "destructive" : "secondary"}>
                                {project.difficulty}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {project.skills.map((skill, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-4" asChild>
                        <Link href="/student/project-generator">
                          Generate More Projects
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
