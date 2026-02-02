// Colores y estilos para PDFs
export const PDF_COLORS = {
    primary: '#EA580C', // Naranja de Quesadillas Candy
    secondary: '#1E40AF',
    success: '#059669',
    danger: '#DC2626',
    warning: '#D97706',
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        600: '#4B5563',
        900: '#111827'
    }
};

export const PDF_FONTS = {
    title: 18,
    subtitle: 14,
    heading: 12,
    body: 10,
    small: 8
};

export const PDF_MARGINS = {
    left: 20,
    right: 20,
    top: 20,
    bottom: 20
};

export const PDF_HEADER_HEIGHT = 35;
export const PDF_FOOTER_HEIGHT = 15;
export const PAGE_WIDTH = 210; // A4 width in mm
export const PAGE_HEIGHT = 297; // A4 height in mm
export const CONTENT_WIDTH = PAGE_WIDTH - PDF_MARGINS.left - PDF_MARGINS.right;
