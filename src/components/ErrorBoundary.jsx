import React, { Component } from 'react';

// Error Boundary to prevent white screen crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '50vh', padding: '40px 20px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '400px' }}>
            This tool encountered an error. Your files are safe — nothing was uploaded.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '12px 24px', background: 'var(--primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600,
              cursor: 'pointer', fontSize: '0.95rem'
            }}
          >
            Go to Homepage
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
