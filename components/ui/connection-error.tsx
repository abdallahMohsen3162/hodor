import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface ConnectionErrorProps {
  message?: string
  onRetry?: () => void
}

export function ConnectionError({ message, onRetry }: ConnectionErrorProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertTitle>خطأ في الاتصال</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{message || "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى."}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

