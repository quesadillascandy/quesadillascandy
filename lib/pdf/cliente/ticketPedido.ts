import { BasePDF } from '../pdfBase';
import { formatMoney, formatDateTime, shortId } from '../pdfUtils';
import { PDF_MARGINS } from '../pdfStyles';

export interface PedidoData {
    id: string;
    fecha_pedido: string;
    cliente: {
        nombre: string;
        email: string;
        tipo: string; // MAYORISTA, MINORISTA, etc
    };
    items: Array<{
        producto: string;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
    }>;
    subtotal: number;
    iva: number;
    total: number;
    estado: string;
    fecha_entrega?: string;
    notas?: string;
}

export class TicketPedidoPDF extends BasePDF {
    constructor() {
        super('portrait');
    }

    generate(pedido: PedidoData): Blob {
        // Header
        this.addHeader('TICKET DE PEDIDO', `Pedido #${shortId(pedido.id)}`);

        // Información del pedido
        this.currentY += 5;
        this.addText(`Fecha: ${formatDateTime(pedido.fecha_pedido)}`, 10);
        this.addText(`Cliente: ${pedido.cliente.nombre}`, 10);
        this.addText(`Tipo: ${pedido.cliente.tipo}`, 10);
        this.addText(`Estado: ${pedido.estado.toUpperCase()}`, 10, true);

        if (pedido.fecha_entrega) {
            this.addText(`Fecha de Entrega: ${formatDateTime(pedido.fecha_entrega)}`, 10);
        }

        this.currentY += 5;

        // Línea separadora
        this.doc.setDrawColor(200, 200, 200);
        this.doc.line(
            PDF_MARGINS.left,
            this.currentY,
            210 - PDF_MARGINS.right,
            this.currentY
        );

        this.currentY += 8;

        // Tabla de productos
        this.addSection('PRODUCTOS');

        const rows = pedido.items.map(item => [
            item.producto,
            `x${item.cantidad}`,
            formatMoney(item.precio_unitario),
            formatMoney(item.subtotal)
        ]);

        this.addTable(
            ['Producto', 'Cant.', 'P. Unit.', 'Subtotal'],
            rows
        );

        // Totales
        this.currentY += 5;
        const totalesX = 210 - PDF_MARGINS.right - 60;

        this.doc.setFontSize(10);
        this.doc.setTextColor(60, 60, 60);

        // Subtotal
        this.doc.text('Subtotal:', totalesX, this.currentY);
        this.doc.text(formatMoney(pedido.subtotal), totalesX + 30, this.currentY, { align: 'right' });

        this.currentY += 6;

        // IVA
        this.doc.text('IVA:', totalesX, this.currentY);
        this.doc.text(formatMoney(pedido.iva), totalesX + 30, this.currentY, { align: 'right' });

        this.currentY += 8;

        // Total - en bold
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(12);
        this.doc.text('TOTAL:', totalesX, this.currentY);
        this.doc.text(formatMoney(pedido.total), totalesX + 30, this.currentY, { align: 'right' });

        // Notas (si existen)
        if (pedido.notas && pedido.notas.trim()) {
            this.currentY += 15;
            this.addSection('NOTAS');
            this.doc.setFontSize(9);
            this.doc.setFont('helvetica', 'normal');
            this.doc.text(pedido.notas, PDF_MARGINS.left, this.currentY);
        }

        // Mensaje de agradecimiento
        this.currentY = 260; // Cerca del final
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'italic');
        this.doc.setTextColor(100, 100, 100);
        const thanks = '¡Gracias por tu compra!';
        const thanksWidth = this.doc.getTextWidth(thanks);
        this.doc.text(thanks, (210 - thanksWidth) / 2, this.currentY);

        return this.toBlob();
    }
}

/**
 * Función helper para generar ticket de pedido
 */
export async function generarTicketPedido(pedido: PedidoData): Promise<Blob> {
    const pdf = new TicketPedidoPDF();
    return pdf.generate(pedido);
}
