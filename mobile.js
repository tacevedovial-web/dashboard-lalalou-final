// 📱 Dashboard Móvil - Inventario Lalalou
// Versión optimizada para móviles

// Datos móviles optimizados
const mobileData = {
    stats: {
        totalStock: 802,
        weeklySales: 298,
        weeksRemaining: 2.69,
        criticalProducts: 6,
        averageMargin: 49.9
    },
    
    insights: [
        {
            id: 'critical',
            title: 'Producto Crítico Adicional',
            description: 'CHAQUETA CUERO NEGRA (Talla M)',
            details: 'Stock: 2 unidades • 0.5 semanas restantes',
            icon: 'exclamation-triangle',
            color: 'red',
            type: 'critical'
        },
        {
            id: 'pattern',
            title: 'Patrón de Ventas',
            description: '42% ventas Miércoles-Viernes',
            details: 'Optimizar stock esos días, promociones Martes',
            icon: 'chart-line',
            color: 'green',
            type: 'pattern'
        },
        {
            id: 'profit',
            title: 'Rentabilidad',
            description: 'Jeans: 47.8% margen (bajo)',
            details: '2.1% bajo promedio - revisar precio/costo',
            icon: 'money-bill-wave',
            color: 'yellow',
            type: 'profitability'
        }
    ],
    
    criticalProducts: [
        {
            id: "LP-2026-001",
            name: "PANTALON BOLOGNA TERCIOPELO CHOCOLATE",
            category: "Pantalones",
            stock: 1,
            weeks: 0.2,
            priority: "alta"
        },
        {
            id: "LP-2026-002",
            name: "BLAZER WAIST TERCIOPELO CHOCOLATE",
            category: "Blazers",
            stock: 1,
            weeks: 0.3,
            priority: "alta"
        },
        {
            id: "LP-2026-003",
            name: "PANTALON LALALOU GABARDINA NEGRA",
            category: "Pantalones",
            stock: 2,
            weeks: 0.5,
            priority: "alta"
        },
        {
            id: "LP-2026-011",
            name: "CHAQUETA CUERO NEGRA",
            category: "Chaquetas",
            stock: 2,
            weeks: 0.5,
            priority: "alta",
            note: "Identificado por Data Analyst"
        },
        {
            id: "LP-2026-012",
            name: "VESTIDO LARGO TERCIOPELO BURGUNDY",
            category: "Vestidos",
            stock: 3,
            weeks: 0.5,
            priority: "alta"
        },
        {
            id: "LP-2026-013",
            name: "TOP CROP ALGODÓN NEGRO",
            category: "Tops",
            stock: 4,
            weeks: 0.5,
            priority: "alta"
        }
    ],
    
    charts: {
        projection: {
            labels: ["Ahora", "Sem 1", "Sem 2", "Sem 3"],
            data: [802, 504, 206, 0]
        },
        categories: [
            { name: "Pantalones", value: 180, color: "#3b82f6" },
            { name: "Blazers", value: 95, color: "#10b981" },
            { name: "Poleras", value: 150, color: "#f59e0b" },
            { name: "Abrigos", value: 120, color: "#ef4444" },
            { name: "Blusas", value: 100, color: "#8b5cf6" },
            { name: "Vestidos", value: 50, color: "#ec4899" },
            { name: "Jeans", value: 75, color: "#14b8a6" },
            { name: "Accesorios", value: 82, color: "#64748b" }
        ]
    },
    
    actions: [
        {
            id: 'reorder',
            title: 'Reponer productos críticos',
            description: '6 productos con ≤1 semana stock',
            icon: 'truck-loading',
            priority: 'urgent'
        },
        {
            id: 'audit',
            title: 'Auditar bodega',
            description: '65 unidades faltantes sin explicación',
            icon: 'search',
            priority: 'high'
        },
        {
            id: 'pricing',
            title: 'Revisar precios Jeans',
            description: 'Margen 47.8% (2.1% bajo promedio)',
            icon: 'tags',
            priority: 'medium'
        },
        {
            id: 'promo',
            title: 'Promocionar Miércoles-Viernes',
            description: '42% ventas concentradas esos días',
            icon: 'bullhorn',
            priority: 'medium'
        }
    ]
};

