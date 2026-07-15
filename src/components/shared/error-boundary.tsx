"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Errore catturato da ErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <AlertTriangle className="h-10 w-10 text-pink-400" />
            <p className="text-brown-500">Qualcosa è andato storto. Riprova più tardi.</p>
            <Button variant="outline" onClick={() => this.setState({ hasError: false })}>
              Riprova
            </Button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
