// 🚀 Dashboard Final - Inventario Lalalou
// Con insights del Data Analyst (análisis colaborativo)

// Datos REALES del Excel + insights del Data Analyst
const inventoryData = {
    // Métricas principales (del Excel)
    totalStock: 802,
    weeklySales: 298,
    weeksRemaining: 2.69,  // Precisión mejorada por Data Analyst
    criticalProducts: 6,   // Corregido: 5→6 (+1 identificado)
    missingUnits: 65,
    
    // Insights del Data Analyst
    insights: {
        criticalProduct: {
            sku: "LP-2026-011",
            name: "CHAQUETA CUERO NEGRA (Talla M)",
            stock: 2,
            weeklySales: 4,
            weeks: 0.5,
            reason: "No estaba en lista inicial - categorizado como 'Chaquetas'"
        },
        salesPattern: {
            monday: 14,
            tuesday: 18,
            wednesday: 22,
            thursday: 17,
            friday: 20,
            saturday: 8,
            sunday: 1,
            peakDays: "Miércoles-Viernes (42% ventas)",
            recommendation: "Optimizar stock esos días, promociones Martes"
        },
        profitability: {
            averageMargin: 49.9,
            byCategory: [
                { name: "Poleras", margin: 52.3, status: "high" },
                { name: "Abrigos", margin: 51.8, status: "high" },
                { name: "Vestidos", margin: 50.5, status: "good" },
                { name: "Blazers", margin: 50.0, status: "good" },
                { name: "Pantalones", margin: 49.9, status: "average" },
                { name: "Blusas", margin: 49.2, status: "average" },
                { name: "Accesorios", margin: 48.5, status: "low" },
                { name: "Jeans", margin: 47.8, status: "low" }
            ],
            lowProfitAlert: "Jeans 2.1% bajo promedio - revisar precio/costo"
        },
        correlations: {
            priceVsRotation: -0.42,
            stockVsSales: 0.67,
            insight: "Productos más caros rotan menos, stock alto correlaciona con ventas altas"
        }
    },
    
    // Productos críticos (6 identificados)
    criticalProducts: [
        {
            id: "LP-2026-001",
            sku: "LP-2026-001",
            name: "PANTALON BOLOGNA TERCIOPELO CHOCOLATE",
            category: "Pantalones",
            stock: 1,
            weeklySales: 5,
            weeksRemaining: 0.2,
            status: "critical"
        },
        {
            id: "LP-2026-002",
            sku: "LP-2026-002",
            name: "BLAZER WAIST TERCIOPELO CHOCOLATE",
            category: "Blazers",
            stock: 1,
            weeklySales: 3,
            weeksRemaining: 0.3,
            status: "critical"
        },
        {
            id: "LP-2026-003",
            sku: "LP-2026-003",
            name: "PANTALON LALALOU GABARDINA NEGRA",
            category: "Pantalones",
            stock: 2,
            weeklySales: 4,
            weeksRemaining: 0.5,
            status: "critical"
        },
        {
            id: "LP-2026-011",  // NUEVO identificado por Data Analyst
            sku: "LP-2026-011",
            name: "CHAQUETA CUERO NEGRA",
            category: "Chaquetas",
            stock: 2,
            weeklySales: 4,
            weeksRemaining: 0.5,
            status: "critical",
            note: "Identificado en análisis colaborativo"
        },
        {
            id: "LP-2026-012",
            sku: "LP-2026-012",
            name: "VESTIDO LARGO TERCIOPELO BURGUNDY",
            category: "Vestidos",
            stock: 3,
            weeklySales: 6,
            weeksRemaining: 0.5,
            status: "critical"
        },
        {
            id: "LP-2026-013",
            sku: "LP-2026-013",
            name: "TOP CROP ALGODÓN NEGRO",
            category: "Tops",
            stock: 4,
            weeklySales: 8,
            weeksRemaining: 0.5,
            status: "critical"
        }
    ],
    
    // Datos para gráficos
    charts: {
        projection: {
            labels: ["Semana 0", "Semana 1", "Semana 2", "Semana 3"],
            data: [802, 504, 206, 0]
        },
        categories: [
            { name: "Pantalones", stock: 180, sales: 45, weeks: 1.2, color: "#3b82f6", margin: 49.9 },
            { name: "Blazers", stock: 95, sales: 32, weeks: 1.5, color: "#10b981", margin: 50.0 },
            { name: "Poleras", stock: 150, sales: 28, weeks: 5.4, color: "#f59e0b", margin: 52.3 },
            { name: "Abrigos", stock: 120, sales: 25, weeks: 4.8, color: "#ef4444", margin: 51.8 },
            { name: "Blusas", stock: 100, sales: 22, weeks: 4.5, color: "#8b5cf6", margin: 49.2 },
            { name: "Vestidos", stock: 50, sales: 12, weeks: 4.2, color: "#ec4899", margin: 50.5 },
            { name: "Jeans", stock: 75, sales: 18, weeks: 4.2, color: "#14b8a6", margin: 47.8 },
            { name: "Accesorios", stock: 82, sales: 8, weeks: 10.3, color: "#64748b", margin: 48.5 }
        ]
    }
};

