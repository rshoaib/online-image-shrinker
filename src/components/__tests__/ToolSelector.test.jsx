import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ToolSelector from '../ToolSelector';

// Mock Lucide icons to avoid render issues in test env if any (though usually fine)
// Actually standard rendering should be fine.

describe('ToolSelector Component', () => {
  it('renders all tool cards', () => {
    const mockSelect = vi.fn();
    render(<ToolSelector onSelectTool={mockSelect} />);

    // Check for headings of our main tools
    expect(screen.getByText(/Compress Image/i)).toBeInTheDocument();
    expect(screen.getByText(/Resize Image/i)).toBeInTheDocument();
    expect(screen.getByText(/Crop Image/i)).toBeInTheDocument();
    expect(screen.getByText(/Watermark/i)).toBeInTheDocument();
    expect(screen.getByText(/Images to PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/Remove Background/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Upscale/i)).toBeInTheDocument();
    
    // Check for NEW tools
    expect(screen.getByText(/Grid Splitter/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Blur/i)).toBeInTheDocument();
  });

  it('calls onSelectTool with correct ID when clicked', () => {
    const mockSelect = vi.fn();
    render(<ToolSelector onSelectTool={mockSelect} />);

    // Click Grid Splitter
    fireEvent.click(screen.getByText(/Grid Splitter/i));
    expect(mockSelect).toHaveBeenCalledWith('grid-splitter');

    // Click Privacy Blur
    fireEvent.click(screen.getByText(/Privacy Blur/i));
    expect(mockSelect).toHaveBeenCalledWith('redact');
  });
});
