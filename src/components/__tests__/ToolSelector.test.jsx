import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ToolSelector from '../ToolSelector';

import en from '../../locales/en.json';

// Mock translation to use the actual English strings
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      // Simple deep object access for "home.tools.compress.title" style keys
      const parts = key.split('.');
      let current = en;
      for (const part of parts) {
        if (current[part] === undefined) return key;
        current = current[part];
      }
      return current;
    },
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}));

describe('ToolSelector Component', () => {
    it('renders all tool cards', () => {
        const mockSelect = vi.fn();
        render(<ToolSelector onSelectTool={mockSelect} />);

        // Standard tools (titles from en.json)
        expect(screen.getByText(/Compress Image/i)).toBeInTheDocument();
        expect(screen.getByText(/Resize Image/i)).toBeInTheDocument();
        expect(screen.getByText(/Crop Image/i)).toBeInTheDocument();
        expect(screen.getByText(/Watermark/i)).toBeInTheDocument();
        expect(screen.getByText(/Images to PDF/i)).toBeInTheDocument();
        expect(screen.getByText(/Remove Background/i)).toBeInTheDocument();
        expect(screen.getByText(/AI Upscale/i)).toBeInTheDocument();
        
        // Tools
        expect(screen.getByText(/Grid Splitter/i)).toBeInTheDocument();
        expect(screen.getByText(/Privacy Blur/i)).toBeInTheDocument();
        expect(screen.getByText(/Screenshot Mockups/i)).toBeInTheDocument();
        expect(screen.getByText(/Profile Pic Maker/i)).toBeInTheDocument();
        expect(screen.getByText(/EXIF Viewer/i)).toBeInTheDocument();
        expect(screen.getByText(/Image Converter/i)).toBeInTheDocument();
        expect(screen.getByText(/Meme Generator/i)).toBeInTheDocument();
        expect(screen.getByText(/Palette Generator/i)).toBeInTheDocument();
        expect(screen.getByText(/Magic Eraser/i)).toBeInTheDocument();

        // Newly internationalized tools
        expect(screen.getByText(/Photo Collage/i)).toBeInTheDocument();
        expect(screen.getByText(/Scan Text/i)).toBeInTheDocument();
        expect(screen.getByText(/QR Code Generator/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Digital Signature/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Video to GIF/i)).toBeInTheDocument();
        expect(screen.getByText(/Video to MP3/i)).toBeInTheDocument();
        expect(screen.getByText(/Social Preview/i)).toBeInTheDocument();
        expect(screen.getByText(/Image Compare/i)).toBeInTheDocument();
        expect(screen.getByText(/Photo Filters/i)).toBeInTheDocument();
        expect(screen.getByText(/Video Compressor/i)).toBeInTheDocument();
    });

    it('calls onSelectTool with correct ID when clicked', () => {
        const mockSelect = vi.fn();
        render(<ToolSelector onSelectTool={mockSelect} />);

        const tools = [
            { text: 'Compress Image', id: 'compress' },
            { text: 'Resize Image', id: 'resize' },
            { text: 'Grid Splitter', id: 'grid-splitter' },
            { text: 'Privacy Blur', id: 'redact' },
            { text: 'Image Converter', id: 'image-converter' },
            { text: 'Magic Eraser', id: 'magic-eraser' }
        ];

        tools.forEach(({ text, id }) => {
            fireEvent.click(screen.getByText(new RegExp(text, 'i')));
            expect(mockSelect).toHaveBeenCalledWith(id);
        });
    });
});
