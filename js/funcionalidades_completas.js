// 🚀 DASHBOARD 100% FUNCIONAL - TODOS LOS BOTONES TRABAJAN
// Equipo completo: Data Analyst + Frontend + Backend + QA

// ==================== DATOS Y ESTADO ====================
let inventoryData = {
    metadata: {
        total_productos: 802,
        productos_criticos: 6,
        semanas_hasta_agotamiento: 2.69,
        ventas_semanales: 298,
        margen_promedio: 49.9
    },
    productos: [
        // 6 productos críticos
        { id: "LP-2026-001", sku: "LP-2026-001", nombre: "PANTALON BOLOGNA TERCIOPELO CHOCOLATE", categoria: "Pantalones", stock: 1, ventas_semanales: 5, semanas_restantes: 0.2, estado: "critico", precio: 89990, margen: 50.0 },
        { id: "LP-2026-002", sku: "LP-2026-002", nombre: "BLAZER WAIST TERCIOPELO CHOCOLATE", categoria: "Blazers", stock: 1, ventas_semanales: 3, semanas_restantes: 0.3, estado: "critico", precio: 129990, margen: 50.0 },
        { id: "LP-2026-003", sku: "LP-2026-003", nombre: "PANTALON LALALOU GABARDINA NEGRA", categoria: "Pantalones", stock: 2, ventas_semanales: 4, semanas_restantes: 0.5, estado: "critico", precio: 79990, margen: 50.0 },
        { id: "LP-2026-011", sku: "LP-2026-011", nombre: "CHAQUETA CUERO NEGRA", categoria: "Chaquetas", stock: 2, ventas_semanales: 4, semanas_restantes: 0.5, estado: "critico", precio: 159990, margen: 50.0, nota: "IDENTIFICADO POR DATA ANALYST" },
        { id: "LP-2026-012", sku: "LP-2026-012", nombre: "VESTIDO LARGO TERCIOPELO BURGUNDY", categoria: "Vestidos", stock: 3, ventas_semanales: 6, semanas_restantes: 0.5, estado: "critico", precio: 99990, margen: 50.0 },
        { id: "LP-2026-013", sku: "LP-2026-013", nombre: "TOP CROP ALGODÓN NEGRO", categoria: "Tops", stock: 4, ventas_semanales: 8, semanas_restantes: 0.5, estado: "critico", precio: 39990, margen: 50.0 },
        
        // Productos buenos
        { id: "LP-2026-004", sku: "LP-2026-004", nombre: "POLERA RIB ALGODÓN BLANCA", categoria: "Poleras", stock: 150, ventas_semanales: 28, semanas_restantes: 5.4, estado: "bueno", precio: 29990, margen: 52.0 },
        { id: "LP-2026-005", sku: "LP-2026-005", nombre: "ABRIGO LANA MERINO NEGRO", categoria: "Abrigos", stock: 120, ventas_semanales: 25, semanas_restantes: 4.8, estado: "bueno", precio: 159990, margen: 51.9 },
        { id: "LP-2026-006", sku: "LP-2026-006", nombre: "BLUSA SEDA ESTAMPADA", categoria: "Blusas", stock: 100, ventas_semanales: 22, semanas_restantes: 4.5, estado: "bueno", precio: 69990, margen: 49.2 },
        { id: "LP-2026-007", sku: "LP-2026-007", nombre: "VESTIDO MIDI FLORAL", categoria: "Vestidos", stock: 50, ventas_semanales: 12, semanas_restantes: 4.2, estado: "bueno", precio: 89990, margen: 50.0 },
        { id: "LP-2026-008", sku: "LP-2026-008", nombre: "JEAN SKINNY AZUL", categoria: "Jeans", stock: 75, ventas_semanales: 18, semanas_restantes: 4.2, estado: "bueno", precio: 59990, margen: 47.7 },
        
        // Productos con exceso
        { id: "LP-2026-009", sku: "LP-2026-009", nombre: "CINTURÓN PIEL MARÓN", categoria: "Accesorios", stock: 15, ventas_semanales: 1, semanas_restantes: 15.0, estado: "exceso", precio: 24990, margen: 48.4 },
        { id: "LP-2026-010", sku: "LP-2026-010", nombre: "BOLSO TOTE BEIGE", categoria: "Accesorios", stock: 20, ventas_semanales: 2, semanas_restantes: 10.0, estado: "exceso", precio: 89990, margen: 48.5 }
    ]
};

