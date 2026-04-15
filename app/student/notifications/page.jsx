"use client"

import { useState } from "react"
import { useNotifications } from "@/contexts/notifications-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  BellRing,
  Search,
  CheckCheck,
  Trash2,
  Settings,
  ExternalLink,
  Briefcase,
  BookOpen,
  TrendingUp,
  Calendar,
  AlertCircle,
  Award,
  Eye,
  X,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

const getNotificationIcon = (type) => {
  switch (type) {
    case "job_match":
      return <Briefcase className="w-5 h-5 text-blue-500" />
    case "course_recommendation":
    case "course_update":
      return <BookOpen className="w-5 h-5 text-green-500" />
    case "application_update":
      return <TrendingUp className="w-5 h-5 text-orange-500" />
    case "interview_scheduled":
      return <Calendar className="w-5 h-5 text-purple-500" />
    case "skill_milestone":
      return <Award className="w-5 h-5 text-yellow-500" />
    case "profile_view":
      return <Eye className="w-5 h-5 text-indigo-500" />
    case "deadline_reminder":
      return <AlertCircle className="w-5 h-5 text-red-500" />
    default:
      return <Bell className="w-5 h-5 text-muted-foreground" />
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "border-l-red-500 bg-red-50/50 dark:bg-red-950/20"
    case "medium":
      return "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20"
    case "low":
      return "border-l-green-500 bg-green-50/50 dark:bg-green-950/20"
    default:
      return "border-l-muted"
  }
}

const getTypeLabel = (type) => {
  switch (type) {
    case "job_match":
      return "Job Match"
    case "course_recommendation":
      return "Course Recommendation"
    case "course_update":
      return "Course Update"
    case "application_update":
      return "Application Update"
    case "interview_scheduled":
      return "Interview"
    case "skill_milestone":
      return "Skill Milestone"
    case "profile_view":
      return "Profile View"
    case "deadline_reminder":
      return "Deadline"
    default:
      return "Notification"
  }
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadNotifications,
    isConnected,
  } = useNotifications()

  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || notification.type === filterType
    const matchesPriority = filterPriority === "all" || notification.priority === filterPriority
    const matchesTab = activeTab === "all" || (activeTab === "unread" && !notification.read)

    return matchesSearch && matchesType && matchesPriority && matchesTab
  })

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    if (notification.actionUrl) {
      window.open(notification.actionUrl, "_blank")
    }
  }

  const notificationTypes = [...new Set(notifications.map((n) => n.type))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Notifications
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-muted-foreground">Stay updated with your career progress</p>
              {isConnected && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live updates enabled
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all read ({unreadCount})
              </Button>
            )}
            <Button asChild variant="outline" size="sm">
              <a href="/student/settings?tab=notifications">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </a>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{notifications.length}</div>
              <p className="text-sm text-muted-foreground">Total Notifications</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">{unreadCount}</div>
              <p className="text-sm text-muted-foreground">Unread</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">
                {notifications.filter((n) => n.priority === "high").length}
              </div>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-chart-1">
                {notifications.filter((n) => n.type === "job_match").length}
              </div>
              <p className="text-sm text-muted-foreground">Job Matches</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {notificationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 glass">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              <BellRing className="w-4 h-4" />
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card className="glass">
                <CardContent className="p-12 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterType !== "all" || filterPriority !== "all"
                      ? "Try adjusting your search or filters"
                      : "You're all caught up! New notifications will appear here."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`glass hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? "ring-1 ring-primary/20" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(notification.type)}
                              </Badge>
                              <Badge
                                variant={
                                  notification.priority === "high"
                                    ? "destructive"
                                    : notification.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {notification.priority}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{formatDistanceToNow(notification.timestamp, { addSuffix: true })}</span>
                              <span>{format(notification.timestamp, "MMM d, yyyy h:mm a")}</span>
                            </div>
                            {notification.actionUrl && (
                              <div className="flex items-center gap-1 text-xs text-primary">
                                <span>View details</span>
                                <ExternalLink className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        {notifications.length > 0 && (
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Manage Notifications</h3>
                  <p className="text-muted-foreground">Keep your notification center organized</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={clearAllNotifications}
                    className="text-destructive hover:text-destructive bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                  <Button asChild>
                    <a href="/student/settings?tab=notifications">
                      <Settings className="w-4 h-4 mr-2" />
                      Notification Settings
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
