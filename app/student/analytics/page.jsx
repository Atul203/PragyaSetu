"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { TrendingUp, TrendingDown, Target, BookOpen, Briefcase, Star, Calendar, Activity, BarChart3, PieChartIcon, LineChartIcon, Zap, Brain, Rocket, Eye, Download, RefreshCw, ArrowUp, ArrowDown, Minus, AlertCircle, CheckCircle, Info } from 'lucide-react'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0']

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")

  const [analyticsData] = useState({
    overview: {
      totalApplications: 45,
      applicationsTrend: 12,
      interviewsScheduled: 8,
      interviewsTrend: 3,
      coursesCompleted: 12,
      coursesTrend: 2,
      skillsImproved: 15,
      skillsTrend: 5,
      profileViews: 234,
      profileViewsTrend: 18,
      responseRate: 67,
      responseRateTrend: -3
    },
    skillsProgress: [
      { skill: 'React', current: 85, target: 90, improvement: 15 },
      { skill: 'Node.js', current: 78, target: 85, improvement: 12 },
      { skill: 'Python', current: 92, target: 95, improvement: 8 },
      { skill: 'Machine Learning', current: 65, target: 80, improvement: 25 },
      { skill: 'Data Analysis', current: 73, target: 85, improvement: 18 },
      { skill: 'UI/UX Design', current: 58, target: 75, improvement: 22 }
    ],
    applicationTrends: [
      { month: 'Jan', applications: 8, interviews: 2, offers: 0 },
      { month: 'Feb', applications: 12, interviews: 3, offers: 1 },
      { month: 'Mar', applications: 15, interviews: 4, offers: 1 },
      { month: 'Apr', applications: 18, interviews: 5, offers: 2 },
      { month: 'May', applications: 22, interviews: 6, offers: 2 },
      { month: 'Jun', applications: 25, interviews: 8, offers: 3 }
    ],
    courseEngagement: [
      { course: 'React Fundamentals', progress: 100, timeSpent: 24, rating: 4.8 },
      { course: 'Advanced JavaScript', progress: 85, timeSpent: 18, rating: 4.6 },
      { course: 'Node.js Backend', progress: 70, timeSpent: 15, rating: 4.7 },
      { course: 'Machine Learning Basics', progress: 45, timeSpent: 12, rating: 4.5 },
      { course: 'Data Structures', progress: 90, timeSpent: 20, rating: 4.9 }
    ],
    industryInsights: [
      { industry: 'Technology', demand: 85, growth: 12, avgSalary: '₹12L' },
      { industry: 'Finance', demand: 72, growth: 8, avgSalary: '₹10L' },
      { industry: 'Healthcare', demand: 68, growth: 15, avgSalary: '₹8L' },
      { industry: 'Education', demand: 55, growth: 6, avgSalary: '₹6L' },
      { industry: 'E-commerce', demand: 78, growth: 18, avgSalary: '₹9L' }
    ],
    skillDemand: [
      { name: 'React', value: 35 },
      { name: 'Python', value: 28 },
      { name: 'Node.js', value: 22 },
      { name: 'Machine Learning', value: 15 }
    ],
    weeklyActivity: [
      { day: 'Mon', applications: 3, courses: 2, networking: 1 },
      { day: 'Tue', applications: 5, courses: 1, networking: 2 },
      { day: 'Wed', applications: 2, courses: 3, networking: 1 },
      { day: 'Thu', applications: 4, courses: 2, networking: 3 },
      { day: 'Fri', applications: 6, courses: 1, networking: 2 },
      { day: 'Sat', applications: 1, courses: 4, networking: 1 },
      { day: 'Sun', applications: 0, courses: 3, networking: 0 }
    ]
  })

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowUp className="w-3 h-3 text-green-500" />
    if (trend < 0) return <ArrowDown className="w-3 h-3 text-red-500" />
    return <Minus className="w-3 h-3 text-muted-foreground" />
  }

  const getTrendColor = (trend) => {
    if (trend > 0) return "text-green-500"
    if (trend < 0) return "text-red-500"
    return "text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Career Analytics
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your progress and optimize your career journey
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                      <p className="text-3xl font-bold">{analyticsData.overview.totalApplications}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getTrendIcon(analyticsData.overview.applicationsTrend)}
                        <span className={`text-sm ${getTrendColor(analyticsData.overview.applicationsTrend)}`}>
                          {Math.abs(analyticsData.overview.applicationsTrend)}% vs last period
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Interviews Scheduled</p>
                      <p className="text-3xl font-bold">{analyticsData.overview.interviewsScheduled}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getTrendIcon(analyticsData.overview.interviewsTrend)}
                        <span className={`text-sm ${getTrendColor(analyticsData.overview.interviewsTrend)}`}>
                          {Math.abs(analyticsData.overview.interviewsTrend)}% vs last period
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-full">
                      <Calendar className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Courses Completed</p>
                      <p className="text-3xl font-bold">{analyticsData.overview.coursesCompleted}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getTrendIcon(analyticsData.overview.coursesTrend)}
                        <span className={`text-sm ${getTrendColor(analyticsData.overview.coursesTrend)}`}>
                          {Math.abs(analyticsData.overview.coursesTrend)}% vs last period
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-full">
                      <BookOpen className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Skills Improved</p>
                      <p className="text-3xl font-bold">{analyticsData.overview.skillsImproved}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getTrendIcon(analyticsData.overview.skillsTrend)}
                        <span className={`text-sm ${getTrendColor(analyticsData.overview.skillsTrend)}`}>
                          {Math.abs(analyticsData.overview.skillsTrend)}% vs last period
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-chart-1/10 rounded-full">
                      <Brain className="w-6 h-6 text-chart-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Profile Views</p>
                      <p className="text-3xl font-bold">{analyticsData.overview.profileViews}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getTrendIcon(analyticsData.overview.profileViewsTrend)}
                        <span className={`text-sm ${getTrendColor(analyticsData.overview.profileViewsTrend)}`}>
                          {Math.abs(analyticsData.overview.profileViewsTrend)}% vs last period
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-chart-2/10 rounded-full">
                      <Eye className="w-6 h-6 text-chart-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Response Rate</p>
                      <p className="text-3xl font-bold">{analyticsData.overview.responseRate}%</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getTrendIcon(analyticsData.overview.responseRateTrend)}
                        <span className={`text-sm ${getTrendColor(analyticsData.overview.responseRateTrend)}`}>
                          {Math.abs(analyticsData.overview.responseRateTrend)}% vs last period
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-chart-3/10 rounded-full">
                      <Target className="w-6 h-6 text-chart-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Weekly Activity Overview
                </CardTitle>
                <CardDescription>Your activity patterns across the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="applications" fill="#8884d8" name="Applications" />
                    <Bar dataKey="courses" fill="#82ca9d" name="Course Hours" />
                    <Bar dataKey="networking" fill="#ffc658" name="Networking" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            {/* Skills Progress and Demand Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Skills Progress Tracking
                  </CardTitle>
                  <CardDescription>Monitor your skill development over time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analyticsData.skillsProgress.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill.skill}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{skill.current}%</span>
                          <Badge variant="outline" className="text-xs">
                            +{skill.improvement}%
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={skill.current} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Current: {skill.current}%</span>
                          <span>Target: {skill.target}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5" />
                    Skill Demand Analysis
                  </CardTitle>
                  <CardDescription>Market demand for your skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.skillDemand}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.skillDemand.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Course Engagement Analytics
                </CardTitle>
                <CardDescription>Your learning progress and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.courseEngagement.map((course, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{course.course}</h4>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{course.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Progress</p>
                          <div className="flex items-center gap-2">
                            <Progress value={course.progress} className="h-2 flex-1" />
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Time Spent</p>
                          <p className="font-medium">{course.timeSpent}h</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <Badge variant={course.progress === 100 ? "default" : "secondary"}>
                            {course.progress === 100 ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5" />
                  Application Trends
                </CardTitle>
                <CardDescription>Track your job application progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analyticsData.applicationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="applications" stroke="#8884d8" strokeWidth={2} name="Applications" />
                    <Line type="monotone" dataKey="interviews" stroke="#82ca9d" strokeWidth={2} name="Interviews" />
                    <Line type="monotone" dataKey="offers" stroke="#ffc658" strokeWidth={2} name="Offers" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">18.7%</div>
                  <p className="text-sm text-muted-foreground">Interview Rate</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">+2.3% vs last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">37.5%</div>
                  <p className="text-sm text-muted-foreground">Offer Rate</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">+5.2% vs last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">4.2</div>
                  <p className="text-sm text-muted-foreground">Avg Response Time (days)</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingDown className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">-0.8 days vs last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Industry Demand Insights
                </CardTitle>
                <CardDescription>Market trends and opportunities in different industries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.industryInsights.map((industry, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{industry.industry}</h4>
                        <Badge variant="outline">{industry.avgSalary}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Market Demand</p>
                          <div className="flex items-center gap-2">
                            <Progress value={industry.demand} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{industry.demand}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Growth Rate</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-sm font-medium text-green-500">+{industry.growth}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>Personalized insights to boost your career</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Skill Gap Analysis</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Focus on improving your Machine Learning skills. 73% of your target jobs require advanced ML knowledge.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100">Application Strategy</h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Your response rate is 15% above average. Consider applying to 3-5 more positions weekly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-900 dark:text-orange-100">Profile Optimization</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        Add 2-3 more projects to your portfolio. Profiles with 5+ projects get 40% more views.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Rocket className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-900 dark:text-purple-100">Career Growth</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                        Consider targeting senior roles. Your skill progression suggests you're ready for the next level.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}