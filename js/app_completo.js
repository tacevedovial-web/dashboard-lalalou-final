// 🚀 Dashboard 100% Funcional - Inventario Lalalou
// TODOS los botones funcionan - Equipo completo trabajando

// Variables globales
let inventoryData = null;
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentSort = { column: null, direction: 'asc' };
let chartInstances = {};

// Inicialización
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Dashboard 100% Funcional - Inicializando...');
    
    try {
        // Cargar datos
        await loadInventoryData();
        
        // Inicializar componentes
        initDashboard();
        setupEventListeners();
        
        // Mostrar toast de bienvenida
        showToast('✅ Dashboard cargado correctamente', 'success');
        
        console.log('✅ Dashboard 100% funcional listo');
    } catch (error) {
        console.error('Error al cargar dashboard:', error);
        showToast('❌ Error al cargar datos', 'error');
    }
});

// Cargar datos del inventario
async function loadInventoryData() {
    try {
        // En un caso real, esto sería una llamada a API
        // Por ahora usamos datos simulados
        inventoryData = {
            metadata: {
                total_productos: 802,
                productos_criticos: 6,
                semanas_hasta_agotamiento: 2.69,
                ventas_semanales: 298,
                margen_promedio: 49.9
            },
            productos: [
                {
                    id: "LP-2026-001",
                    sku: "LP-2026-001",
                    nombre: "PANTALON BOLOGNA TERCIOPELO CHOCOLATE",
                    categoria: "Pantalones",
                    stock: 1,
                    ventas_semanales: 5,
                    semanas_restantes: 0.2,
                    estado: "critico",
                    precio: 89990,
                    margen: 50.0
                },
                {
                    id: "LP-2026-002",
                    sku: "LP-2026-002",
                    nombre: "BLAZER WAIST TERCIOPELO CHOCOLATE",
                    categoria: "Blazers",
                    stock: 1,
                    ventas_semanales: 3,
                    semanas_restantes: 0.3,
                    estado: "critico",
                    precio: 129990,
                    margen: 50.0
                },
                {
                    id: "LP-2026-003",
                    sku: "LP-2026-003",
                    nombre: "PANTALON LALALOU GABARDINA NEGRA",
                    categoria: "Pantalones",
                    stock: 2,
                    ventas_semanales: 4,
                    semanas_restantes: 0.5,
                    estado: "critico",
                    precio: 79990,
                    margen: 50.0
                },
                {
                    id: "LP-2026-011",
                    sku: "LP-2026-011",
                    nombre: "CHAQUETA CUERO NEGRA",
                    categoria: "Chaquetas",
                    stock: 2,
                    ventas_semanales: 4,
                    semanas_restantes: 0.5,
                    estado: "critico",
                    precio: 159990,
                    margen: 50.0,
                    nota: "IDENTIFICADO POR DATA ANALYST"
                },
                {
                    id: "LP-2026-012",
                    sku: "LP-2026-012",
                    nombre: "VESTIDO LARGO TERCIOPELO BURGUNDY",
                    categoria: "Vestidos",
                    stock: 3,
                    ventas_semanales: 6,
                    semanas_restantes: 0.5,
                    estado: "critico",
                    precio: 99990,
                    margen: 50.0
                },
                {
                    id: "LP-2026-013",
                    sku: "LP-2026-013",
                    nombre: "TOP CROP ALGODÓN NEGRO",
                    categoria: "Tops",
                    stock: 4,
                    ventas_semanales: 8,
                    semanas_restantes: 0.5,
                    estado: "critico",
                    precio: 39990,
                    margen: 50.0
                },
                {
                    id: "LP-2026-004",
                    sku: "LP-2026-004",
                    nombre: "POLERA RIB ALGODÓN BLANCA",
                    categoria: "Poleras",
                    stock: 150,
                    ventas_semanales: 28,
                    semanas_restantes: 5.4,
                    estado: "bueno",
                    precio: 29990,
                    margen: 52.0
                },
                {
                    id: "LP-2026-005",
                    sku: "LP-2026-005",
                    nombre: "ABRIGO LANA MERINO NEGRO",
                    categoria: "Abrigos",
                    stock: 120,
                    ventas_semanales: 25,
                    semanas_restantes: 4.8,
                    estado: "bueno",
                    precio: 159990,
                    margen: 51.9
                },
                {
                    id: "LP-2026-006",
                    sku: "LP-2026-006",
                    nombre: "BLUSA SEDA ESTAMPADA",
                    categoria: "Blusas",
                    stock: 100,
                    ventas_semanales: 22,
                    semanas_restantes: 4.5,
                    estado: "bueno",
                    precio: 69990,
                    margen: 49.2
                },
                {
                    id: "LP-2026-007",
                    sku: "LP-2026-007",
                    nombre: "VESTIDO MIDI FLORAL",
                    categoria: "Vestidos",
                    stock: 50,
                    ventas_semanales: 12,
                    semanas_restantes: 4.2,
                    estado: "bueno",
                    precio: 89990,
                    margen: 50.0
                },
                {
                    id: "LP-2026-008",
                    sku: "LP-2026-008",
                    nombre: "JEAN SKINNY AZUL",
                    categoria: "Jeans",
                    stock: 75,
                    ventas_semanales: 18,
                    semanas_restantes: 4.2,
                    estado: "bueno",
                    precio: 59990,
                    margen: 47.7
                },
                {
                    id: "LP-2026-009",
                    sku: "LP-2026-009",
                    nombre: "CINTURÓN PIEL MARÓN",
                    categoria: "Accesorios",
                    stock: 15,
                    ventas_semanales: 1,
                    semanas_restantes: 15.0,
                    estado: "exceso",
                    precio: 24990,
                    margen: 48.4
                },
                {
                    id: "LP-2026-010",
                    sku: "LP-2026-010",
                    nombre: "BOLSO TOTE BEIGE",
                    categoria: "Accesorios",
                    stock: 20,
                    ventas_semanales: 2,
                    semanas_restantes: 10.0,
                    estado: "exceso",
                    precio: 89990,
                    margen: 48.5
                }
            ],
            insights: {
                producto_critico_adicional: {
                    sku: "LP-2026-011",
                    nombre: "CHAQUETA CUERO NEGRA",
                    razon: "Categorizado como 'Chaquetas' no 'Abrigos'"
                },
                patron_ventas: {
                    distribucion: {
                        lunes: 14, martes: 18, miercoles: 22,
                        jueves: 17, viernes: 20, sabado: 8, domingo: 1
                    },
                    insight: "42% ventas concentradas Miércoles-Viernes"
                },
                rentabilidad: {
                    jeans_problema: {
                        margen: 47.8,
                        promedio: 49.9,
                        diferencia: -2.1
                    }
                }
            }
        };
        
        filteredProducts = [...inventoryData.productos];
        return true;
    } catch (error) {
        console.error('Error cargando datos:', error);
        throw error;
    }
}

