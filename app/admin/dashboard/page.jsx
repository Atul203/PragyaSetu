"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Users,
  TrendingUp,
  Award,
  Brain,
  Search,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"

// Mock data for admin dashboard
const mockAdminData = {
  totalStudents: 1247,
  activeStudents: 892,
  avgEmployabilityScore: 68.5,
  studentsAbove80: 156,
  batchData: [
    { batch: "2024", students: 312, avgScore: 72.3, placement: 85 },
    { batch: "2023", students: 298, avgScore: 69.8, placement: 78 },
    { batch: "2022", students: 285, avgScore: 66.2, placement: 82 },
    { batch: "2021", students: 352, avgScore: 71.5, placement: 88 },
  ],
  departmentData: [
    { dept: "Computer Science", students: 456, avgScore: 74.2, color: "#0891b2" },
    { dept: "Information Technology", students: 298, avgScore: 71.8, color: "#6366f1" },
    { dept: "Electronics", students: 234, avgScore: 65.4, color: "#ea580c" },
    { dept: "Mechanical", students: 189, avgScore: 62.1, color: "#f97316" },
    { dept: "Civil", students: 70, avgScore: 58.9, color: "#84cc16" },
  ],
  skillGapData: [
    { skill: "React", gap: 45, students: 234 },
    { skill: "Node.js", gap: 52, students: 198 },
    { skill: "System Design", gap: 67, students: 312 },
    { skill: "Data Structures", gap: 38, students: 156 },
    { skill: "Machine Learning", gap: 71, students: 89 },
  ],
  monthlyProgress: [
    { month: "Aug", score: 62.1, active: 756 },
    { month: "Sep", score: 64.3, active: 812 },
    { month: "Oct", score: 66.8, active: 845 },
    { month: "Nov", score: 67.9, active: 878 },
    { month: "Dec", score: 68.5, active: 892 },
  ],
  topPerformers: [
    { name: "Rahul Sharma", course: "B.Tech CSE", year: "4th", score: 94 },
    { name: "Priya Patel", course: "B.Tech IT", year: "3rd", score: 91 },
    { name: "Amit Kumar", course: "B.Tech CSE", year: "4th", score: 89 },
    { name: "Sneha Gupta", course: "B.Tech IT", year: "3rd", score: 87 },
    { name: "Vikash Singh", course: "B.Tech CSE", year: "2nd", score: 85 },
  ],
  atRiskStudents: [
    {
      name: "Ravi Mehta",
      course: "B.Tech ME",
      year: "3rd",
      score: 32,
      issues: ["Low engagement", "Missing assignments"],
    },
    { name: "Pooja Jain", course: "B.Tech CE", year: "2nd", score: 28, issues: ["Skill gaps", "No projects"] },
    {
      name: "Suresh Yadav",
      course: "B.Tech ECE",
      year: "4th",
      score: 35,
      issues: ["Interview preparation", "Portfolio"],
    },
  ],
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedBatch, setSelectedBatch] = useState("all")
  const [selectedDept, setSelectedDept] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PragyaSetu</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">College Administrator</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">College Analytics Dashboard</h2>
          <p className="text-muted-foreground">Monitor student progress and institutional performance</p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-8 p-4 bg-card rounded-lg border">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="cse">Computer Science</SelectItem>
              <SelectItem value="it">Information Technology</SelectItem>
              <SelectItem value="ece">Electronics</SelectItem>
              <SelectItem value="me">Mechanical</SelectItem>
              <SelectItem value="ce">Civil</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                <Users className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{mockAdminData.totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-green-600">+12%</span> from last semester
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Students</CardTitle>
                <TrendingUp className="w-4 h-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{mockAdminData.activeStudents}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round((mockAdminData.activeStudents / mockAdminData.totalStudents) * 100)}% engagement rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Employability</CardTitle>
                <BarChart3 className="w-4 h-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getScoreColor(mockAdminData.avgEmployabilityScore)}`}>
                {mockAdminData.avgEmployabilityScore}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-green-600">+2.3</span> points this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">High Performers</CardTitle>
                <Award className="w-4 h-4 text-chart-1" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{mockAdminData.studentsAbove80}</div>
              <p className="text-xs text-muted-foreground mt-2">Students with 80+ score</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>Average employability scores by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockAdminData.departmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dept" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgScore" fill="#0891b2" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Progress</CardTitle>
                  <CardDescription>Average score and active students over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mockAdminData.monthlyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="score" stroke="#0891b2" fill="#0891b2" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Batch Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Batch Performance Overview</CardTitle>
                <CardDescription>Performance metrics across different graduation batches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockAdminData.batchData.map((batch, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">Batch {batch.batch}</h4>
                        <Badge variant="secondary">{batch.students} students</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avg Score</span>
                          <span className={`font-medium ${getScoreColor(batch.avgScore)}`}>{batch.avgScore}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Placement Rate</span>
                          <span className="font-medium text-green-600">{batch.placement}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Students with highest employability scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAdminData.topPerformers.map((student, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.course} • {student.year} Year
                          </p>
                        </div>
                        <div className={`text-lg font-bold ${getScoreColor(student.score)}`}>{student.score}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* At-Risk Students */}
              <Card>
                <CardHeader>
                  <CardTitle>Students Needing Attention</CardTitle>
                  <CardDescription>Students with low employability scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAdminData.atRiskStudents.map((student, index) => (
                      <div key={index} className="p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-foreground">{student.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {student.course} • {student.year} Year
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                            <span className="text-sm font-medium text-destructive">{student.score}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {student.issues.map((issue, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skill Gap Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Critical Skill Gaps</CardTitle>
                  <CardDescription>Skills with largest gaps across all students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAdminData.skillGapData.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{skill.skill}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">{skill.students} students</span>
                            <span className="text-sm font-medium text-destructive">{skill.gap}% gap</span>
                          </div>
                        </div>
                        <Progress value={100 - skill.gap} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Department Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Distribution</CardTitle>
                  <CardDescription>Students by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockAdminData.departmentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="students"
                        label={({ dept, students }) => `${dept}: ${students}`}
                      >
                        {mockAdminData.departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Track institutional performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={mockAdminData.monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#0891b2"
                      strokeWidth={3}
                      dot={{ fill: "#0891b2", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="active"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ fill: "#6366f1", strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>AI-generated insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Focus Area</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Organize System Design workshops for final year students
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium">Urgent</span>
                      </div>
                      <p className="text-sm text-muted-foreground">3 students need immediate career counseling</p>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium">Opportunity</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Partner with tech companies for more internships</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Success Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Course Completion Rate</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Project Submission Rate</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Interview Success Rate</span>
                        <span className="font-medium">74%</span>
                      </div>
                      <Progress value={74} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Placement Rate</span>
                        <span className="font-medium">81%</span>
                      </div>
                      <Progress value={81} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Action Items</CardTitle>
                  <CardDescription>Suggested interventions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-destructive mt-2" />
                      <div>
                        <p className="text-sm font-medium">High Priority</p>
                        <p className="text-xs text-muted-foreground">
                          Schedule mock interviews for low-scoring students
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                      <div>
                        <p className="text-sm font-medium">Medium Priority</p>
                        <p className="text-xs text-muted-foreground">
                          Introduce advanced React.js certification program
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                      <div>
                        <p className="text-sm font-medium">Low Priority</p>
                        <p className="text-xs text-muted-foreground">Expand industry partnership program</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