// Variables globales móviles
let currentTab = 'insights';
let mobileCharts = {};

// Inicialización móvil
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Dashboard Móvil - Inicializando...');
    
    // Cargar contenido inicial
    loadMobileProducts();
    initMobileCharts();
    setupMobileEvents();
    
    // Mostrar hora de última actualización
    updateLastRefresh();
    
    console.log('✅ Dashboard móvil listo');
});

// Cargar lista de productos móvil
function loadMobileProducts() {
    const productList = document.getElementById('mobileProductList');
    if (!productList) return;
    
    productList.innerHTML = '';
    
    mobileData.criticalProducts.forEach(product => {
        const isDANew = product.id === "LP-2026-011";
        
        const item = document.createElement('div');
        item.className = `product-item ${product.priority === 'alta' ? 'critical' : ''}`;
        item.innerHTML = `
            <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <i class="fas fa-exclamation-triangle text-red-600"></i>
                </div>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-medium text-gray-900 text-sm truncate">${product.name}</p>
                        <p class="text-gray-500 text-xs mt-1">
                            ${product.category} • ${product.stock} unidades
                        </p>
                    </div>
                    <div class="text-right">
                        <span class="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                            ${product.weeks} sem
                        </span>
                        ${isDANew ? '<div class="mt-1 text-xs bg-blue-100 text-blue-700 px-1 rounded">NUEVO</div>' : ''}
                    </div>
                </div>
            </div>
        `;
        
        item.addEventListener('click', () => {
            showProductDetail(product);
        });
        
        productList.appendChild(item);
    });
}