// Inicializar dashboard
function initDashboard() {
    // Actualizar estadísticas
    updateStats();
    
    // Cargar tabla de productos
    loadProductsTable();
    
    // Inicializar gráficos
    initCharts();
    
    // Actualizar contadores
    updateCounters();
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    // Ordenamiento de tabla
    document.querySelectorAll('.table th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.getAttribute('data-sort');
            sortTable(column);
        });
    });
}

// Actualizar estadísticas
function updateStats() {
    if (!inventoryData) return;
    
    const stats = inventoryData.metadata;
    
    // Actualizar elementos del DOM
    document.getElementById('stat-stock').textContent = stats.total_productos;
    document.getElementById('stat-sales').textContent = stats.ventas_semanales;
    document.getElementById('stat-weeks').textContent = stats.semanas_hasta_agotamiento;
    document.getElementById('stat-critical').textContent = stats.productos_criticos;
    document.getElementById('stat-margin').textContent = `${stats.margen_promedio}%`;
}

// Cargar tabla de productos
function loadProductsTable() {
    const tableBody = document.getElementById('productsTable');
    if (!tableBody || !filteredProducts.length) return;
    
    // Calcular índices para paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    pageProducts.forEach(product => {
        const row = document.createElement('tr');
        
        // Determinar clase de estado
        if (product.estado === 'critico') {
            row.className = 'critical';
        } else if (product.estado === 'exceso') {
            row.className = 'warning';
        }
        
        // Determinar badge
        let badgeClass = 'badge-success';
        let badgeText = 'Bueno';
        if (product.estado === 'critico') {
            badgeClass = 'badge-critical';
            badgeText = 'Crítico';
        } else if (product.estado === 'exceso') {
            badgeClass = 'badge-info';
            badgeText = 'Exceso';
        }
        
        // Formatear precio
        const formattedPrice = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(product.precio);
        
        // Si es producto identificado por Data Analyst
        const isDANew = product.id === "LP-2026-011";
        
        row.innerHTML = `
            <td class="font-mono text-sm">
                ${product.sku}
                ${isDANew ? '<span class="ml-1 text-xs bg-blue-100 text-blue-700 px-1 rounded">NUEVO</span>' : ''}
            </td>
            <td>
                <div class="font-medium text-gray-900">${product.nombre}</div>
                ${isDANew ? '<div class="text-xs text-blue-600">Identificado por Data Analyst</div>' : ''}
            </td>
            <td>
                <span class="text-sm text-gray-600">${product.categoria}</span>
            </td>
            <td>
                <div class="font-semibold ${product.stock < 5 ? 'text-red-600' : 'text-gray-900'}">
                    ${product.stock}
                </div>
                <div class="text-xs text-gray-500">unidades</div>
            </td>
            <td>
                <div class="font-semibold text-gray-900">${product.ventas_semanales}</div>
                <div class="text-xs text-gray-500">uds/semana</div>
            </td>
            <td>
                <div class="font-semibold ${product.semanas_restantes < 1 ? 'text-red-600' : product.semanas_restantes < 3 ? 'text-yellow-600' : 'text-gray-900'}">
                    ${product.semanas_restantes.toFixed(1)}
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
    if (projectionCtx && window.Chart) {
        // Destruir gráfico anterior si existe
        if (chartInstances.projection) {
            chartInstances.projection.destroy();
        }
        
        chartInstances.projection = new Chart(projectionCtx, {
            type: 'line',
            data: {
                labels: ['Semana 0', 'Semana 1', 'Semana 2', 'Semana 3'],
                datasets: [{
                    label: 'Stock Proyectado',
                    data: [802, 504, 206, 0],
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
    
    // Gráfico de categorías
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx && window.Chart) {
        // Destruir gráfico anterior si existe
        if (chartInstances.category) {
            chartInstances.category.destroy();
        }
        
        const categories = [
            { name: "Pantalones", stock: 180, color: "#3b82f6" },
            { name: "Blazers", stock: 95, color: "#10b981" },
            { name: "Poleras", stock: 150, color: "#f59e0b" },
            { name: "Abrigos", stock: 120, color: "#ef4444" },
            { name: "Blusas", stock: 100, color: "#8b5cf6" },
            { name: "Vestidos", stock: 50, color: "#ec4899" },
            { name: "Jeans", stock: 75, color: "#14b8a6" },
            { name: "Accesorios", stock: 82, color: "#64748b" }
        ];
        
        const categoryLabels = categories.map(c => c.name);
        const categoryData = categories.map(c => c.stock);
        const categoryColors = categories.map(c => c.color);
        
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
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = categoryData.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label