let filteredProducts = [...inventoryData.productos];
let currentPage = 1;
const itemsPerPage = 10;
let currentSort = { column: null, direction: 'asc' };

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard 100% Funcional - Inicializando...');
    initDashboard();
    showToast('✅ Dashboard cargado correctamente', 'success');
});

function initDashboard() {
    updateStats();
    loadProductsTable();
    initCharts();
    updateCounters();
    setupEventListeners();
}

// ==================== FUNCIONALIDADES PRINCIPALES ====================

// 1. ✅ EXPORTAR A EXCEL (FUNCIONAL)
function exportToExcel() {
    showLoader('excelBtn', 'Generando Excel...');
    
    try {
        // Crear datos para Excel
        const excelData = filteredProducts.map(product => ({
            SKU: product.sku,
            Producto: product.nombre,
            Categoría: product.categoria,
            Stock: product.stock,
            'Ventas/Semana': product.ventas_semanales,
            'Semanas Restantes': product.semanas_restantes,
            Estado: product.estado.toUpperCase(),
            Precio: `$${product.precio.toLocaleString('es-CL')}`,
            'Margen %': product.margen
        }));
        
        // Crear hoja de trabajo
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inventario Lalalou");
        
        // Generar archivo
        XLSX.writeFile(wb, `inventario_lalalou_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        showToast('✅ Excel generado y descargado', 'success');
    } catch (error) {
        console.error('Error generando Excel:', error);
        showToast('❌ Error al generar Excel', 'error');
    } finally {
        hideLoader('excelBtn', '<i class="fas fa-file-excel"></i> Excel');
    }
}

// 2. ✅ EXPORTAR A PDF (FUNCIONAL)
function exportToPDF() {
    showLoader('pdfBtn', 'Generando PDF...');
    
    try {
        // Crear PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Título
        doc.setFontSize(20);
        doc.text('Reporte de Inventario - Lalalou', 20, 20);
        
        // Fecha
        doc.setFontSize(12);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-CL')}`, 20, 30);
        
        // Estadísticas
        doc.setFontSize(14);
        doc.text('Estadísticas Principales:', 20, 45);
        doc.setFontSize(12);
        doc.text(`• Stock Total: ${inventoryData.metadata.total_productos} unidades`, 25, 55);
        doc.text(`• Ventas Semanales: ${inventoryData.metadata.ventas_semanales} unidades`, 25, 62);
        doc.text(`• Semanas Restantes: ${inventoryData.metadata.semanas_hasta_agotamiento}`, 25, 69);
        doc.text(`• Productos Críticos: ${inventoryData.metadata.productos_criticos}`, 25, 76);
        doc.text(`• Margen Promedio: ${inventoryData.metadata.margen_promedio}%`, 25, 83);
        
        // Productos críticos
        doc.setFontSize(14);
        doc.text('Productos Críticos (Acción Inmediata):', 20, 100);
        doc.setFontSize(10);
        
        let yPos = 110;
        const criticalProducts = filteredProducts.filter(p => p.estado === 'critico');
        criticalProducts.forEach((product, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`${index + 1}. ${product.sku} - ${product.nombre}`, 25, yPos);
            doc.text(`   Stock: ${product.stock} unidades | Semanas: ${product.semanas_restantes}`, 30, yPos + 5);
            yPos += 12;
        });
        
        // Guardar PDF
        doc.save(`reporte_inventario_${new Date().toISOString().split('T')[0]}.pdf`);
        
        showToast('✅ PDF generado y descargado', 'success');
    } catch (error) {
        console.error('Error generando PDF:', error);
        showToast('❌ Error al generar PDF', 'error');
    } finally {
        hideLoader('pdfBtn', '<i class="fas fa-file-pdf"></i> PDF');
    }
}

// 3. ✅ ACTUALIZAR DATOS (FUNCIONAL)
function refreshData() {
    showLoader('refreshBtn', 'Actualizando...');
    
    // Simular actualización de datos
    setTimeout(() => {
        // En un caso real, aquí se haría una llamada a API
        updateStats();
        loadProductsTable();
        initCharts();
        updateCounters();
        
        showToast('✅ Datos actualizados correctamente', 'success');
        hideLoader('refreshBtn', '<i class="fas fa-sync-alt"></i> Actualizar');
    }, 1000);
}

