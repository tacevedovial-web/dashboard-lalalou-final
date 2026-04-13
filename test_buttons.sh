#!/bin/bash

# Script de Testing Automatizado - Dashboard Lalalou
# Verifica archivos HTML, scripts vinculados, meta viewport y touch targets

echo "🧪 INICIANDO TESTING AUTOMATIZADO - DASHBOARD LALALOU"
echo "=================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0

# Directorio del proyecto
PROJECT_DIR="/home/node/.openclaw/workspace/dashboard-lalalou-final"

# Función para logging
log_test() {
    local status=$1
    local message=$2
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    if [ "$status" = "PASS" ]; then
        echo -e "  ${GREEN}✓${NC} $message"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    elif [ "$status" = "FAIL" ]; then
        echo -e "  ${RED}✗${NC} $message"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    elif [ "$status" = "WARN" ]; then
        echo -e "  ${YELLOW}⚠${NC} $message"
    else
        echo -e "  ${BLUE}ℹ${NC} $message"
    fi
}

# Función para verificar archivos HTML completos
test_html_completeness() {
    echo -e "${BLUE}📄 VERIFICANDO ARCHIVOS HTML COMPLETOS${NC}"
    echo "----------------------------------------"
    
    # Buscar todos los archivos HTML
    HTML_FILES=$(find "$PROJECT_DIR" -name "*.html" -type f)
    
    for html_file in $HTML_FILES; do
        filename=$(basename "$html_file")
        
        # Verificar que termine con </body></html>
        if tail -10 "$html_file" | grep -q "</body>" && tail -5 "$html_file" | grep -q "</html>"; then
            log_test "PASS" "$filename tiene estructura HTML completa (</body></html>)"
        else
            log_test "FAIL" "$filename NO tiene estructura HTML completa"
        fi
        
        # Verificar DOCTYPE
        if head -5 "$html_file" | grep -q "<!DOCTYPE html>"; then
            log_test "PASS" "$filename tiene DOCTYPE HTML5"
        else
            log_test "FAIL" "$filename NO tiene DOCTYPE HTML5"
        fi
    done
    echo ""
}

# Función para verificar scripts vinculados
test_linked_scripts() {
    echo -e "${BLUE}📦 VERIFICANDO SCRIPTS VINCULADOS${NC}"
    echo "-----------------------------------"
    
    # Verificar que existan los archivos JS requeridos
    if [ -f "$PROJECT_DIR/js/mobile_final.js" ]; then
        log_test "PASS" "js/mobile_final.js existe"
    else
        # Buscar mobile_final.js en el directorio raíz
        if [ -f "$PROJECT_DIR/mobile_final.js" ]; then
            log_test "WARN" "mobile_final.js encontrado en directorio raíz (no en js/)"
        else
            log_test "FAIL" "mobile_final.js NO encontrado"
        fi
    fi
    
    if [ -f "$PROJECT_DIR/js/final.js" ]; then
        log_test "PASS" "js/final.js existe"
    else
        log_test "FAIL" "js/final.js NO encontrado"
    fi
    
    # Verificar que los HTML referencien los scripts
    HTML_FILES=$(find "$PROJECT_DIR" -name "*.html" -type f)
    
    for html_file in $HTML_FILES; do
        filename=$(basename "$html_file")
        
        # Verificar referencias a scripts locales
        if grep -q "src.*\.js" "$html_file"; then
            local_scripts=$(grep -o "src=[\"'][^\"']*\.js[\"']" "$html_file" | grep -v "http" | wc -l)
            if [ $local_scripts -gt 0 ]; then
                log_test "PASS" "$filename referencia $local_scripts script(s) local(es)"
            fi
        fi
        
        # Verificar CDNs importantes
        if grep -q "tailwindcss.com" "$html_file"; then
            log_test "PASS" "$filename incluye Tailwind CSS"
        fi
        
        if grep -q "chart.js" "$html_file"; then
            log_test "PASS" "$filename incluye Chart.js"
        fi
    done
    echo ""
}