// Inicializar gráficos móviles
function initMobileCharts() {
    // Gráfico de proyección móvil
    const projectionCtx = document.getElementById('mobileProjectionChart');
    if (projectionCtx) {
        mobileCharts.projection = new Chart(projectionCtx, {
            type: 'line',
            data: {
                labels: mobileData.charts.projection.labels,
                datasets: [{
                    label: 'Stock',
                    data: mobileData.charts.projection.data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de categorías móvil
    const categoryCtx = document.getElementById('mobileCategoryChart');
    if (categoryCtx) {
        mobileCharts.category = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: mobileData.charts.categories.map(c => c.name),
                datasets: [{
                    data: mobileData.charts.categories.map(c => c.value),
                    backgroundColor: mobileData.charts.categories.map(c => c.color),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Configurar eventos móviles
function setupMobileEvents() {
    // Swipe detection
    let startX, startY;
    const content = document.querySelector('main');
    
    content.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    content.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Horizontal swipe (min 50px)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next tab
                nextTab();
            } else {
                // Swipe right - previous tab
                prevTab();
            }
        }
        
        startX = null;
        startY = null;
    });
}

// Cambiar pestañas
function switchTab(tabId) {
    // Actualizar tabs activos
    document.querySelectorAll('.swipe-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });
    
    // Activar nuevo tab
    const activeTab = document.querySelector(`.swipe-tab[onclick*="${tabId}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    const activeContent = document.getElementById(`tab-${tabId}`);
    if (activeContent) {
        activeContent.style.display = 'block';
        activeContent.classList.add('active');
    }
    
    currentTab = tabId;
    
    // Si es tab de gráficos, redimensionar
    if (tabId === 'charts') {
        setTimeout(() => {
            if (mobileCharts.projection) mobileCharts.projection.resize();
            if (mobileCharts.category) mobileCharts.category.resize();
        }, 100);
    }
}

// Navegación entre tabs
function nextTab() {
    const tabs = ['insights', 'charts', 'products', 'actions'];
    const currentIndex = tabs.indexOf(currentTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    switchTab(tabs[nextIndex]);
}

function prevTab() {
    const tabs = ['insights', 'charts', 'products', 'actions'];
    const currentIndex = tabs.indexOf(currentTab);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    switchTab(tabs[prevIndex]);
}

// Mostrar detalle de producto
function showProductDetail(product) {
    const message = `
📦 ${product.name}

Categoría: ${product.category}
Stock: ${product.stock} unidades
Semanas restantes: ${product.weeks}
Prioridad: ${product.priority === 'alta' ? '🚨 ALTA' : 'MEDIA'}

${product.note ? `🔍 ${product.note}` : ''}

Acción recomendada: ${getMobileAction(product)}
    `;
    
    alert(message);
}

// Obtener acción para producto
function getMobileAction(product) {
    if (product.weeks <= 0.5) {
        return 'REPONER INMEDIATAMENTE - Stock crítico';
    } else if (product.weeks <= 1) {
        return 'REVISAR HOY - Stock muy bajo';
    } else {
        return 'MONITOREAR - Revisar en 2-3 días';
    }
}

// Mostrar insight detallado
function showInsightMobile(insightId) {
    const insight = mobileData.insights.find(i => i.id === insightId);
    if (!insight) return;
    
    const detail = {
        critical: `
🔍 **PRODUCTO CRÍTICO ADICIONAL**

**Producto:** CHAQUETA CUERO NEGRA (Talla M)
**SKU:** LP-2026-011
**Stock:** 2 unidades
**Ventas/semana:** 4 unidades
**Semanas restantes:** 0.5

**¿Por qué no estaba en lista inicial?**
- Categorizado como "Chaquetas" (no "Abrigos")
- Filtro inicial solo buscaba ≤1 semana en categorías principales
- Data Analyst encontró en análisis profundo

**Acción:** REPONER INMEDIATAMENTE
        `,
        pattern: `
📅 **PATRÓN DE VENTAS SEMANAL**

**Distribución:**
• Lunes: 14% (42 unidades)
• Martes: 18% (54 unidades)
• Miércoles: 22% (66 unidades) ← PICO
• Jueves: 17% (51 unidades)
• Viernes: 20% (60 unidades) ← PICO
• Sábado: 8% (24 unidades)
• Domingo: 1% (3 unidades)

**Insight:** 42% ventas se concentran Miércoles-Viernes

**Recomendaciones:**
1. Optimizar stock Miércoles-Viernes
2. Lanzar promociones Martes
3. Analizar por qué Sábado es bajo (8%)
        `,
        profit: `
💰 **ANÁLISIS DE RENTABILIDAD**

**Margen por categoría:**
1. Poleras: 52.3% (ALTO)
2. Abrigos: 51.8% (ALTO)
3. Vestidos: 50.5% (BUENO)
4. Blazers: 50.0% (BUENO)
5. Pantalones: 49.9% (PROMEDIO)
6. Blusas: 49.2% (PROMEDIO)
7. Accesorios: 48.5% (BAJO)
8. Jeans: 47.8% (BAJO)

**Jeans problema:**
• Margen: 47.8%
• Promedio: 49.9%
• Diferencia: -2.1 puntos

**Impacto anual:** ~$1,260,000 CLP menos de ganancia

**Recomendaciones:**
1. Revisar proveedor de Jeans
2. Considerar aumento de precio 5-8%
3. Analizar costo de producción
        `
    };
    
    alert(detail[insightId] || 'Insight no disponible');
}

// Mostrar acciones críticas
function showCriticalMobile() {
    const actions = mobileData.actions.map(action => `
${action.priority === 'urgent' ? '🚨' : action.priority === 'high' ? '⚠️' : '📋'} **${action.title}**
${action.description}
    `).join('\n\n');
    
    alert(`🚨 **ACCIONES URGENTES REQUERIDAS**\n\n${actions}\n\n**Prioridad:**\n🚨 Urgente • ⚠️ Alta • 📋 Media`);
}

// Refrescar datos móvil
function refreshMobile() {
    // Mostrar indicador de carga
    const refreshBtn = document.querySelector('[onclick="refreshMobile()"]');
    if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        refreshBtn.disabled = true;
    }
    
    // Simular actualización
    setTimeout(() => {
        // Actualizar hora
        updateLastRefresh();
        
        // Restaurar botón
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            refreshBtn.disabled = false;
        }
        
        // Mostrar confirmación
        showToast('✅ Datos actualizados');
    }, 1000);
}

// Actualizar hora de última actualización
function updateLastRefresh() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-CL', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    
    // Podríamos mostrar esto en algún lugar del UI
    console.log(`🔄 Última actualización: ${timeString}`);
}

// Mostrar toast (notificación)
function showToast(message) {
    // Crear toast si no existe
    let toast = document.getElementById('mobileToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'mobileToast';
        toast.className = 'fixed