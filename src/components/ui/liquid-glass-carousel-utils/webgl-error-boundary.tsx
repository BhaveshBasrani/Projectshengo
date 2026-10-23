"use client";

import React, { Component, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("WebGL Carousel Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <WebGLFallback message="WebGL acceleration is unavailable or encountered an issue." />
        )
      );
    }
    return this.props.children;
  }
}

export function WebGLFallback({
  className,
  message = "This carousel needs WebGL, which is unavailable in this browser.",
}: {
  className?: string;
  message?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center border border-border/40 bg-card/60 backdrop-blur-sm",
        className
      )}
    >
      <div className="w-12 h-12 mb-4 flex items-center justify-center border border-primary/40 text-primary font-mono text-sm">
        [3D]
      </div>
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
        HARDWARE ACCELERATION NOTICE
      </p>
      <p className="text-sm text-foreground/80 max-w-md font-sans">
        {message}
      </p>
    </div>
  );
}
