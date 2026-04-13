// DASHBOARD REAL LALALOU - JavaScript Completo
// Todos los botones 100% funcionales

// DATOS REALES BASADOS EN EL EXCEL DE LALALOU
const realData = {
    stats: {
        totalProducts: 298,
        criticalProducts: 201,
        weeklySales: 399,
        weeksRemaining: 2.8,
        totalStock: 2107,
        healthScore: 33,
        inventoryValue: 287000000,
        categories: 8
    },
    
    criticalProducts: [
        {id: 1, name: "PANTALON BOLOGNA NEGRO", category: "Pantalones", stock: 1, weeks: 0.2, sales: 5},
        {id: 2, name: "BLAZER WAIST AZUL MARINO", category: "Blazers", stock: 1, weeks: 0.3, sales: 3},
        {id: 3, name: "BLUSA SILK CREMA", category: "Blusas", stock: 2, weeks: 0.5, sales: 4},
        {id: 4, name: "CHAQUETA CUERO NEGRA", category: "Abrigos", stock: 2, weeks: 0.5, sales: 4},
        {id: 5, name: "PANTALON GABARDINA BEIGE", category: "Pantalones", stock: 2, weeks: 0.5, sales: 4},
        {id: 6, name: "VESTIDO TERCIOPELO BURDEOS", category: "Vestidos", stock: 3, weeks: 0.5, sales: 6},
        {id: 7, name: "TOP CROP ALGODÓN BLANCO", category: "Poleras", stock: 4, weeks: 0.5, sales: 8},
        {id: 8, name: "JEANS SKINNY AZUL", category: "Jeans", stock: 3, weeks: 0.4, sales: 7},
        {id: 9, name: "CARDIGAN LANA GRIS", category: "Abrigos", stock: 2, weeks: 0.3, sales: 6},
        {id: 10, name: "FALDA MIDI PLISADA", category: "Faldas", stock: 1, weeks: 0.2, sales: 5}
    ],
    
    categories: [
        {name: "Pantalones", count: 44, critical: 44, sales: 85},
        {name: "Blusas", count: 40, critical: 40, sales: 92},
        {name: "Blazers", count: 8, critical: 8, sales: 15},
        {name: "Abrigos", count: 25, critical: 18, sales: 48},
        {name: "Poleras", count: 28, critical: 22, sales: 66},
        {name: "Jeans", count: 18, critical: 15, sales: 42},
        {name: "Accesorios", count: 35, critical: 20, sales: 51},
        {name: "Otros", count: 100, critical: 34, sales: 0}
    ],
    
    stockLevels: [
        {level: "Crítico (≤1 semana)", count: 201, color: "#ef4444"},
        {level: "Advertencia (1-2 semanas)", count: 67, color: "#f59e0b"},
        {level: "Seguro (>2 semanas)", count: 30, color: "#10b981"}
    ]
};

// VARIABLES GLOBALES
let chartInstances = {};
let filteredProducts = [...realData.criticalProducts];

// FUNCIONES DE UI
function showLoader(text = "Procesando...") {
    document.getElementById('loaderText').textContent = text;
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('loader').classList.add('flex');
}

function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('loader').classList.remove('flex');
}

function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('analysisModal').classList.remove('hidden');
    document.getElementById('analysisModal').classList.add('flex');
}

function closeModal() {
    document.getElementById('analysisModal').classList.add('hidden');
    document.getElementById('analysisModal').classList.remove('flex');
}

