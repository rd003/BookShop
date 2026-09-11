import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from '@tanstack/react-query'
import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter } from "react-router-dom"
import { queryClient } from "./lib/queryClient.ts"

// const originalPushState = history.pushState;
// history.pushState = function (...args) {
//   console.trace("pushState called with:", args[2]);
//   return originalPushState.apply(this, args);
// };

// const originalReplaceState = history.replaceState;
// history.replaceState = function (...args) {
//   console.trace("replaceState called with:", args[2]);
//   return originalReplaceState.apply(this, args);
// };

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)