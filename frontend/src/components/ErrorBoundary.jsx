import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("UI crash:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card" style={{ textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <p className="muted">An unexpected error occurred in the interface.</p>
          <button onClick={() => (window.location.href = "/dashboard")}>Back to dashboard</button>
        </div>
      );
    }
    return this.props.children;
  }
}