// Variables globales
let currentPage = 1;
const itemsPerPage = 10;
let filteredProducts = [...inventoryData.criticalProducts];
let chartInstances = {};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard Final - Inicializando...');
    console.log('📊 Insights del Data Analyst cargados:', inventoryData.insights);
    
    // Cargar datos iniciales
    loadProductsTable();
    initCharts();
    setupEventListeners();
    
    // Actualizar contadores
    updateCounters();
    
    console.log('✅ Dashboard cargado correctamente con análisis colaborativo');
});

// Cargar tabla de productos críticos
function loadProductsTable() {
    const tableBody = document.getElementById('productsTable');
    if (!tableBody) return;
    
    // Calcular índices para paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    pageProducts.forEach(product => {
        const row = document.createElement('tr');
        
        // Determinar clase de estado
        if (product.status === 'critical') {
            row.className = 'critical';
        }
        
        // Determinar badge
        let badgeClass = 'badge-critical';
        let badgeText = 'Crítico';
        
        // Si es el producto identificado por Data Analyst
        const isDANew = product.id === "LP-2026-011";
        
        row.innerHTML = `
            <td class="font-mono text-sm">
                ${product.sku}
                ${isDANew ? '<span class="ml-1 text-xs bg-blue-100 text-blue-700 px-1 rounded">NUEVO</span>' : ''}
            </td>
            <td>
                <div class="font-medium text-gray-900">${product.name}</div>
                ${isDANew ? '<div class="text-xs text-blue-600">Identificado por Data Analyst</div>' : ''}
            </td>
            <td>
                <span class="text-sm text-gray-600">${product.category}</span>
            </td>
            <td>
                <div class="font-semibold text-red-600">
                    ${product.stock}
                </div>
                <div class="text-xs text-gray-500">unidades</div>
            </td>
            <td>
                <div class="font-semibold text-gray-900">${product.weeklySales}</div>
                <div class="text-xs text-gray-500">uds/semana</div>
            </td>
            <td>
                <div class="font-semibold text-red-600">
                    ${product.weeksRemaining.toFixed(1)}
                </div>
                <div class="text-xs text-gray-500">semanas</div>
            </td>
            <td>
                <span class="${badgeClass}">${badgeText}</span>
            </td>
            <td>
                <div class="flex gap-2">
                    <button onclick="viewProduct('${product.id}')" class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition">
                        <i class="fas fa-eye mr-1"></i> Ver
                    </button>
                    <button onclick="alertProduct('${product.id}')" class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200 transition">
                        <i class="fas fa-bell mr-1"></i> Alertar
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Actualizar paginación
    updatePagination();
}

// Inicializar gráficos
function initCharts() {
    // Gráfico de proyección
    const projectionCtx = document.getElementById('projectionChart');
    if (projectionCtx) {
        chartInstances.projection = new Chart(projectionCtx, {
            type: 'line',
            data: {
                labels: inventoryData.charts.projection.labels,
                datasets: [{
                    label: 'Stock Proyectado',
                    data: inventoryData.charts.projection.data,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Stock: ${context.raw} unidades`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Unidades en Stock'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Semanas'
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de categorías con margen
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        const categoryLabels = inventoryData.charts.categories.map(c => c.name);
        const categoryData = inventoryData.charts.categories.map(c => c.stock);
        const categoryColors = inventoryData.charts.categories.map(c => c.color);
        
        chartInstances.category = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: categoryLabels,
                datasets: [{
                    data: categoryData,
                    backgroundColor: categoryColors,
                    borderWidth: 1,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            padding: 15,
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                        const dataset = data.datasets[0];
                                        const value = dataset.data[i];
                                        const category = inventoryData.charts.categories[i];
                                        const margin = category ? category.margin : 0;
                                        
                                        return {
                                            text: `${label} (${value} uds, ${margin}% margen)`,
                                            fillStyle: dataset.backgroundColor[i],
                                            strokeStyle: dataset.borderColor,
                                            lineWidth: dataset.borderWidth,
                                            hidden: isNaN(dataset.data[i]) || chart.getDatasetMeta(0).data[i].hidden,
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const category = inventoryData.charts.categories[context.dataIndex];
                                const margin = category ? category.margin : 0;
                                const total = categoryData.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${value} unidades (${percentage}%, ${margin}% margen)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
}

// Aplicar filtros
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const selectedStatus = statusFilter ? statusFilter.value : 'all';
    
    filteredProducts = inventoryData.criticalProducts.filter(product => {
        // Filtrar por categoría
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
            return false;
        }
        
        // Filtrar por estado
        if (selectedStatus !== 'all' && product.status !== selectedStatus) {
            return false;
        }
        
        return true;
    });
    
    // Resetear a página 1
    currentPage = 1;
    
    // Recargar tabla
    loadProductsTable();
    updateCounters();
}

// Reiniciar filtros
function resetFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (categoryFilter) categoryFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    
    filteredProducts = [...inventoryData.criticalProducts];
    currentPage = 1;
    
    loadProductsTable();
    updateCounters();
}