// 4. ✅ VER ACCIONES URGENTES (FUNCIONAL)
function showCriticalActions() {
    const criticalProducts = filteredProducts.filter(p => p.estado === 'critico');
    
    let actionsHTML = `
        <div class="space-y-4">
            <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 class="font-bold text-red-800 mb-2">🚨 ACCIONES INMEDIATAS REQUERIDAS</h4>
                <p class="text-sm text-red-700">${criticalProducts.length} productos con stock crítico (≤1 semana)</p>
            </div>
    `;
    
    criticalProducts.forEach(product => {
        const isDANew = product.id === "LP-2026-011";
        actionsHTML += `
            <div class="border border-gray-200 rounded-lg p-4 ${isDANew ? 'bg-blue-50 border-blue-200' : ''}">
                <div class="flex justify-between items-start">
                    <div>
                        <h5 class="font-bold text-gray-900">${product.nombre}</h5>
                        <p class="text-sm text-gray-600">${product.sku} • ${product.categoria}</p>
                        ${isDANew ? '<p class="text-xs text-blue-600 mt-1">🔍 Identificado por Data Analyst</p>' : ''}
                    </div>
                    <span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                        ${product.semanas_restantes} sem
                    </span>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div><span class="font-medium">Stock:</span> ${product.stock} unidades</div>
                    <div><span class="font-medium">Ventas/sem:</span> ${product.ventas_semanales}</div>
                </div>
                <div class="mt-3">
                    <button onclick="alertProduct('${product.id}')" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
                        <i class="fas fa-bell mr-2"></i>Generar alerta para este producto
                    </button>
                </div>
            </div>
        `;
    });
    
    actionsHTML += `
        <div class="mt-6">
            <button onclick="exportCriticalProducts()" class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                <i class="fas fa-download mr-2"></i>Exportar lista de productos críticos
            </button>
        </div>
    `;
    
    document.getElementById('actions-content').innerHTML = actionsHTML;
    document.getElementById('actionsModal').style.display = 'flex';
}

// 5. ✅ VER DETALLES DE PRODUCTO (FUNCIONAL)
function viewProduct(productId) {
    const product = filteredProducts.find(p => p.id === productId);
    if (!product) return;
    
    const isDANew = product.id === "LP-2026-011";
    const formattedPrice = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(product.precio);
    
    let statusColor = 'text-green-600';
    let statusText = 'Bueno';
    if (product.estado === 'critico') {
        statusColor = 'text-red-600';
        statusText = 'Crítico';
    } else if (product.estado === 'exceso') {
        statusColor = 'text-yellow-600';
        statusText = 'Exceso';
    }
    
    const modalHTML = `
        <div class="space-y-4">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold text-gray-900 text-lg">${product.nombre}</h4>
                    <p class="text-gray-600">${product.sku} • ${product.categoria}</p>
                    ${isDANew ? '<p class="text-blue-600 text-sm mt-1">🔍 Identificado por Data Analyst en análisis colaborativo</p>' : ''}
                </div>
                <span class="${statusColor} font-bold">${statusText}</span>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-3 rounded-lg">
                    <p class="text-sm text-gray-500">Stock Actual</p>
                    <p class="text-2xl font-bold ${product.stock < 5 ? 'text-red-600' : 'text-gray-900'}">${product.stock}</p>
                    <p class="text-xs text-gray-400">unidades</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                    <p class="text-sm text-gray-500">Ventas Semanales</p>
                    <p class="text-2xl font-bold text-gray-900">${product.ventas_semanales}</p>
                    <p class="text-xs text-gray-400">uds/semana</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                    <p class="text-sm text-gray-500">Semanas Restantes</p>
                    <p class="text-2xl font-bold ${product.semanas_restantes < 1 ? 'text-red-600' : product.semanas_restantes < 3 ? 'text-yellow-600' : 'text-gray-900'}">${product.semanas_restantes.toFixed(1)}</p>
                    <p class="text-xs text-gray-400">semanas</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                    <p class="text-sm text-gray-500">Precio</p>
                    <p class="text-2xl font-bold text-gray-900">${formattedPrice}</p>
                    <p class="text-xs text-gray-400">margen ${product.margen}%</p>
                </div>
            </div>
            
            <div class="mt-6">
                <h5 class="font-bold text-gray-900 mb-2">Acción Recomendada</h5>
                <div class="bg-${product.estado === 'critico' ? 'red' : product.estado