function showToast(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg z-50 fade-in`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// FUNCIONES DE EXPORTACIÓN
function exportRealExcel() {
    showLoader("Generando reporte Excel...");
    
    setTimeout(() => {
        try {
            // Crear datos para Excel
            const excelData = [
                ["REPORTE EJECUTIVO - INVENTARIO LALALOU"],
                ["Generado:", new Date().toLocaleDateString('es-CL')],
                ["Total productos:", realData.stats.totalProducts],
                ["Productos críticos:", realData.stats.criticalProducts],
                ["Ventas semanales:", realData.stats.weeklySales],
                ["Semanas restantes promedio:", realData.stats.weeksRemaining],
                ["Health Score:", realData.stats.healthScore + "%"],
                ["Valor inventario:", "$" + (realData.stats.inventoryValue/1000000).toFixed(1) + "M CLP"],
                [],
                ["PRODUCTOS MÁS CRÍTICOS"],
                ["Producto", "Categoría", "Stock", "Semanas", "Ventas Sem."]
            ];
            
            // Agregar productos críticos
            realData.criticalProducts.forEach(p => {
                excelData.push([p.name, p.category, p.stock, p.weeks, p.sales]);
            });
            
            // Crear hoja de trabajo
            const ws = XLSX.utils.aoa_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Reporte Ejecutivo");
            
            // Formato
            ws['!cols'] = [
                { wch: 35 }, // Producto
                { wch: 15 }, // Categoría
                { wch: 10 }, // Stock
                { wch: 12 }, // Semanas
                { wch: 12 }  // Ventas
            ];
            
            // Generar archivo
            XLSX.writeFile(wb, `reporte_lalalou_${new Date().toISOString().split('T')[0]}.xlsx`);
            
            hideLoader();
            showToast("✅ Reporte Excel generado correctamente", "success");
        } catch (error) {
            hideLoader();
            showToast("❌ Error al generar Excel: " + error.message, "error");
            console.error("Excel error:", error);
        }
    }, 1500);
}

function exportRealPDF() {
    showLoader("Generando reporte PDF...");
    
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Configuración
            doc.setProperties({
                title: 'Reporte Ejecutivo - Inventario Lalalou',
                subject: 'Análisis de stock crítico',
                author: 'Dashboard Real Lalalou',
                keywords: 'inventario, stock, crítico, lalalou'
            });
            
            // Portada
            doc.setFontSize(24);
            doc.setTextColor(10, 37, 64);
            doc.text('REPORTE EJECUTIVO', 20, 30);
            doc.text('INVENTARIO LALALOU', 20, 40);
            
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generado: ${new Date().toLocaleDateString('es-CL')}`, 20, 55);
            doc.text('Dashboard Real - Datos del Excel', 20, 62);
            
            // Estadísticas
            doc.setFontSize(16);
            doc.setTextColor(10, 37, 64);
            doc.text('ESTADÍSTICAS PRINCIPALES', 20, 80);
            
            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            
            const stats = [
                `• Total productos: ${realData.stats.totalProducts}`,
                `• Productos críticos: ${realData.stats.criticalProducts} (67%)`,
                `• Ventas semanales: ${realData.stats.weeklySales} unidades`,
                `• Semanas restantes promedio: ${realData.stats.weeksRemaining}`,
                `• Health Score: ${realData.stats.healthScore}% (CRÍTICO)`,
                `• Valor inventario: $${(realData.stats.inventoryValue/1000000).toFixed(1)}M CLP`
            ];
            
            let yPos = 90;
            stats.forEach(line => {
                doc.text(line, 25, yPos);
                yPos += 7;
            });
            
            // Productos críticos
            doc.addPage();
            doc.setFontSize(16);
            doc.setTextColor(10, 37, 64);
            doc.text('PRODUCTOS MÁS CRÍTICOS', 20, 30);
            
            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            
            const tableData = [
                ["Producto", "Categoría", "Stock", "Semanas"],
                ...realData.criticalProducts.slice(0, 8).map(p => [
                    p.name.substring(0, 25) + (p.name.length > 25 ? "..." : ""),
                    p.category,
                    p.stock.toString(),
                    p.weeks.toString()
                ])
            ];
            
            doc.autoTable({
                startY: 40,
                head: [tableData[0]],
                body: tableData.slice(1),
                theme: 'striped',
                headStyles: { fillColor: [10, 37, 64] },
                margin: { left: 20 }
            });
            
            // Recomendaciones
            const finalY = doc.lastAutoTable.finalY || 100;
            doc.setFontSize(16);
            doc.setTextColor(10, 37, 64);
            doc.text('RECOMENDACIONES URGENTES', 20, finalY + 20);
            
            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            
            const recommendations = [
                "1. Reabastecimiento inmediato de 201 productos críticos",
                "2. Priorizar pantalones (44) y blusas (40) en estado crítico",
                "3. Negociar con proveedores para entrega en 72h",
                "4. Implementar sistema de alertas diarias",
                "5. Revisar política de precios para productos con bajo margen"
            ];
            
            yPos = finalY + 30;
            recommendations.forEach(line => {
                doc.text(line, 25, yPos);
                yPos += 7;
            });
            
            // Guardar PDF
            doc.save(`reporte_ejecutivo_lalalou_${new Date().toISOString().split('T')[0]}.pdf`);
            
            hideLoader();
            showToast("✅ Reporte PDF generado correctamente", "success");
        } catch (error) {
            hideLoader();
            showToast("❌ Error al generar PDF: " + error.message, "error");
            console.error("PDF error:", error);
        }
    }, 1500);
}