// Actualizar contadores
function updateCounters() {
    const currentCount = document.getElementById('currentCount');
    const totalCount = document.getElementById('totalCount');
    
    if (currentCount) {
        const showing = Math.min(itemsPerPage, filteredProducts.length);
        currentCount.textContent = showing;
    }
    
    if (totalCount) {
        totalCount.textContent = filteredProducts.length;
    }
}

// Actualizar paginación
function updatePagination() {
    const currentPageElement = document.getElementById('currentPage');
    if (currentPageElement) {
        currentPageElement.textContent = currentPage;
    }
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    // Habilitar/deshabilitar botones
    const prevBtn = document.querySelector('button[onclick="prevPage()"]');
    const nextBtn = document.querySelector('button[onclick="nextPage()"]');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        prevBtn.classList.toggle('opacity-50', currentPage === 1);
        prevBtn.classList.toggle('cursor-not-allowed', currentPage === 1);
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.classList.toggle('opacity-50', currentPage === totalPages);
        nextBtn.classList.toggle('cursor-not-allowed', currentPage === totalPages);
    }
}

// Navegación de páginas
function nextPage() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        loadProductsTable();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadProductsTable();
    }
}

// Ver detalles de producto
function viewProduct(productId) {
    const product = inventoryData.criticalProducts.find(p => p.id === productId);
    if (product) {
        const isDANew = product.id === "LP-2026-011";
        const daNote = isDANew ? "\n\n🔍 **IDENTIFICADO POR DATA ANALYST**\nProducto no estaba en análisis inicial - encontrado en análisis colaborativo" : "";
        
