// src/components/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true }; // triggers fallback UI on next render
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Send to your monitoring tool here (Sentry, App Insights, etc.)
        // logErrorToService(error, info.componentStack);
        console.error("Unhandled render error:", error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? <p>Something went wrong. Please refresh the page.</p>;
        }
        return this.props.children;
    }
}