# Función para verificar meta viewport
test_meta_viewport() {
    echo -e "${BLUE}📱 VERIFICANDO META VIEWPORT${NC}"
    echo "-----------------------------"
    
    HTML_FILES=$(find "$PROJECT_DIR" -name "*.html" -type f)
    
    for html_file in $HTML_FILES; do
        filename=$(basename "$html_file")
        
        if grep -q '<meta name="viewport"' "$html_file"; then
            viewport_content=$(grep '<meta name="viewport"' "$html_file" | sed 's/.*content="//; s/".*//')
            log_test "PASS" "$filename tiene meta viewport: $viewport_content"
            
            # Verificar contenido específico del viewport
            if echo "$viewport_content" | grep -q "width=device-width"; then
                log_test "PASS" "$filename viewport incluye width=device-width"
            else
                log_test "WARN" "$filename viewport NO incluye width=device-width"
            fi
            
            if echo "$viewport_content" | grep -q "initial-scale=1"; then
                log_test "PASS" "$filename viewport incluye initial-scale=1"
            else
                log_test "WARN" "$filename viewport NO incluye initial-scale=1"
            fi
        else
            log_test "FAIL" "$filename NO tiene meta viewport"
        fi
    done
    echo ""
}

# Función para verificar touch targets
test_touch_targets() {
    echo -e "${BLUE}👆 VERIFICANDO TOUCH TARGETS${NC}"
    echo "-----------------------------"
    
    HTML_FILES=$(find "$PROJECT_DIR" -name "*.html" -type f)
    
    for html_file in $HTML_FILES; do
        filename=$(basename "$html_file")
        
        # Buscar botones y elementos clickeables
        button_count=$(grep -o '<button[^>]*>' "$html_file" | wc -l)
        link_count=$(grep -o '<a[^>]*>' "$html_file" | wc -l)
        input_count=$(grep -o '<input[^>]*type="button"' "$html_file" | wc -l)
        
        total_interactive=$((button_count + link_count + input_count))
        
        if [ $total_interactive -gt 0 ]; then
            log_test "PASS" "$filename tiene $total_interactive elementos interactivos ($button_count botones, $link_count enlaces)"
            
            # Verificar clases de padding/tamaño mínimo
            if grep -q "p-[3-9]\|px-[3-9]\|py-[3-9]" "$html_file"; then
                log_test "PASS" "$filename usa clases de padding adecuadas para touch targets"
            else
                log_test "WARN" "$filename podría necesitar más padding en elementos táctiles"
            fi
            
            # Verificar tamaños mínimos (h- y w- classes)
            if grep -q "h-1[0-9]\|w-1[0-9]\|min-h-\|min-w-" "$html_file"; then
                log_test "PASS" "$filename define alturas/anchos mínimos para elementos"
            else
                log_test "WARN" "$filename podría necesitar tamaños mínimos definidos"
            fi
        else
            log_test "WARN" "$filename no tiene elementos interactivos detectados"
        fi
    done
    echo ""
}

# Función para verificar botones principales
test_main_buttons() {
    echo -e "${BLUE}🔘 VERIFICANDO BOTONES PRINCIPALES${NC}"
    echo "-----------------------------------"
    
    HTML_FILES=$(find "$PROJECT_DIR" -name "*.html" -type f)
    
    # Botones principales que deberían existir
    MAIN_BUTTONS=("agregar" "editar" "eliminar" "guardar" "exportar" "importar" "buscar")
    
    for html_file in $HTML_FILES; do
        filename=$(basename "$html_file")
        
        for button_type in "${MAIN_BUTTONS[@]}"; do
            # Buscar botones por id, clase, o texto
            if grep -i -q "id.*$button_type\|class.*$button_type\|>.*$button_type" "$html_file"; then
                log_test "PASS" "$filename tiene botón de $button_type"
            fi
        done
        
        # Verificar botones con iconos (Font Awesome)
        fa_buttons=$(grep -o '<i class="fa[^"]*"' "$html_file" | wc -l)
        if [ $fa_buttons -gt 0 ]; then
            log_test "PASS" "$filename tiene $fa_buttons botones con iconos"
        fi
        
        # Verificar botones responsive
        if grep -q "sm:\|md:\|lg:\|xl:" "$html_file"; then
            log_test "PASS" "$filename incluye clases responsive"
        else
            log_test "WARN" "$filename podría necesitar más clases responsive"
        fi
    done
    echo ""
}

