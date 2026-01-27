import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageConverterEditor from '../ImageConverterEditor';

describe('ImageConverterEditor', () => {
  beforeEach(() => {
    // Mock HTMLCanvasElement
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      fillRect: vi.fn(),
    }));
    HTMLCanvasElement.prototype.toBlob = vi.fn((callback) => callback(new Blob(['mock'], { type: 'image/jpeg' })));

    // Mock URL.createObjectURL
    globalThis.URL.createObjectURL = vi.fn(() => 'mock-url');
    globalThis.URL.revokeObjectURL = vi.fn();
    
    // Mock Image
    globalThis.Image = class {
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

  const mockFile = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });

  it('renders correctly', () => {
    render(<ImageConverterEditor file={mockFile} onBack={() => {}} />);
    expect(screen.getByText('Image Converter')).toBeInTheDocument();
  });

  it('shows format options', () => {
    render(<ImageConverterEditor file={mockFile} onBack={() => {}} />);
    expect(screen.getByText('JPG')).toBeInTheDocument();
    expect(screen.getByText('PNG')).toBeInTheDocument();
    expect(screen.getByText('WebP')).toBeInTheDocument();
  });

  it('allows format selection', () => {
    render(<ImageConverterEditor file={mockFile} onBack={() => {}} />);
    
    const webpBtn = screen.getByText('WebP');
    fireEvent.click(webpBtn);
    expect(webpBtn).toHaveClass('active');
  });

  it('shows transparency warning for png to jpg conversion', async () => {
    render(<ImageConverterEditor file={mockFile} onBack={() => {}} />);
    // Default is JPG, so warning should handle transparency
    expect(screen.getByText('Transparency will be replaced with white background.')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(<ImageConverterEditor file={mockFile} onBack={onBack} />);
    
    const backBtn = screen.getByText('Back');
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalled();
  });

  it('handles conversion process', async () => {
     render(<ImageConverterEditor file={mockFile} onBack={() => {}} />);
     
     const convertBtn = screen.getByText('Convert & Download');
     fireEvent.click(convertBtn);
     
     expect(screen.getByText('Converting...')).toBeInTheDocument();
     
     await waitFor(() => {
        expect(screen.getByText('Convert & Download')).toBeInTheDocument();
     });
  });
});
