import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    PDF_COLORS,
    PDF_FONTS,
    PDF_MARGINS,
    PDF_HEADER_HEIGHT,
    PDF_FOOTER_HEIGHT,
    PAGE_HEIGHT,
    CONTENT_WIDTH
} from './pdfStyles';
import { formatDate, hexToRgb } from './pdfUtils';

export interface KPIData {
    label: string;
    value: string;
    change?: string; // e.g., "↑ 15%" or "↓ 5%"
}

export class BasePDF {
    protected doc: jsPDF;
    protected pageNumber: number = 1;
    protected currentY: number = PDF_MARGINS.top + PDF_HEADER_HEIGHT + 10;

    constructor(orientation: 'portrait' | 'landscape' = 'portrait') {
        this.doc = new jsPDF({
            orientation,
            unit: 'mm',
            format: 'a4'
        });
    }

    /**
     * Agrega header con logo y título
     */
    addHeader(title: string, subtitle?: string) {
        const { doc } = this;
        const [r, g, b] = hexToRgb(PDF_COLORS.primary);

        // Línea superior naranja
        doc.setFillColor(r, g, b);
        doc.rect(0, 0, 210, 8, 'F');

        // Título
        doc.setFontSize(PDF_FONTS.title);
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'bold');
        doc.text('QUESADILLAS CANDY', PDF_MARGINS.left, 20);

        // Subtítulo (tipo de reporte)
        if (subtitle) {
            doc.setFontSize(PDF_FONTS.subtitle);
            doc.setFont('helvetica', 'normal');
            doc.text(subtitle, PDF_MARGINS.left, 27);
        }

        // Fecha en la esquina derecha
        doc.setFontSize(PDF_FONTS.small);
        doc.setTextColor(100, 100, 100);
        const dateText = formatDate(new Date());
        const dateWidth = doc.getTextWidth(dateText);
        doc.text(dateText, 210 - PDF_MARGINS.right - dateWidth, 20);

        // Línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(PDF_MARGINS.left, 32, 210 - PDF_MARGINS.right, 32);

        this.currentY = 40;
    }

    /**
     * Agrega footer con número de página
     */
    addFooter() {
        const { doc } = this;
        const y = PAGE_HEIGHT - 10;

        doc.setFontSize(PDF_FONTS.small);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'normal');

        // Número de página
        const pageText = `Página ${this.pageNumber}`;
        const textWidth = doc.getTextWidth(pageText);
        doc.text(pageText, 210 - PDF_MARGINS.right - textWidth, y);

        // Timestamp
        const timestamp = new Date().toLocaleString('es-MX');
        doc.text(`Generado: ${timestamp}`, PDF_MARGINS.left, y);
    }

    /**
     * Agrega una sección con título
     */
    addSection(title: string) {
        const { doc } = this;

        if (this.currentY > PAGE_HEIGHT - 50) {
            this.addNewPage();
        }

        doc.setFontSize(PDF_FONTS.heading);
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'bold');
        doc.text(title, PDF_MARGINS.left, this.currentY);

        this.currentY += 8;
    }

    /**
     * Agrega un KPI card
     */
    addKPI(kpi: KPIData, x: number, y: number, width: number = 50) {
        const { doc } = this;
        const height = 20;

        // Fondo
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(x, y, width, height, 2, 2, 'F');

        // Label
        doc.setFontSize(PDF_FONTS.small);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text(kpi.label, x + 3, y + 5);

        // Value
        doc.setFontSize(PDF_FONTS.subtitle);
        doc.setTextColor(30, 30, 30);
        doc.setFont('helvetica', 'bold');
        doc.text(kpi.value, x + 3, y + 12);

        // Change (if exists)
        if (kpi.change) {
            doc.setFontSize(PDF_FONTS.small);
            const isPositive = kpi.change.includes('↑');
            doc.setTextColor(isPositive ? 5 : 220, isPositive ? 150 : 38, isPositive ? 105 : 38);
            doc.text(kpi.change, x + 3, y + 17);
        }
    }

    /**
     * Agrega una tabla usando autotable
     */
    addTable(headers: string[], rows: any[][], options?: any) {
        const [primaryR, primaryG, primaryB] = hexToRgb(PDF_COLORS.primary);

        autoTable(this.doc, {
            head: [headers],
            body: rows,
            startY: this.currentY,
            margin: { left: PDF_MARGINS.left, right: PDF_MARGINS.right },
            styles: {
                fontSize: PDF_FONTS.body,
                cellPadding: 3
            },
            headStyles: {
                fillColor: [primaryR, primaryG, primaryB],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251]
            },
            ...options
        });

        // @ts-ignore
        this.currentY = this.doc.lastAutoTable.finalY + 10;
    }

    /**
     * Agrega texto simple
     */
    addText(text: string, fontSize: number = PDF_FONTS.body, bold: boolean = false) {
        if (this.currentY > PAGE_HEIGHT - 30) {
            this.addNewPage();
        }

        this.doc.setFontSize(fontSize);
        this.doc.setFont('helvetica', bold ? 'bold' : 'normal');
        this.doc.setTextColor(60, 60, 60);
        this.doc.text(text, PDF_MARGINS.left, this.currentY);

        this.currentY += fontSize / 2 + 2;
    }

    /**
     * Agrega una nueva página
     */
    addNewPage() {
        this.addFooter();
        this.doc.addPage();
        this.pageNumber++;
        this.currentY = PDF_MARGINS.top + 10;
    }

    /**
     * Descarga el PDF
     */
    save(filename: string) {
        this.addFooter();
        return this.doc.save(filename);
    }

    /**
     * Retorna el PDF como blob
     */
    toBlob(): Blob {
        this.addFooter();
        return this.doc.output('blob');
    }

    /**
     * Retorna el PDF como arraybuffer
     */
    toArrayBuffer(): ArrayBuffer {
        this.addFooter();
        return this.doc.output('arraybuffer');
    }

    /**
     * Retorna el PDF como data URI
     */
    toDataUri(): string {
        this.addFooter();
        return this.doc.output('datauristring');
    }
}