# Función para verificar funcionalidades JavaScript
test_javascript_functionality() {
    echo -e "${BLUE}⚡ VERIFICANDO FUNCIONALIDADES JAVASCRIPT${NC}"
    echo "-------------------------------------------"
    
    JS_FILES=$(find "$PROJECT_DIR" -name "*.js" -type f)
    
    for js_file in $JS_FILES; do
        filename=$(basename "$js_file")
        
        # Verificar funciones principales
        if grep -q "function\|const.*=.*=>" "$js_file"; then
            func_count=$(grep -c "function\|const.*=.*=>" "$js_file")
            log_test "PASS" "$filename define $func_count funciones"
        fi
        
        # Verificar event listeners
        if grep -q "addEventListener\|onclick\|onchange" "$js_file"; then
            log_test "PASS" "$filename incluye event listeners"
        fi
        
        # Verificar localStorage/sessionStorage
        if grep -q "localStorage\|sessionStorage" "$js_file"; then
            log_test "PASS" "$filename usa almacenamiento local"
        fi
        
        # Verificar manejo de errores
        if grep -q "try.*catch\|\.catch(" "$js_file"; then
            log_test "PASS" "$filename incluye manejo de errores"
        else
            log_test "WARN" "$filename podría necesitar manejo de errores"
        fi
    done
    echo ""
}

# Función para verificar accesibilidad
test_accessibility() {
    echo -e "${BLUE}♿ VERIFICANDO ACCESIBILIDAD${NC}"
    echo "----------------------------"
    
    HTML_FILES=$(find "$PROJECT_DIR" -name "*.html" -type f)
    
    for html_file in $HTML_FILES; do
        filename=$(basename "$html_file")
        
        # Verificar atributos alt en imágenes
        img_count=$(grep -o '<img[^>]*>' "$html_file" | wc -l)
        alt_count=$(grep -o 'alt="[^"]*"' "$html_file" | wc -l)
        
        if [ $img_count -eq $alt_count ] && [ $img_count -gt 0 ]; then
            log_test "PASS" "$filename: todas las imágenes tienen atributo alt"
        elif [ $img_count -gt 0 ]; then
            log_test "WARN" "$filename: $img_count imágenes, $alt_count con alt"
        fi
        
        # Verificar labels para inputs
        input_count=$(grep -o '<input[^>]*>' "$html_file" | wc -l)
        label_count=$(grep -o '<label[^>]*>' "$html_file" | wc -l)
        
        if [ $input_count -gt 0 ] && [ $label_count -gt 0 ]; then
            log_test "PASS" "$filename tiene labels para inputs"
        elif [ $input_count -gt 0 ]; then
            log_test "WARN" "$filename: $input_count inputs, verificar labels"
        fi
        
        # Verificar aria-* attributes
        if grep -q 'aria-' "$html_file"; then
            aria_count=$(grep -o 'aria-[^=]*=' "$html_file" | wc -l)
            log_test "PASS" "$filename usa $aria_count atributos ARIA"
        fi
    done
    echo ""
}

# Ejecutar todas las pruebas
main() {
    cd "$PROJECT_DIR" || {
        echo -e "${RED}❌ Error: No se puede acceder al directorio del proyecto${NC}"
        exit 1
    }
    
    test_html_completeness
    test_linked_scripts
    test_meta_viewport
    test_touch_targets
    test_main_buttons
    test_javascript_functionality
    test_accessibility
    
    # Resumen final
    echo "=================================================="
    echo -e "${BLUE}📊 RESUMEN DE TESTING${NC}"
    echo "=================================================="
    echo -e "Total de pruebas: ${YELLOW}$TESTS_TOTAL${NC}"
    echo -e "Pruebas exitosas: ${GREEN}$TESTS_PASSED${NC}"
    echo -e "Pruebas fallidas: ${RED}$TESTS_FAILED${NC}"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}🎉 ¡TODOS LOS TESTS PASARON!${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠️  Hay $TESTS_FAILED pruebas que requieren atención${NC}"
        exit 1
    fi
}

# Verificar dependencias
check_dependencies() {
    if ! command -v grep &> /dev/null; then
        echo -e "${RED}❌ grep no está instalado${NC}"
        exit 1
    fi
    
    if ! command -v find &> /dev/null; then
        echo -e "${RED}❌ find no está instalado${NC}"
        exit 1
    fi
}

# Ejecutar el script
check_dependencies
main