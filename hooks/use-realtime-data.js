"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { externalAPI } from "@/lib/external-apis"

export function useRealtimeData(userSkills = [], refreshInterval = 300000) {
  // 5 minutes default refresh
  const [data, setData] = useState({
    courses: [],
    opportunities: [],
    jobs: [],
    projects: [],
    trends: null,
    loading: true,
    error: null,
    lastUpdated: null,
  })

  const skillsRef = useRef(userSkills)
  const hasInitialized = useRef(false)

  useEffect(() => {
    skillsRef.current = userSkills
  }, [userSkills])

  const fetchData = useCallback(async () => {
    try {
      console.log("[v0] Fetching realtime data for skills:", skillsRef.current)
      setData((prev) => ({ ...prev, loading: true, error: null }))

      const results = await externalAPI.searchAll("", skillsRef.current)

      setData({
        ...results,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      })

      console.log("[v0] Realtime data updated:", results)
    } catch (error) {
      console.error("[v0] Error fetching realtime data:", error)
      setData((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }))
    }
  }, []) // Remove userSkills dependency to prevent infinite loop

  useEffect(() => {
    if (!hasInitialized.current) {
      fetchData()
      hasInitialized.current = true
    }
  }, [fetchData])

  useEffect(() => {
    if (hasInitialized.current) {
      fetchData()
    }
  }, [userSkills, fetchData])

  // Set up auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    ...data,
    refresh: fetchData,
  }
}

export function useCourseRecommendations(skills = []) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const skillsRef = useRef(skills)

  useEffect(() => {
    skillsRef.current = skills
  }, [skills])

  const fetchCourses = useCallback(async () => {
    if (skillsRef.current.length === 0) return

    setLoading(true)
    try {
      const results = await externalAPI.getCourseraRecommendations(skillsRef.current)
      setCourses(results)
    } catch (error) {
      console.error("[v0] Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [skills, fetchCourses])

  return { courses, loading, refresh: fetchCourses }
}

export function useJobRecommendations(skills = [], location = "") {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const skillsRef = useRef(skills)
  const locationRef = useRef(location)

  useEffect(() => {
    skillsRef.current = skills
    locationRef.current = location
  }, [skills, location])

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const [indeedJobs, unstopJobs] = await Promise.all([
        externalAPI.getIndeedJobs(skillsRef.current, locationRef.current),
        externalAPI.getUnstopOpportunities(skillsRef.current, locationRef.current),
      ])

      // Combine and sort by relevance
      const allJobs = [...indeedJobs, ...unstopJobs].sort((a, b) => b.relevanceScore - a.relevanceScore)

      setJobs(allJobs)
    } catch (error) {
      console.error("[v0] Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [skills, location, fetchJobs])

  return { jobs, loading, refresh: fetchJobs }
}

export function useMarketTrends() {
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchTrends = useCallback(async () => {
    setLoading(true)
    try {
      const results = await externalAPI.getMarketTrends()
      setTrends(results)
    } catch (error) {
      console.error("[v0] Error fetching market trends:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrends()
  }, [fetchTrends])

  return { trends, loading, refresh: fetchTrends }
}
