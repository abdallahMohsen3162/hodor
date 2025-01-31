import { Github, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background/80 backdrop-blur border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} متابعة مستر أحمد الأمير. جميع الحقوق محفوظة.
        </p>
        <div className="flex items-center space-x-4">
          <Link href="https://www.linkedin.com/in/ahmedessamwasfy" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            <span className="sr-only">LinkedIn - أحمد عصام</span>
          </Link>
          <Link href="https://www.linkedin.com/in/ezzeldin-eladly" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            <span className="sr-only">LinkedIn - عز الدين</span>
          </Link>
          <Link href="https://github.com/your-github-profile" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

