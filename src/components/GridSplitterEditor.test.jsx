import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GridSplitterEditor from './GridSplitterEditor';

describe('GridSplitterEditor', () => {
  beforeEach(() => {
    // Mock HTMLCanvasElement
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
    }));
    HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock');

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();
    
    // Mock Image
    global.Image = class {
      constructor() {
        setTimeout(() => {
           if (this.onload) this.onload(); // Auto-trigger onload
        }, 10);
      }
      set src(val) {
        this.width = 1000;
        this.height = 1000;
      }
    };
  });

  const mockFile = new File(['(⌐□_□)'], 'cool.png', { type: 'image/png' });

  it('renders correctly', () => {
    render(<GridSplitterEditor file={mockFile} onBack={() => {}} />);
    expect(screen.getByText('Instagram Grid Maker')).toBeInTheDocument();
  });

  it('shows grid options', () => {
    render(<GridSplitterEditor file={mockFile} onBack={() => {}} />);
    expect(screen.getByText('3x3')).toBeInTheDocument();
    expect(screen.getByText('3x1')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(<GridSplitterEditor file={mockFile} onBack={onBack} />);
    
    const backBtn = screen.getByText('Back');
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalled();
  });
});
