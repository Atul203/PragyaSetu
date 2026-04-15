// External API integration service for realtime data
class ExternalAPIService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // Generic cache management
  getCachedData(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }
    return null
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  // Coursera API simulation (in real implementation, use actual API)
  async getCourseraRecommendations(skills = [], careerGoal = "") {
    const cacheKey = `coursera_${skills.join("_")}_${careerGoal}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    console.log("[v0] Fetching Coursera recommendations for skills:", skills)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock Coursera data based on skills
    const mockCourses = [
      {
        id: "coursera_1",
        title: "Full-Stack Web Development with React",
        provider: "Coursera",
        university: "The Hong Kong University of Science and Technology",
        rating: 4.7,
        students: "125,432",
        duration: "6 months",
        level: "Intermediate",
        price: "$49/month",
        skills: ["React", "JavaScript", "Node.js", "MongoDB"],
        url: "https://coursera.org/specializations/full-stack-react",
        image: "/react-course.png",
        description: "Master full-stack development with React, Node.js, and MongoDB",
        relevanceScore: 95,
      },
      {
        id: "coursera_2",
        title: "Machine Learning Specialization",
        provider: "Coursera",
        university: "Stanford University",
        rating: 4.9,
        students: "2,456,789",
        duration: "3 months",
        level: "Beginner",
        price: "$79/month",
        skills: ["Python", "Machine Learning", "TensorFlow", "Data Science"],
        url: "https://coursera.org/specializations/machine-learning",
        image: "/machine-learning-course.png",
        description: "Learn machine learning fundamentals from Andrew Ng",
        relevanceScore: 88,
      },
      {
        id: "coursera_3",
        title: "AWS Cloud Solutions Architect",
        provider: "Coursera",
        university: "Amazon Web Services",
        rating: 4.6,
        students: "89,234",
        duration: "4 months",
        level: "Advanced",
        price: "$59/month",
        skills: ["AWS", "Cloud Computing", "DevOps", "Architecture"],
        url: "https://coursera.org/professional-certificates/aws-cloud-solutions-architect",
        image: "/aws-cloud-course.jpg",
        description: "Become an AWS Certified Solutions Architect",
        relevanceScore: 82,
      },
    ]

    // Filter and sort by relevance to user's skills
    const relevantCourses = mockCourses
      .filter((course) => course.skills.some((skill) => skills.includes(skill)) || skills.length === 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)

    this.setCachedData(cacheKey, relevantCourses)
    return relevantCourses
  }

  // Unstop API simulation
  async getUnstopOpportunities(skills = [], location = "") {
    const cacheKey = `unstop_${skills.join("_")}_${location}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    console.log("[v0] Fetching Unstop opportunities for skills:", skills)

    await new Promise((resolve) => setTimeout(resolve, 800))

    const mockOpportunities = [
      {
        id: "unstop_1",
        title: "Frontend Developer Internship",
        company: "TechCorp India",
        type: "Internship",
        location: "Bangalore, India",
        duration: "3 months",
        stipend: "₹25,000/month",
        skills: ["React", "JavaScript", "CSS", "HTML"],
        deadline: "2024-10-15",
        applicants: 1234,
        url: "https://unstop.com/internships/frontend-developer-techcorp",
        image: "/abstract-tech-logo.png",
        description: "Build responsive web applications using React and modern JavaScript",
        relevanceScore: 92,
        featured: true,
      },
      {
        id: "unstop_2",
        title: "Data Science Competition",
        company: "Analytics Vidhya",
        type: "Competition",
        location: "Remote",
        duration: "2 weeks",
        prize: "₹1,00,000",
        skills: ["Python", "Machine Learning", "Data Analysis", "Pandas"],
        deadline: "2024-09-30",
        applicants: 5678,
        url: "https://unstop.com/competitions/data-science-challenge",
        image: "/data-science-competition.jpg",
        description: "Predict customer behavior using machine learning algorithms",
        relevanceScore: 87,
        featured: false,
      },
      {
        id: "unstop_3",
        title: "Full Stack Developer Job",
        company: "Startup Hub",
        type: "Job",
        location: "Mumbai, India",
        duration: "Full-time",
        salary: "₹8-12 LPA",
        skills: ["Node.js", "React", "MongoDB", "Express"],
        deadline: "2024-10-20",
        applicants: 892,
        url: "https://unstop.com/jobs/full-stack-developer-startup-hub",
        image: "/startup-logo.png",
        description: "Join our dynamic team to build scalable web applications",
        relevanceScore: 94,
        featured: true,
      },
    ]

    const relevantOpportunities = mockOpportunities
      .filter((opp) => opp.skills.some((skill) => skills.includes(skill)) || skills.length === 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)

    this.setCachedData(cacheKey, relevantOpportunities)
    return relevantOpportunities
  }

  // Indeed API simulation
  async getIndeedJobs(skills = [], location = "", experience = "") {
    const cacheKey = `indeed_${skills.join("_")}_${location}_${experience}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    console.log("[v0] Fetching Indeed jobs for skills:", skills)

    await new Promise((resolve) => setTimeout(resolve, 1200))

    const mockJobs = [
      {
        id: "indeed_1",
        title: "Software Engineer",
        company: "Google",
        location: "Mountain View, CA",
        salary: "$120,000 - $180,000",
        type: "Full-time",
        experience: "2-4 years",
        skills: ["JavaScript", "Python", "React", "Node.js"],
        posted: "2 days ago",
        url: "https://indeed.com/jobs/software-engineer-google",
        image: "/google-logo.png",
        description: "Join our team to build next-generation web applications",
        relevanceScore: 96,
        remote: false,
      },
      {
        id: "indeed_2",
        title: "Frontend Developer",
        company: "Microsoft",
        location: "Seattle, WA",
        salary: "$95,000 - $140,000",
        type: "Full-time",
        experience: "1-3 years",
        skills: ["React", "TypeScript", "CSS", "JavaScript"],
        posted: "1 day ago",
        url: "https://indeed.com/jobs/frontend-developer-microsoft",
        image: "/microsoft-logo.png",
        description: "Create beautiful user interfaces for Microsoft products",
        relevanceScore: 91,
        remote: true,
      },
      {
        id: "indeed_3",
        title: "Full Stack Developer",
        company: "Amazon",
        location: "Austin, TX",
        salary: "$110,000 - $160,000",
        type: "Full-time",
        experience: "2-5 years",
        skills: ["AWS", "Node.js", "React", "Python"],
        posted: "3 days ago",
        url: "https://indeed.com/jobs/full-stack-developer-amazon",
        image: "/amazon-logo.png",
        description: "Build scalable cloud-based applications on AWS",
        relevanceScore: 89,
        remote: false,
      },
    ]

    const relevantJobs = mockJobs
      .filter((job) => job.skills.some((skill) => skills.includes(skill)) || skills.length === 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)

    this.setCachedData(cacheKey, relevantJobs)
    return relevantJobs
  }

  // GitHub trending projects (for project inspiration)
  async getTrendingProjects(language = "") {
    const cacheKey = `github_trending_${language}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    console.log("[v0] Fetching GitHub trending projects for language:", language)

    await new Promise((resolve) => setTimeout(resolve, 600))

    const mockProjects = [
      {
        id: "github_1",
        name: "awesome-react-components",
        author: "brillout",
        description: "Curated list of React components & libraries",
        language: "JavaScript",
        stars: "45,234",
        forks: "5,678",
        todayStars: 234,
        url: "https://github.com/brillout/awesome-react-components",
        topics: ["react", "components", "ui", "library"],
      },
      {
        id: "github_2",
        name: "machine-learning-roadmap",
        author: "mrdbourke",
        description: "A roadmap connecting many of the most important concepts in machine learning",
        language: "Python",
        stars: "23,456",
        forks: "3,421",
        todayStars: 156,
        url: "https://github.com/mrdbourke/machine-learning-roadmap",
        topics: ["machine-learning", "python", "data-science", "ai"],
      },
      {
        id: "github_3",
        name: "system-design-primer",
        author: "donnemartin",
        description: "Learn how to design large-scale systems",
        language: "Python",
        stars: "267,890",
        forks: "45,123",
        todayStars: 89,
        url: "https://github.com/donnemartin/system-design-primer",
        topics: ["system-design", "interview", "architecture", "scalability"],
      },
    ]

    const filteredProjects = language
      ? mockProjects.filter((project) => project.language.toLowerCase() === language.toLowerCase())
      : mockProjects

    this.setCachedData(cacheKey, filteredProjects)
    return filteredProjects
  }

  // Real-time market trends
  async getMarketTrends() {
    const cacheKey = "market_trends"
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    console.log("[v0] Fetching market trends")

    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockTrends = {
      hotSkills: [
        { skill: "React", demand: 95, growth: "+12%" },
        { skill: "Python", demand: 92, growth: "+8%" },
        { skill: "AWS", demand: 89, growth: "+15%" },
        { skill: "Machine Learning", demand: 87, growth: "+20%" },
        { skill: "Node.js", demand: 84, growth: "+6%" },
      ],
      salaryTrends: {
        "Software Engineer": { min: 80000, max: 150000, growth: "+5%" },
        "Data Scientist": { min: 95000, max: 180000, growth: "+12%" },
        "Frontend Developer": { min: 70000, max: 130000, growth: "+3%" },
        "DevOps Engineer": { min: 90000, max: 160000, growth: "+8%" },
      },
      industryGrowth: [
        { industry: "AI/ML", growth: "+25%" },
        { industry: "Cloud Computing", growth: "+18%" },
        { industry: "Cybersecurity", growth: "+15%" },
        { industry: "Web Development", growth: "+10%" },
      ],
    }

    this.setCachedData(cacheKey, mockTrends)
    return mockTrends
  }

  // Comprehensive search across all platforms
  async searchAll(query, userSkills = []) {
    console.log("[v0] Performing comprehensive search for:", query)

    const [courses, opportunities, jobs, projects, trends] = await Promise.all([
      this.getCourseraRecommendations(userSkills, query),
      this.getUnstopOpportunities(userSkills),
      this.getIndeedJobs(userSkills),
      this.getTrendingProjects(),
      this.getMarketTrends(),
    ])

    return {
      courses: courses.slice(0, 6),
      opportunities: opportunities.slice(0, 6),
      jobs: jobs.slice(0, 6),
      projects: projects.slice(0, 6),
      trends,
      totalResults: courses.length + opportunities.length + jobs.length + projects.length,
    }
  }
}

// Export singleton instance
export const externalAPI = new ExternalAPIService()