function showCriticalAnalysis() {
    const content = `
        <div class="space-y-4">
            <div class="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl">
                <h4 class="font-bold text-red-900 text-lg">📊 ANÁLISIS CRÍTICO COMPLETO</h4>
                <p class="text-red-700">Situación actual del inventario Lalalou</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-white p-4 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-500">Productos Críticos</p>
                    <p class="text-2xl font-bold text-red-600">${realData.stats.criticalProducts}</p>
                    <p class="text-xs text-gray-400">67% del inventario total</p>
                </div>
                <div class="bg-white p-4 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-500">Health Score</p>
                    <p class="text-2xl font-bold text-orange-600">${realData.stats.healthScore}%</p>
                    <p class="text-xs text-gray-400">Nivel CRÍTICO</p>
                </div>
            </div>
            
            <div class="bg-white p-4 rounded-lg border border-gray-200">
                <h5 class="font-semibold text-gray-800 mb-2">🚨 Categorías Más Afectadas</h5>
                <ul class="space-y-2">
                    ${realData.categories.filter(c => c.critical > 0).map(c => `
                        <li class="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span class="font-medium">${c.name}</span>
                            <span class="text-red-600 font-bold">${c.critical} productos críticos</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="bg-white p-4 rounded-lg border border-gray-200">
                <h5 class="font-semibold text-gray-800 mb-2">📈 Proyección</h5>
                <p class="text-gray-600">Con las ventas actuales de ${realData.stats.weeklySales} unidades semanales:</p>
                <ul class="mt-2 space-y-1 text-sm">
                    <li>• Stock total: ${realData.stats.totalStock} unidades</li>
                    <li>• Semanas hasta agotamiento: ${realData.stats.weeksRemaining}</li>
                    <li>• Fecha estimada de crisis: ${calculateCrisisDate()}</li>
                </ul>
            </div>
        </div>
    `;
    
    showModal("📊 Análisis Crítico", content);
}

function generateActionPlan() {
    const content = `
        <div class="space-y-4">
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                <h4 class="font-bold text-blue-900 text-lg">🎯 PLAN DE ACCIÓN URGENTE</h4>
                <p class="text-blue-700">Recomendaciones para los próximos 7 días</p>
            </div>
            
            <div class="space-y-3">
                <div class="flex items-start p-3 bg-white border border-blue-200 rounded-lg">
                    <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-bold mr-3">1</span>
                    <div>
                        <h5 class="font-semibold text-gray-800">Reabastecimiento Inmediato</h5>
                        <p class="text-sm text-gray-600">Ordenar 201 productos críticos a proveedores prioritarios</p>
                        <p class="text-xs text-blue-600 mt-1">📅 Plazo: 72 horas • 📊 Impacto: ALTO</p>
                    </div>
                </div>
                
                <div class="flex items-start p-3 bg-white border border-orange-200 rounded-lg">
                    <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-800 font-bold mr-3">2</span>
                    <div>
                        <h5 class="font-semibold text-gray-800">Negociación Proveedores</h5>
                        <p class="text-sm text-gray-600">Contactar 5 proveedores principales para plazos de entrega</p>
                        <p class="text-xs text-orange-600 mt-1">📅 Plazo: 48 horas • 📊 Impacto: MEDIO-ALTO</p>
                    </div>
                </div>
                
                <div class="flex items-start p-3 bg-white border border-green-200 rounded-lg">
                    <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-800 font-bold mr-3">3</span>
                    <div>
                        <h5 class="font-semibold text-gray-800">Sistema de Alertas</h5>
                        <p class="text-sm text-gray-600">Implementar alertas diarias para stock ≤ 1 semana</p>
                        <p class="text-xs text-green-600 mt-1">📅 Pl