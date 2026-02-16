# **Garden Planner AI \- Documento Maestro de Proyecto**

## **1\. Definición del Proyecto**

**Descripción:** Herramienta de diseño y planificación de jardinería que integra un canvas visual (drag-and-drop) con inteligencia artificial para la validación técnica y sugerencias agronómicas. **Objetivo Principal:** Permitir que cualquier usuario, sin conocimientos avanzados, pueda diseñar un jardín viable, estético y sostenible.

---

## **2\. Especificaciones Técnicas (MVP)**

### **2.1. El Lienzo (Canvas)**

* **Definición de terreno:** Input de medidas (largo/ancho) o dibujo de formas irregulares.  
* **Capas de diseño:** Separación por niveles (Suelo, Plantas, Infraestructura como caminos/fuentes).  
* **Interacción:** Sistema de arrastrar y soltar con escalado automático de objetos.

### **2.2. Base de Datos de Plantas**

* Fichas con: Nombre científico, requerimientos de luz (pleno sol, sombra), pH del suelo, necesidad de riego, tamaño máximo y zona de rusticidad.

---

## **3\. Funcionalidades Avanzadas (Diferenciales)**

### **3.1. Integración con Google Maps API**

* **Importación topográfica:** Localizar el terreno real para obtener dimensiones exactas y orientación cardinal (importante para las sombras).  
* **Zonificación:** Detección automática del clima local basado en la ubicación.

### **3.2. Inteligencia Artificial (IA)**

* **Validador de Viabilidad:** Analizar si las plantas elegidas pueden convivir (alelopatía) y si el espacio/luz es suficiente.  
* **Recomendador Proactivo:** Sugerir plantas "compañeras" que mejoren la salud del jardín o solucionen problemas de drenaje/suelo.

### **3.3. Planificación Temporal y Exportación**

* **Calendarios dinámicos:** Generar un archivo (.ics o PDF) con fechas de siembra, poda y cosecha.  
* **Guías de mantenimiento:** Instrucciones de riego y abonado personalizadas por temporada.

---

## **4\. Ideas para Futuras Versiones**

* **Simulación de Crecimiento:** Visualizar el jardín en 1, 5 y 10 años.  
* **Análisis de Sombras Dinámico:** Simular el movimiento del sol según la estación del año.  
* **Presupuesto:** Listado de materiales y plantas con precios estimados.

