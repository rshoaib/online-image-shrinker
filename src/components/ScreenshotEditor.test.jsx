import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScreenshotEditor from './ScreenshotEditor';

describe('ScreenshotEditor', () => {
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
      createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      fillRect: vi.fn(),
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetY: 0,
      clip: vi.fn(),
    }));
    HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock');

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();
    
    // Mock Image
    global.Image = class {
      constructor() {
        setTimeout(() => {
           if (this.onload) this.onload(); 
        }, 10);
      }
      set src(val) {
        this.width = 1200;
        this.height = 800;
      }
    };
  });

  const mockFile = new File(['(o_o)'], 'screen.png', { type: 'image/png' });

  it('renders correctly', () => {
    render(<ScreenshotEditor file={mockFile} onBack={() => {}} />);
    expect(screen.getByText('Screenshot Studio')).toBeInTheDocument();
  });

  it('shows styling controls', () => {
    render(<ScreenshotEditor file={mockFile} onBack={() => {}} />);
    expect(screen.getByText('Background')).toBeInTheDocument();
    expect(screen.getByText('Window Style')).toBeInTheDocument();
    expect(screen.getByText('Padding')).toBeInTheDocument();
  });

  it('toggles window frame checkbox', () => {
    render(<ScreenshotEditor file={mockFile} onBack={() => {}} />);
    // "Show Window Frame (Mac)" is the label text, but it's in a span next to input.
    // The click handler is on the div wrapper .checkbox-row
    const checkboxLabel = screen.getByText('Show Window Frame (Mac)');
    // We can click the label or the checkbox
    fireEvent.click(checkboxLabel);
    // Since state is internal, we can't easily check state, but we can check if it didn't crash
    expect(screen.getByText('Screenshot Studio')).toBeInTheDocument();
  });
});
