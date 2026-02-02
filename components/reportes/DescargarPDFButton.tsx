import React from 'react';
import { generarTicketPedido, PedidoData } from '@/lib/pdf/cliente/ticketPedido';

interface DescargarPDFButtonProps {
    pedido: any; // Order from the app
    variant?: 'primary' | 'secondary' | 'icon';
    className?: string;
}

/**
 * Componente para descargar PDF de pedido
 */
export const DescargarPDFButton: React.FC<DescargarPDFButtonProps> = ({
    pedido,
    variant = 'secondary',
    className = ''
}) => {
    const [generando, setGenerando] = React.useState(false);

    const handleDescargar = async () => {
        setGenerando(true);

        try {
            // Mapear datos del pedido al formato esperado por el PDF
            const pedidoData: PedidoData = {
                id: pedido.id,
                fecha_pedido: pedido.created_at,
                cliente: {
                    nombre: pedido.user_name,
                    email: '', // No tenemos email en el objeto pedido
                    tipo: pedido.user_role
                },
                items: pedido.items.map((item: any) => ({
                    producto: item.product_name,
                    cantidad: item.quantity,
                    precio_unitario: item.unit_price,
                    subtotal: item.total
                })),
                subtotal: pedido.total,
                iva: 0,
                total: pedido.total,
                estado: pedido.status,
                fecha_entrega: pedido.delivery_date,
                notas: pedido.notes
            };

            // Generar PDF
            const pdfBlob = await generarTicketPedido(pedidoData);

            // Descargar
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pedido_${pedido.id.substring(0, 8)}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('Error generando el PDF. Por favor intenta de nuevo.');
        } finally {
            setGenerando(false);
        }
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleDescargar}
                disabled={generando}
                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${generando ? 'opacity-50 cursor-not-allowed' : ''
                    } ${className}`}
                title="Descargar ticket PDF"
            >
                {generando ? (
                    <svg className="w-5 h-5 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                )}
            </button>
        );
    }

    const baseClass =
        variant === 'primary'
            ? 'bg-primary hover:bg-primary/90 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700';

    return (
        <button
            onClick={handleDescargar}
            disabled={generando}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${baseClass} ${generando ? 'opacity-50 cursor-not-allowed' : ''
                } ${className}`}
        >
            {generando ? (
                <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Generando...
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    Descargar PDF
                </>
            )}
        </button>
    );
};
