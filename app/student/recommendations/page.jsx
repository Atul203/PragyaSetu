"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useCourseRecommendations, useJobRecommendations } from "@/hooks/use-realtime-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Briefcase,
  Star,
  Clock,
  Users,
  MapPin,
  DollarSign,
  ExternalLink,
  Search,
  Target,
  RefreshCw,
  Heart,
  Bookmark,
  ChevronRight,
  Building,
  Calendar,
} from "lucide-react"

export default function RecommendationsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("courses")
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("All Locations")
  const [experienceFilter, setExperienceFilter] = useState("All Levels")
  const [savedItems, setSavedItems] = useState(new Set())

  const { courses, loading: coursesLoading, refresh: refreshCourses } = useCourseRecommendations(user?.skills || [])
  const { jobs, loading: jobsLoading, refresh: refreshJobs } = useJobRecommendations(user?.skills || [], locationFilter)

  const toggleSaved = (id) => {
    const newSaved = new Set(savedItems)
    if (newSaved.has(id)) {
      newSaved.delete(id)
    } else {
      newSaved.add(id)
    }
    setSavedItems(newSaved)
  }

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesExperience = !experienceFilter || job.experience?.includes(experienceFilter)

    return matchesSearch && matchesExperience
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Personalized Recommendations
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Discover courses, jobs, and opportunities tailored to your skills and career goals
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search courses, jobs, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Locations">All Locations</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Levels">All Levels</SelectItem>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="2-4">2-4 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 glass">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Courses ({filteredCourses.length})
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Jobs & Opportunities ({filteredJobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{filteredCourses.length}</div>
                  <p className="text-sm text-muted-foreground">Available Courses</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">
                    {filteredCourses.length > 0
                      ? (filteredCourses.reduce((acc, c) => acc + c.rating, 0) / filteredCourses.length).toFixed(1)
                      : "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {filteredCourses.filter((c) => c.level === "Beginner").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Beginner Friendly</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-chart-1">
                    {filteredCourses.filter((c) => c.relevanceScore >= 90).length}
                  </div>
                  <p className="text-sm text-muted-foreground">High Match</p>
                </CardContent>
              </Card>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="glass animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded mb-4"></div>
                      <div className="h-3 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-4"></div>
                      <div className="flex gap-2 mb-4">
                        <div className="h-6 w-16 bg-muted rounded"></div>
                        <div className="h-6 w-16 bg-muted rounded"></div>
                      </div>
                      <div className="h-10 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredCourses.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredCourses.map((course, index) => (
                  <Card key={index} className="glass hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {course.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Building className="w-3 h-3" />
                            {course.university}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSaved(course.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              savedItems.has(course.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{course.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span>{course.students}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant={course.level === "Beginner" ? "secondary" : "outline"}>{course.level}</Badge>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-accent" />
                          <span className="text-sm font-medium text-accent">{course.relevanceScore}% match</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {course.skills.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {course.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{course.skills.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-lg font-bold text-primary">{course.price}</div>
                        <Button asChild className="group/btn">
                          <a href={course.url} target="_blank" rel="noopener noreferrer">
                            Enroll Now
                            <ExternalLink className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            {/* Job Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{filteredJobs.length}</div>
                  <p className="text-sm text-muted-foreground">Available Positions</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">
                    {filteredJobs.filter((j) => j.remote || j.location?.includes("Remote")).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Remote Jobs</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {filteredJobs.filter((j) => j.type === "Internship").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Internships</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-chart-1">{filteredJobs.filter((j) => j.featured).length}</div>
                  <p className="text-sm text-muted-foreground">Featured</p>
                </CardContent>
              </Card>
            </div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobsLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="glass animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded mb-4"></div>
                      <div className="h-3 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-4"></div>
                      <div className="flex gap-2 mb-4">
                        <div className="h-6 w-16 bg-muted rounded"></div>
                        <div className="h-6 w-16 bg-muted rounded"></div>
                      </div>
                      <div className="h-10 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredJobs.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredJobs.map((job, index) => (
                  <Card key={index} className="glass hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {job.title}
                            </CardTitle>
                            {job.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                            {job.remote && <Badge variant="secondary">Remote</Badge>}
                          </div>
                          <CardDescription className="flex items-center gap-2">
                            <Building className="w-3 h-3" />
                            {job.company}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSaved(job.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Bookmark
                            className={`w-4 h-4 ${
                              savedItems.has(job.id) ? "fill-blue-500 text-blue-500" : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-3 h-3 text-muted-foreground" />
                          <span>{job.salary || job.stipend || job.prize}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span>{job.duration || job.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span>{job.applicants} applicants</span>
                        </div>
                      </div>

                      {job.deadline && (
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <Calendar className="w-3 h-3" />
                          <span>Deadline: {job.deadline}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Badge
                          variant={job.type === "Job" ? "default" : job.type === "Internship" ? "secondary" : "outline"}
                        >
                          {job.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-accent" />
                          <span className="text-sm font-medium text-accent">{job.relevanceScore}% match</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {job.skills.slice(0, 4).map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills.length - 4} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-xs text-muted-foreground">{job.posted && `Posted ${job.posted}`}</div>
                        <Button asChild className="group/btn">
                          <a href={job.url} target="_blank" rel="noopener noreferrer">
                            Apply Now
                            <ExternalLink className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Need more personalized recommendations?</h3>
                <p className="text-muted-foreground">Update your profile and skills to get better matches</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    refreshCourses()
                    refreshJobs()
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button asChild>
                  <a href="/student/profile-setup">
                    Update Profile
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
