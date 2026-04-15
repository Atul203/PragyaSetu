"use client"

import { useState } from "react"
import { useNotifications } from "@/contexts/notifications-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  BellRing,
  CheckCheck,
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
import { formatDistanceToNow } from "date-fns"

const getNotificationIcon = (type) => {
  switch (type) {
    case "job_match":
      return <Briefcase className="w-4 h-4 text-blue-500" />
    case "course_recommendation":
    case "course_update":
      return <BookOpen className="w-4 h-4 text-green-500" />
    case "application_update":
      return <TrendingUp className="w-4 h-4 text-orange-500" />
    case "interview_scheduled":
      return <Calendar className="w-4 h-4 text-purple-500" />
    case "skill_milestone":
      return <Award className="w-4 h-4 text-yellow-500" />
    case "profile_view":
      return <Eye className="w-4 h-4 text-indigo-500" />
    case "deadline_reminder":
      return <AlertCircle className="w-4 h-4 text-red-500" />
    default:
      return <Bell className="w-4 h-4 text-muted-foreground" />
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "border-l-red-500"
    case "medium":
      return "border-l-yellow-500"
    case "low":
      return "border-l-green-500"
    default:
      return "border-l-muted"
  }
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isConnected } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const recentNotifications = notifications.slice(0, 5)

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount > 0 ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Notifications</span>
            {isConnected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Connected" />}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-6 px-2 text-xs">
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-1">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-muted/50 cursor-pointer border-l-2 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? "bg-muted/30" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <div className="flex items-center gap-1">
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
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
                      <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </p>
                        {notification.actionUrl && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/student/notifications" className="w-full">
            <Bell className="w-4 h-4 mr-2" />
            View all notifications
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/student/settings?tab=notifications" className="w-full">
            <Settings className="w-4 h-4 mr-2" />
            Notification settings
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
