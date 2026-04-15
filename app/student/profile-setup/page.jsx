"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Plus, CheckCircle, User, Target, Code, Briefcase } from "lucide-react"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

const SKILL_CATEGORIES = {
  "Programming Languages": ["JavaScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust", "Swift"],
  "Web Development": ["React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask", "Laravel", "Spring"],
  "Mobile Development": ["React Native", "Flutter", "iOS Development", "Android Development", "Xamarin"],
  Database: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "Oracle", "SQLite"],
  "Cloud & DevOps": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "Git", "Linux"],
  "Data Science": ["Machine Learning", "Deep Learning", "Data Analysis", "Pandas", "NumPy", "TensorFlow", "PyTorch"],
  Design: ["UI/UX Design", "Figma", "Adobe XD", "Photoshop", "Illustrator", "Sketch"],
  "Soft Skills": [
    "Communication",
    "Leadership",
    "Problem Solving",
    "Team Work",
    "Project Management",
    "Time Management",
  ],
}

const CAREER_PATHS = [
  "Software Developer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Mobile App Developer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "UI/UX Designer",
  "Product Manager",
  "Cybersecurity Specialist",
  "Database Administrator",
  "Cloud Architect",
  "Business Analyst",
  "Quality Assurance Engineer",
]

export default function ProfileSetupPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [profileData, setProfileData] = useState({
    // Personal Info
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",

    // Academic Info
    cgpa: "",
    graduationYear: "",
    specialization: "",

    // Skills
    selectedSkills: [],
    customSkills: [],

    // Career Goals
    careerGoals: "",
    preferredIndustries: [],
    targetCompanies: "",
    expectedSalary: "",

    // Experience
    internships: [],
    projects: [],
    certifications: [],
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const addSkill = (skill) => {
    if (!profileData.selectedSkills.includes(skill)) {
      setProfileData((prev) => ({
        ...prev,
        selectedSkills: [...prev.selectedSkills, skill],
      }))
    }
  }

  const removeSkill = (skill) => {
    setProfileData((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills.filter((s) => s !== skill),
    }))
  }

  const addCustomSkill = (skill) => {
    if (skill.trim() && !profileData.customSkills.includes(skill.trim())) {
      setProfileData((prev) => ({
        ...prev,
        customSkills: [...prev.customSkills, skill.trim()],
      }))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      console.log("[v0] Starting profile save process")

      const formattedData = {
        // Combine selected skills and custom skills into a single array
        skills: [...profileData.selectedSkills, ...profileData.customSkills],
        careerGoals: profileData.careerGoals,

        // Personal Info
        phone: profileData.phone,
        linkedinUrl: profileData.linkedinUrl,
        githubUrl: profileData.githubUrl,
        portfolioUrl: profileData.portfolioUrl,

        // Academic Info
        cgpa: profileData.cgpa,
        graduationYear: profileData.graduationYear,
        specialization: profileData.specialization,

        // Career Goals (detailed)
        preferredIndustries: profileData.preferredIndustries,
        targetCompanies: profileData.targetCompanies,
        expectedSalary: profileData.expectedSalary,

        // Experience
        internships: profileData.internships,
        projects: profileData.projects,
        certifications: profileData.certifications,

        // Profile completion status
        profileCompleted: true,
        updatedAt: new Date().toISOString(),
      }

      console.log("[v0] Formatted profile data:", formattedData)

      const userRef = doc(db, "users", user.uid)
      await setDoc(userRef, formattedData, { merge: true })

      console.log("[v0] Profile saved successfully")
      router.push("/student/dashboard")
    } catch (error) {
      console.error("[v0] Profile save error:", error)
      setError("Failed to save profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Personal Information</CardTitle>
              </div>
              <CardDescription>Let's start with your basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA/Percentage</Label>
                  <Input
                    id="cgpa"
                    type="text"
                    placeholder="8.5 or 85%"
                    value={profileData.cgpa}
                    onChange={(e) => handleInputChange("cgpa", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Select
                    value={profileData.graduationYear}
                    onValueChange={(value) => handleInputChange("graduationYear", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026, 2027, 2028].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    type="text"
                    placeholder="e.g., Computer Science, AI/ML"
                    value={profileData.specialization}
                    onChange={(e) => handleInputChange("specialization", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={profileData.linkedinUrl}
                  onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub Profile</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={profileData.githubUrl}
                  onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolioUrl">Portfolio Website (Optional)</Label>
                <Input
                  id="portfolioUrl"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={profileData.portfolioUrl}
                  onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-secondary" />
                <CardTitle>Skills Assessment</CardTitle>
              </div>
              <CardDescription>Select your current skills and expertise areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                <div key={category} className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={profileData.selectedSkills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() =>
                          profileData.selectedSkills.includes(skill) ? removeSkill(skill) : addSkill(skill)
                        }
                      >
                        {skill}
                        {profileData.selectedSkills.includes(skill) && <X className="w-3 h-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Custom Skills</h4>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a custom skill"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addCustomSkill(e.target.value)
                        e.target.value = ""
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector("input")
                      addCustomSkill(input.value)
                      input.value = ""
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.customSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="cursor-pointer">
                      {skill}
                      <X
                        className="w-3 h-3 ml-1"
                        onClick={() =>
                          setProfileData((prev) => ({
                            ...prev,
                            customSkills: prev.customSkills.filter((s) => s !== skill),
                          }))
                        }
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Selected Skills: {profileData.selectedSkills.length + profileData.customSkills.length}
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-accent" />
                <CardTitle>Career Goals</CardTitle>
              </div>
              <CardDescription>Define your career aspirations and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="careerGoals">Primary Career Goal</Label>
                <Select
                  value={profileData.careerGoals}
                  onValueChange={(value) => handleInputChange("careerGoals", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary career goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAREER_PATHS.map((path) => (
                      <SelectItem key={path} value={path}>
                        {path}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredIndustries">Preferred Industries</Label>
                <Textarea
                  id="preferredIndustries"
                  placeholder="e.g., Technology, Healthcare, Finance, E-commerce, Gaming"
                  value={profileData.preferredIndustries}
                  onChange={(e) => handleInputChange("preferredIndustries", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetCompanies">Target Companies</Label>
                <Textarea
                  id="targetCompanies"
                  placeholder="e.g., Google, Microsoft, Amazon, Flipkart, Zomato, Paytm"
                  value={profileData.targetCompanies}
                  onChange={(e) => handleInputChange("targetCompanies", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedSalary">Expected Starting Salary (LPA)</Label>
                <Select
                  value={profileData.expectedSalary}
                  onValueChange={(value) => handleInputChange("expectedSalary", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select salary range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-5">3-5 LPA</SelectItem>
                    <SelectItem value="5-8">5-8 LPA</SelectItem>
                    <SelectItem value="8-12">8-12 LPA</SelectItem>
                    <SelectItem value="12-18">12-18 LPA</SelectItem>
                    <SelectItem value="18+">18+ LPA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-chart-1" />
                <CardTitle>Experience & Projects</CardTitle>
              </div>
              <CardDescription>Tell us about your experience and notable projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="internships">Internships/Work Experience</Label>
                <Textarea
                  id="internships"
                  placeholder="List your internships, part-time jobs, or work experience. Include company name, role, and duration."
                  value={profileData.internships}
                  onChange={(e) => handleInputChange("internships", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projects">Notable Projects</Label>
                <Textarea
                  id="projects"
                  placeholder="Describe your key projects. Include project name, technologies used, and brief description."
                  value={profileData.projects}
                  onChange={(e) => handleInputChange("projects", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications & Achievements</Label>
                <Textarea
                  id="certifications"
                  placeholder="List your certifications, online courses completed, hackathon wins, or other achievements."
                  value={profileData.certifications}
                  onChange={(e) => handleInputChange("certifications", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <h4 className="font-medium">Profile Summary</h4>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Skills: {profileData.selectedSkills.length + profileData.customSkills.length} selected</p>
                  <p>Career Goal: {profileData.careerGoals || "Not specified"}</p>
                  <p>Graduation: {profileData.graduationYear || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Help us understand your background to provide personalized recommendations
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}>Next Step</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving Profile..." : "Complete Setup"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
