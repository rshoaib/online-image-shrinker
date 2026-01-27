import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ToolSelector from './ToolSelector';

// Mock translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
        const translations = {
            'home.title': 'Select a Tool',
            'home.subtitle': 'Choose how you want to optimize your images today.',
            'common.select': 'Select',
            'home.tools.compress.title': 'Compress Image',
            'home.tools.compress.desc': 'Reduce file size',
            'home.tools.resize.title': 'Resize Image',
            'home.tools.crop.title': 'Crop Image',
            'home.tools.watermark.title': 'Watermark',
            'home.tools.pdf.title': 'Images to PDF',
            'home.tools.remove_bg.title': 'Remove Background',
            'home.tools.upscale.title': 'AI Upscale',
            'home.tools.screenshot.title': 'Screenshot Mockups',
            'home.tools.grid.title': 'Grid Splitter',
            'home.tools.profile.title': 'Profile Pic Maker',
            'home.tools.exif.title': 'EXIF Viewer',
            'home.tools.redact.title': 'Privacy Blur',
            'home.tools.converter.title': 'Image Converter',
            'home.tools.converter.desc': 'Convert images between formats',
            'home.tools.meme.title': 'Meme Generator',
            'home.tools.meme.desc': 'Create viral memes',
            'home.tools.palette.title': 'Palette Generator',
            'home.tools.palette.desc': 'Extract color palettes'
        };
        return translations[key] || key;
    }
  }),
}));

describe('ToolSelector Component', () => {
    it('renders the header correctly', () => {
        render(<ToolSelector onSelectTool={() => {}} />);
        expect(screen.getByText('Select a Tool')).toBeInTheDocument();
        expect(screen.getByText('Choose how you want to optimize your images today.')).toBeInTheDocument();
    });

    it('renders all tool cards with translated titles', () => {
        render(<ToolSelector onSelectTool={() => {}} />);
        
        // Old tools
        expect(screen.getByText('Compress Image')).toBeInTheDocument();
        expect(screen.getByText('Resize Image')).toBeInTheDocument();
        
        // New tools (localized)
        expect(screen.getByText('Image Converter')).toBeInTheDocument();
        expect(screen.getByText('Meme Generator')).toBeInTheDocument();
        expect(screen.getByText('Palette Generator')).toBeInTheDocument();
    });

    it('renders new tools descriptions correctly', () => {
        render(<ToolSelector onSelectTool={() => {}} />);
        expect(screen.getByText('Convert images between formats')).toBeInTheDocument();
        expect(screen.getByText('Create viral memes')).toBeInTheDocument();
        expect(screen.getByText('Extract color palettes')).toBeInTheDocument();
    });

    it('calls onSelectTool when a card is clicked', () => {
        const mockSelect = vi.fn();
        render(<ToolSelector onSelectTool={mockSelect} />);
        
        fireEvent.click(screen.getByText('Compress Image').closest('button'));
        expect(mockSelect).toHaveBeenCalledWith('compress');

        fireEvent.click(screen.getByText('Image Converter').closest('button'));
        expect(mockSelect).toHaveBeenCalledWith('image-converter');
    });
});
