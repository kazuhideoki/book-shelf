import React from "react";

interface P {
  errorComponent?: JSX.Element;
}

interface S {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<P, S> {
  constructor(props: P) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(_error: any, _errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.errorComponent ?? <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
