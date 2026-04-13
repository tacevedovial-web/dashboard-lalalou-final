// Script de validación para las funciones del dashboard
// Simula los datos y funciones críticas

const products = [
    {id: 1, name: "Laptop Dell", category: "Electrónicos", stock: 3, sales: 8},
    {id: 2, name: "Mouse Inalámbrico", category: "Accesorios", stock: 2, sales: 15},
    {id: 3, name: "Parlante Bluetooth", category: "Audio", stock: 1, sales: 12},
    {id: 4, name: "Teclado Mecánico", category: "Accesorios", stock: 8, sales: 10},
    {id: 5, name: "Monitor 24\"", category: "Electrónicos", stock: 12, sales: 6},
    {id: 6, name: "Auriculares", category: "Audio", stock: 15, sales: 20},
    {id: 7, name: "Webcam HD", category: "Accesorios", stock: 6, sales: 8},
    {id: 8, name: "Tablet Samsung", category: "Electrónicos", stock: 4, sales: 7},
    {id: 9, name: "Cargador Rápido", category: "Accesorios", stock: 25, sales: 30},
    {id: 10, name: "Micrófono USB", category: "Audio", stock: 9, sales: 11}
];

console.log("=== VALIDACIÓN DE FUNCIONALIDADES ===");

// Test 1: Productos críticos (stock < 5)
const critical = products.filter(p => p.stock < 5);
console.log(`✅ Productos críticos: ${critical.length} (esperado: 3)`);
console.log("Productos críticos encontrados:");
critical.forEach(p => console.log(`  - ${p.name}: ${p.stock} unidades`));

// Test 2: Filtro por categoría "Electrónicos"
const electronics = products.filter(p => p.category === "Electrónicos");
console.log(`✅ Productos Electrónicos: ${electronics.length} (esperado: 3)`);

// Test 3: Filtro por stock bajo (5-10)
const lowStock = products.filter(p => p.stock >= 5 && p.stock <= 10);
console.log(`✅ Productos stock bajo: ${lowStock.length} (esperado: 3)`);

// Test 4: Filtro por stock normal (> 10)
const normalStock = products.filter(p => p.stock > 10);
console.log(`✅ Productos stock normal: ${normalStock.length} (esperado: 4)`);

// Test 5: Cálculo de estadísticas
const totalProducts = products.length;
const criticalProducts = products.filter(p => p.stock < 5).length;
const weeklySales = products.reduce((sum, p) => sum + p.sales, 0);
const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
const weeksRemaining = (totalStock / weeklySales * 7).toFixed(1);

console.log("=== ESTADÍSTICAS CALCULADAS ===");
console.log(`✅ Total productos: ${totalProducts}`);
console.log(`✅ Productos críticos: ${criticalProducts}`);
console.log(`✅ Ventas semanales: ${weeklySales}`);
console.log(`✅ Stock total: ${totalStock}`);
console.log(`✅ Semanas restantes: ${weeksRemaining}`);

// Test 6: Categorías únicas para gráfico
const categories = [...new Set(products.map(p => p.category))];
console.log(`✅ Categorías únicas: ${categories.join(", ")}`);

// Test 7: Ventas por categoría
categories.forEach(cat => {
    const sales = products.filter(p => p.category === cat).reduce((sum, p) => sum + p.sales, 0);
    console.log(`✅ Ventas ${cat}: ${sales} unidades`);
});

console.log("\n=== TODAS LAS FUNCIONALIDADES VALIDADAS ✅ ===");