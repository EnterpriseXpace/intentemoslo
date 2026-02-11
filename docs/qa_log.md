# QA LOG — Intentémoslo de Nuevo

Este documento registra errores, desviaciones o problemas detectados
durante la construcción del proyecto.

Nada se corrige directamente sin quedar registrado aquí.

## Formato de Registro

ID:
Fecha:
Archivo afectado:
Descripción del problema:
Tipo: (DESVIACIÓN / BUG / COPY / ESTRUCTURA)
Estado: OPEN / FIXED
Notas:

---

## Reglas de QA

1. Todo problema debe registrarse antes de corregirse.
2. No se cierra ningún ítem sin validación explícita.
3. Las desviaciones respecto a /reference_views
   se consideran errores aunque el resultado sea "bonito".
4. QA no propone diseño, solo valida cumplimiento.

---

ID: DEV-001
Fecha: 2026-02-05
Archivo afectado: src/app/page.tsx
Descripción del problema: Uso de valores hexadecimales hardcodeados (#faf9f6, #161811, #a6f20d) en lugar de tokens semánticos (bg-background, text-foreground, text-primary).
Tipo: DESVIACIÓN
Estado: FIXED
Notas: Coinciden visualmente pero rompen consistencia de tokens.

ID: DEV-002
Fecha: 2026-02-05
Archivo afectado: src/components/ui/RingChart.tsx
Descripción del problema: Uso de color hardcodeado (#a8d672) por defecto que no coincide con token primary (#a6f20d). Uso de colores slate-* hardcodeados.
Tipo: DESVIACIÓN
Estado: FIXED
Notas:

ID: DEV-003
Fecha: 2026-02-05
Archivo afectado: src/app/page.tsx
Descripción del problema: Uso de sintaxis arbitraria para opacidad bg-[#a6f20d]/10.
Tipo: DESVIACIÓN
Estado: FIXED
Notas: Debería ser bg-primary/10.
