import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ProfilePictureEditor from './ProfilePictureEditor';

// Mock the AI library
vi.mock('@imgly/background-removal', () => ({
  removeBackground: vi.fn(() => Promise.resolve(new Blob(['fake-image'], { type: 'image/png' })))
}));

describe('ProfilePictureEditor', () => {
  beforeEach(() => {
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
        this.width = 500;
        this.height = 500;
      }
    };
  });

  const mockFile = new File(['(^_^)'], 'me.jpg', { type: 'image/jpeg' });

  it('renders and starts processing', () => {
    // It starts processing immediately on mount with a file
    render(<ProfilePictureEditor file={mockFile} onBack={() => {}} />);
    expect(screen.getByText('Profile Maker')).toBeInTheDocument();
  });

  it('shows controls', async () => {
    render(<ProfilePictureEditor file={mockFile} onBack={() => {}} />);
    
    // Controls might be visible immediately or after processing?
    // In code: The toolbar is always rendered.
    expect(screen.getByText('Background')).toBeInTheDocument();
    expect(screen.getByText('Scaling & Position')).toBeInTheDocument();
    expect(screen.getByText('Border Ring')).toBeInTheDocument();
  });
});
