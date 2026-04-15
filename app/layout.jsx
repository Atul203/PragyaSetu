import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { NotificationsProvider } from "@/contexts/notifications-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter, Roboto_Mono } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" })
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata = {
  title: "PragyaSetu",
  description: "AI-Powered Career Platform",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${robotoMono.variable} antialiased`}>
      <body className="bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <NotificationsProvider>
              <main>{children}</main>
            </NotificationsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

