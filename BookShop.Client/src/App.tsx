import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/toast"

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  )
}