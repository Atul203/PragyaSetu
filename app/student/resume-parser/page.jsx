"use client"
import { useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Brain, TrendingUp, Award, Briefcase, GraduationCap, Star } from "lucide-react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import jsPDF from "jspdf"


export default function ResumeParser() {
  const { user, updateUserData } = useAuth()
  const [file, setFile] = useState(null)
  const [parsing, setParsing] = useState(false)
  const [parsedData, setParsedData] = useState(null)
  const [dragActive, setDragActive] = useState(false)

     const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile) => {
    if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf")) {
      setFile(selectedFile)
    } else {
      alert("Please upload a PDF file")
    }
  }

  const parseResume = async () => {
  if (!file) return

  setParsing(true)
  console.log("[Gemini] Parsing resume:", file.name)

  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/parse-resume-gemini", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Gemini API failed")
    }

const raw = await response.text()

let parsedData
try {
  parsedData = JSON.parse(raw)
} catch (e) {
  console.error("Invalid JSON from Gemini:", raw)
  throw new Error("AI returned invalid format")
}

setParsedData(parsedData)

    console.log("[Gemini] Resume parsed:", parsedData)

    // ✅ Update Firebase profile
    if (user?.uid) {
      const userRef = doc(db, "users", user.uid)

      await updateDoc(userRef, {
        skills: parsedData.skills?.technical || [],
        employabilityScore: parsedData.analysis?.employabilityScore || 0,
        certifications: parsedData.certifications || [],
        resumeParsed: true,
        lastResumeUpdate: new Date().toISOString(),
      })

      updateUserData({
        ...user,
        skills: parsedData.skills?.technical || [],
        employabilityScore: parsedData.analysis?.employabilityScore || 0,
        certifications: parsedData.certifications || [],
      })
    }
  } catch (error) {
    console.error("[Gemini] Resume parsing error:", error)
    alert("AI resume parsing failed. Please try again.")
  } finally {
    setParsing(false)
  }
}

const downloadAnalysisReport = () => {
  if (!parsedData) {
    alert("No resume analysis available")
    return
  }

  const doc = new jsPDF()
  let y = 10

  const addLine = (text) => {
    doc.text(text, 10, y)
    y += 8
    if (y > 280) {
      doc.addPage()
      y = 10
    }
  }

  // Title
  doc.setFontSize(16)
  addLine("AI Resume Analysis Report")

  doc.setFontSize(11)
  addLine(`Generated on: ${new Date().toLocaleString()}`)
  addLine("")

  // Personal Info
  addLine("Personal Information")
  addLine(`Name: ${parsedData.personalInfo.name}`)
  addLine(`Email: ${parsedData.personalInfo.email}`)
  addLine(`Phone: ${parsedData.personalInfo.phone}`)
  addLine(`Location: ${parsedData.personalInfo.location}`)
  addLine("")

  // Summary
  addLine("Professional Summary")
  addLine(parsedData.summary)
  addLine("")

  // Skills
  addLine("Technical Skills")
  parsedData.skills.technical.forEach(skill => addLine(`- ${skill}`))
  addLine("")

  // Experience
  addLine("Work Experience")
  parsedData.experience.forEach(exp => {
    addLine(`${exp.title} | ${exp.company}`)
    addLine(`Duration: ${exp.duration}`)
    addLine(exp.description)
    addLine("")
  })

  // Projects
  addLine("Projects")
  parsedData.projects.forEach(project => {
    addLine(project.name)
    addLine(`Tech: ${project.tech.join(", ")}`)
    addLine(project.description)
    addLine("")
  })

  // AI Analysis
  addLine("AI Analysis")
  addLine(`Employability Score: ${parsedData.analysis.employabilityScore}%`)
  addLine("Strengths:")
  parsedData.analysis.strengths.forEach(s => addLine(`- ${s}`))
  addLine("Improvements:")
  parsedData.analysis.improvements.forEach(i => addLine(`- ${i}`))
  addLine(`Recommended Roles: ${parsedData.analysis.matchedRoles.join(", ")}`)
  addLine(`Expected Salary: ${parsedData.analysis.salaryRange}`)

  // Save PDF
  doc.save("AI_Resume_Analysis_Report.pdf")
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Resume Parser
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your resume and get instant AI-powered analysis with personalized recommendations
          </p>
        </div>

        {!parsedData ? (
          /* Upload Section */
          <Card className="glass max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Brain className="h-6 w-6 text-accent" />
                Upload Your Resume
              </CardTitle>
              <CardDescription>Our AI will analyze your resume and provide detailed insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">
                  {file ? file.name : "Drop your resume here or click to browse"}
                </p>
                <p className="text-muted-foreground mb-4">Supports PDF files up to 10MB</p>
<input
  ref={fileInputRef}
  type="file"
  accept=".pdf"
  onChange={handleFileInput}
  className="hidden"
/>                <Button
  variant="outline"
  className="cursor-pointer bg-transparent"
  onClick={() => fileInputRef.current?.click()}
>
  <FileText className="h-4 w-4 mr-2" />
  Choose File
</Button>

              </div>

              {/* Parse Button */}
              {file && (
                <Button onClick={parseResume} disabled={parsing} className="w-full" size="lg">
                  {parsing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Parse Resume with AI
                    </>
                  )}
                </Button>
              )}

              {parsing && (
                <div className="space-y-2">
                  <Progress value={33} className="animate-pulse" />
                  <p className="text-sm text-muted-foreground text-center">AI is analyzing your resume...</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Results Section */
          <div className="space-y-6">
            {/* Analysis Overview */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-accent" />
                  Resume Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">{parsedData?.analysis?.employabilityScore ?? 0}%</div>
                    <p className="text-sm text-muted-foreground">Employability Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{parsedData.skills.technical.length}</div>
                    <p className="text-sm text-muted-foreground">Technical Skills</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">{parsedData.experience.length}</div>
                    <p className="text-sm text-muted-foreground">Work Experience</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-chart-2 mb-2">{parsedData.certifications.length}</div>
                    <p className="text-sm text-muted-foreground">Certifications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Education
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {parsedData.education.map((edu, index) => (
                        <div key={index} className="space-y-2">
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-muted-foreground">{edu.institution}</p>
                          <div className="flex justify-between text-sm">
                            <span>Year: {edu.year}</span>
                            <span>CGPA: {edu.cgpa}</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {parsedData.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 mb-2">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                {parsedData.experience.map((exp, index) => (
                  <Card key={index} className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        {exp.title}
                      </CardTitle>
                      <CardDescription>
                        {exp.company} • {exp.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Technical Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {parsedData.skills.technical.map((skill, index) => (
                          <Badge key={index} variant="default">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Soft Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {parsedData.skills.soft.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                {parsedData.projects.map((project, index) => (
                  <Card key={index} className="glass">
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass border-green-200 dark:border-green-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Star className="h-5 w-5" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {parsedData.analysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="glass border-orange-200 dark:border-orange-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                        <TrendingUp className="h-5 w-5" />
                        Improvements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {parsedData.analysis.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Matched Job Roles</CardTitle>
                    <CardDescription>
                      Based on your skills and experience, you're a good fit for these roles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {parsedData.analysis.matchedRoles.map((role, index) => (
                        <Badge key={index} variant="default" className="text-sm">
                          {role}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expected Salary Range:{" "}
                      <span className="font-semibold text-accent">{parsedData.analysis.salaryRange}</span>
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setParsedData(null)
                  setFile(null)
                }}
              >
                Parse Another Resume
              </Button>
             <Button
  variant="outline"
  onClick={downloadAnalysisReport}
>
  Download Analysis Report (PDF)
</Button>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
