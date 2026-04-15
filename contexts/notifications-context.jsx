"use client";

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

const NotificationsContext = createContext()

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}

export function NotificationsProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  // Mock real-time notifications - in production, this would connect to WebSocket/SSE
  useEffect(() => {
    if (!user) return

    // Simulate connection
    setIsConnected(true)

    // Mock initial notifications
    const initialNotifications = [
      {
        id: "1",
        type: "job_match",
        title: "New Job Match",
        message: "Frontend Developer position at TechCorp matches your profile",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        priority: "high",
        actionUrl: "/student/recommendations?tab=jobs",
        metadata: { company: "TechCorp", role: "Frontend Developer" },
      },
      {
        id: "2",
        type: "course_recommendation",
        title: "Course Recommendation",
        message: "Advanced React course available - 95% match with your goals",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        priority: "medium",
        actionUrl: "/student/recommendations?tab=courses",
        metadata: { course: "Advanced React", match: 95 },
      },
      {
        id: "3",
        type: "application_update",
        title: "Application Update",
        message: "Your application to DataTech has been reviewed",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
        priority: "high",
        actionUrl: "/student/applications",
        metadata: { company: "DataTech", status: "reviewed" },
      },
      {
        id: "4",
        type: "skill_milestone",
        title: "Skill Milestone",
        message: "Congratulations! You've reached 85% proficiency in React",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        priority: "low",
        actionUrl: "/student/analytics?tab=skills",
        metadata: { skill: "React", proficiency: 85 },
      },
      {
        id: "5",
        type: "interview_scheduled",
        title: "Interview Scheduled",
        message: "Interview with StartupXYZ scheduled for tomorrow at 2 PM",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: false,
        priority: "high",
        actionUrl: "/student/interviews",
        metadata: { company: "StartupXYZ", date: "tomorrow", time: "2 PM" },
      },
    ]

    setNotifications(initialNotifications)
    setUnreadCount(initialNotifications.filter((n) => !n.read).length)

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const mockNotifications = [
        {
          type: "job_match",
          title: "New Job Match",
          message: "Backend Developer position at InnovateCorp matches your profile",
          priority: "high",
          actionUrl: "/student/recommendations?tab=jobs",
          metadata: { company: "InnovateCorp", role: "Backend Developer" },
        },
        {
          type: "course_update",
          title: "Course Progress",
          message: "You're 75% through the Machine Learning Fundamentals course",
          priority: "low",
          actionUrl: "/student/courses",
          metadata: { course: "Machine Learning Fundamentals", progress: 75 },
        },
        {
          type: "profile_view",
          title: "Profile Viewed",
          message: "A recruiter from TechGiant viewed your profile",
          priority: "medium",
          actionUrl: "/student/profile",
          metadata: { company: "TechGiant", type: "recruiter" },
        },
        {
          type: "deadline_reminder",
          title: "Application Deadline",
          message: "Application deadline for CloudTech internship is in 2 days",
          priority: "high",
          actionUrl: "/student/applications",
          metadata: { company: "CloudTech", deadline: "2 days" },
        },
      ]

      // Randomly add a notification every 30-60 seconds
      if (Math.random() > 0.7) {
        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]
        const newNotification = {
          id: Date.now().toString(),
          ...randomNotification,
          timestamp: new Date(),
          read: false,
        }

        setNotifications((prev) => [newNotification, ...prev.slice(0, 19)]) // Keep only 20 notifications
        setUnreadCount((prev) => prev + 1)

        // Show browser notification if permission granted
        if (Notification.permission === "granted") {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: "/favicon.ico",
            tag: newNotification.id,
          })
        }
      }
    }, 45000) // Check every 45 seconds

    return () => {
      clearInterval(interval)
      setIsConnected(false)
    }
  }, [user])

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
  }

  const deleteNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    const notification = notifications.find((n) => n.id === notificationId)
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  const getNotificationsByType = (type) => {
    return notifications.filter((n) => n.type === type)
  }

  const getUnreadNotifications = () => {
    return notifications.filter((n) => !n.read)
  }

  const value = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
    getUnreadNotifications,
  }

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}
