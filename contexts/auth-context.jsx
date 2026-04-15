"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

// Create Context
const AuthContext = createContext(null)

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // 🔄 Watch Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user document from Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid)
          const userDoc = await getDoc(userDocRef)
          const userData = userDoc.exists() ? userDoc.data() : {}

          const fullUserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            ...userData,
          }

          setUser(fullUserData)

          // Handle redirect only if user is on auth or root pages
          if (typeof window !== "undefined") {
            const path = window.location.pathname
            const isAuthPage = ["/auth/login", "/auth/signup", "/"].includes(path)

            if (isAuthPage) {
              if (fullUserData.role === "admin") {
                router.replace("/admin/dashboard")
              } else if (fullUserData.profileCompleted) {
                router.replace("/student/dashboard")
              } else {
                router.replace("/student/profile-setup")
              }
            }
          }
        } catch (error) {
          console.error("[auth-context] Error fetching Firestore user:", error)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          })
        }
      } else {
        // No user logged in
        setUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  // 🟢 Signup
  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const newUser = userCredential.user

      // Set display name
      await updateProfile(newUser, { displayName: userData.name })

      const isAdmin = userData.role === "admin"

      const userDocData = {
        name: userData.name,
        email,
        role: userData.role || "student",
        college: userData.college || "",
        course: userData.course || "",
        year: userData.year || "",
        skills: userData.skills || [],
        careerGoals: userData.careerGoals || "",
        employabilityScore: 0,
        createdAt: new Date().toISOString(),
        profileCompleted: isAdmin, // Admins skip setup
      }

      await setDoc(doc(db, "users", newUser.uid), userDocData)
      return newUser
    } catch (error) {
      console.error("[auth-context] Signup error:", error)
      throw error
    }
  }

  // 🟡 Login
  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("[auth-context] Login error:", error)
      throw error
    }
  }

  // 🔴 Logout (with redirect)
const logout = async () => {
  try {
    console.log("[v0] Logging out user");
    await signOut(auth);
    setUser(null);

    // Force navigation to login
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  } catch (error) {
    console.error("[v0] Logout error:", error);
  }
};

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
  }

  // ⏳ Show loader while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading...
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
