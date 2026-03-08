# 11 · Dashboard Metrics

## 1. Propósito del documento

Este documento define las métricas, KPIs y reglas de cálculo del dashboard del MVP para la app de control financiero. Su objetivo es asegurar que frontend, backend, testing y producto compartan exactamente la misma interpretación de cada número mostrado al usuario.

Debe servir como referencia para:

- cálculo de KPIs,
- queries agregadas,
- visualizaciones del dashboard,
- filtros temporales,
- reglas de inclusión y exclusión,
- consistencia con listados y reportes,
- testing de métricas.

---

## 2. Objetivos del dashboard

El dashboard debe permitir que el usuario entienda en pocos segundos:

- cuánto ha ingresado,
- cuánto ha gastado,
- cuál es su beneficio neto,
- qué facturas siguen pendientes,
- cómo evoluciona su negocio en el tiempo,
- en qué categorías gasta más,
- qué movimientos recientes requieren atención.

---

## 3. Principios de diseño de métricas

1. Cada KPI debe tener una definición única.
2. Las mismas reglas deben aplicarse en dashboard, reportes y testing.
3. Las métricas deben derivarse de datos persistidos, no de cálculos manuales en frontend.
4. Los filtros del dashboard deben afectar a todos los bloques dependientes del periodo, salvo cuando se indique lo contrario.
5. Debe quedar claro qué estados cuentan y cuáles no.
6. Ante ausencia de datos, el dashboard debe devolver ceros o estructuras vacías válidas, no errores.

---

## 4. Alcance del dashboard MVP

### El dashboard MVP debe incluir como mínimo
- totalIncome
- totalExpense
- netProfit
- pendingInvoicesCount
- pendingInvoicesAmount
- latestTransactions
- expenseByCategory
- incomeVsExpenseSeries

### Puede incluir después
- promedio mensual,
- ticket medio,
- ingresos por cliente,
- gastos recurrentes estimados,
- cashflow forecast,
- comparativa con periodo anterior,
- margen porcentual.

---

## 5. Filtros globales del dashboard

### Filtro temporal principal
El dashboard debe permitir filtrar por rango temporal.

### Campos esperados
- `from`
- `to`

### Regla general
Las métricas basadas en transacciones deben respetar el rango temporal seleccionado.

### Excepciones posibles
Algunas métricas, como facturas pendientes, pueden:

- respetar solo el estado actual de facturas,
- o filtrar además por fechas relevantes.

Estas reglas deben definirse explícitamente para evitar ambigüedad.

---

## 6. Regla global de estados incluidos

### Para transacciones
Por defecto, el dashboard debe contar solo transacciones con `status = confirmed`, salvo que se defina explícitamente otra vista.

#### Estados excluidos por defecto
- `draft`
- `pending`
- `cancelled`

### Para facturas
El dashboard debe considerar estados de factura según la métrica concreta.

#### Estados posibles
- `draft`
- `pending`
- `paid`
- `overdue`
- `cancelled`

---

## 7. KPI: totalIncome

### Definición
Suma de importes de transacciones de tipo `income` confirmadas dentro del rango temporal seleccionado.

### Fórmula conceptual
```text
totalIncome = SUM(amount) de transactions
where type = 'income'
and status = 'confirmed'
and transaction_date entre from y to
```

### Incluye
- ingresos manuales confirmados,
- ingresos importados ya confirmados,
- ingresos creados desde PDF si han quedado confirmados.

### Excluye
- ingresos en draft,
- ingresos pending,
- ingresos cancelled,
- ingresos fuera del rango.

### Resultado esperado
- número decimal >= 0
- si no hay ingresos, devolver `0`

---

## 8. KPI: totalExpense

### Definición
Suma de importes de transacciones de tipo `expense` confirmadas dentro del rango temporal seleccionado.

### Fórmula conceptual
```text
totalExpense = SUM(amount) de transactions
where type = 'expense'
and status = 'confirmed'
and transaction_date entre from y to
```

### Incluye
- gastos manuales confirmados,
- gastos importados confirmados,
- gastos creados desde PDF si han quedado confirmados.

### Excluye
- gastos en draft,
- gastos pending,
- gastos cancelled,
- gastos fuera del rango.

### Resultado esperado
- número decimal >= 0
- si no hay gastos, devolver `0`

---

## 9. KPI: netProfit

### Definición
Resultado neto del periodo seleccionado.

### Fórmula
```text
netProfit = totalIncome - totalExpense
```

### Interpretación
- positivo: el negocio gana más de lo que gasta en el periodo
- negativo: el negocio gasta más de lo que ingresa en el periodo
- cero: equilibrio

### Regla
No debe recalcularse con lógica distinta a la usada en `totalIncome` y `totalExpense`.

---

## 10. KPI: pendingInvoicesCount

### Definición
Número de facturas actualmente pendientes o vencidas, según regla definida para el dashboard.

### Recomendación MVP
Contar facturas con estado:
- `pending`
- `overdue`

### Fórmula conceptual
```text
pendingInvoicesCount = COUNT(invoices)
where status in ('pending', 'overdue')
```

### Regla temporal recomendada
Para este KPI conviene mostrar el estado actual de pendientes globales, no solo del rango temporal del dashboard, salvo que producto decida lo contrario.

### Motivo
Es una métrica operativa de atención inmediata, no solo histórica.

### Nota de UX
Conviene aclarar en la UI si este bloque representa:
- pendientes globales,
- o pendientes dentro del periodo filtrado.

### Recomendación final MVP
**Usar pendientes globales del negocio**, fuera del filtro temporal principal.

---

## 11. KPI: pendingInvoicesAmount

### Definición
Suma total pendiente de facturas actualmente en estado `pending` u `overdue`.

### Fórmula conceptual
```text
pendingInvoicesAmount = SUM(amount_total) de invoices
where status in ('pending', 'overdue')
```

### Regla temporal recomendada
Igual que `pendingInvoicesCount`: global, no atada al filtro temporal principal en el MVP.

### Resultado esperado
- número decimal >= 0
- si no hay facturas pendientes, devolver `0`

---

## 12. Bloque: latestTransactions

### Definición
Lista de las transacciones más recientes para el negocio actual.

### Recomendación MVP
Mostrar entre 5 y 10 movimientos recientes.

### Reglas de inclusión
- transacciones del negocio actual,
- preferiblemente `confirmed`, aunque puede incluir `pending` si se quiere una vista más operativa.

### Recomendación final MVP
Mostrar:
- `confirmed`
- opcionalmente `pending`
- excluir `cancelled`

### Orden
```text
order by transaction_date desc, created_at desc
```

### Campos mínimos por item
- id
- type
- transactionDate
- amount
- currency
- category
- thirdParty
- status

### Nota
Este bloque sí puede respetar el filtro temporal del dashboard para mantener coherencia visual.

---

## 13. Bloque: expenseByCategory

### Definición
Distribución del gasto confirmado por categoría en el rango temporal seleccionado.

### Fórmula conceptual
```text
agrupar transactions por category_id
where type = 'expense'
and status = 'confirmed'
and transaction_date entre from y to
sum(amount)
```

### Campos mínimos por item
- categoryId
- categoryName
- total

### Reglas
- excluir transacciones sin categoría si la lógica del sistema las impide al confirmar
- si existen categorías nulas por datos históricos, pueden agruparse como `Sin categoría` solo si producto decide soportarlo

### Orden recomendado
- descendente por total

### Uso visual
- gráfico de barras,
- donut simple,
- lista resumida.

---

## 14. Bloque: incomeVsExpenseSeries

### Definición
Serie temporal comparando ingresos y gastos dentro del rango temporal seleccionado.

### Objetivo
Mostrar evolución del negocio en el tiempo de forma simple.

### Granularidad recomendada
#### Si el rango es corto
- diaria

#### Si el rango es medio o largo
- semanal o mensual

### Recomendación MVP simple
- diaria para rangos cortos
- mensual para vistas amplias

### Fórmula conceptual
Para cada bucket temporal:
- sumar ingresos confirmados
- sumar gastos confirmados

### Campos mínimos por punto
- date
- income
- expense

### Regla
Los puntos sin datos deben poder aparecer como `0` si se decide rellenar huecos para visualización estable.

### Recomendación de UX
Rellenar huecos en la serie mejora la legibilidad del gráfico.

---

## 15. Métricas derivadas opcionales futuras

Estas no son obligatorias en MVP, pero conviene dejarlas definidas como evolución.

### 15.1 MarginPercent
```text
marginPercent = (netProfit / totalIncome) * 100
```
Solo si `totalIncome > 0`.

### 15.2 AverageMonthlyIncome
Promedio de ingresos por mes en el periodo seleccionado.

### 15.3 AverageMonthlyExpense
Promedio de gastos por mes en el periodo seleccionado.

### 15.4 TopClients
Clientes con mayor volumen de ingreso en el periodo.

### 15.5 TopSuppliers
Proveedores con mayor gasto en el periodo.

---

## 16. Reglas de consistencia con listados y reportes

### Regla crítica
Los números del dashboard deben cuadrar con los listados equivalentes cuando se aplican los mismos filtros y reglas de inclusión.

### Ejemplos
- `totalExpense` debe coincidir con la suma del listado de gastos confirmados del rango
- `expenseByCategory` debe coincidir con el agrupado por categoría de ese mismo universo
- `netProfit` debe salir del mismo conjunto de ingresos y gastos que ven listados/reportes

### Excepción documentada
Las métricas de facturas pendientes pueden seguir lógica global si se decide así.

---

## 17. Reglas de redondeo y formato

### Backend
- calcular con precisión decimal
- evitar cálculos en coma flotante del frontend

### Frontend
- mostrar valores con formato monetario consistente
- respetar moneda del negocio o del registro si se soporta multi-moneda informativa

### MVP
Si se trabaja con una sola moneda operativa por negocio, las métricas agregadas asumen esa moneda.

---

## 18. Reglas de multi-moneda

### Recomendación MVP
No mezclar monedas reales en KPIs agregados sin conversión.

### Opción práctica MVP
- usar una moneda principal por negocio,
- permitir guardar moneda por registro,
- pero considerar que el dashboard solo es fiable si las transacciones están en la moneda operativa o ya normalizadas.

### Open question
Si más adelante se soporta multi-moneda real, habrá que definir:
- tipo de cambio,
- fecha de conversión,
- moneda base del dashboard.

---

## 19. Estados vacíos del dashboard

### Sin transacciones ni facturas
Debe mostrar:
- ingresos = 0
- gastos = 0
- beneficio neto = 0
- pendientes = 0
- listas y series vacías válidas
- CTA útil para crear ingreso, gasto, factura, importar CSV o subir PDF

### Solo ingresos
Debe mostrar:
- totalExpense = 0
- netProfit = totalIncome

### Solo gastos
Debe mostrar:
- totalIncome = 0
- netProfit negativo

### Solo facturas pendientes
Debe mostrar:
- KPIs financieros del rango según transacciones disponibles
- pendientes globales correctamente informados

---

## 20. Casos edge a contemplar

### Transacciones con estados no finales
No deben contaminar KPIs finales si la regla es usar solo `confirmed`.

### Facturas vencidas sin due_date
No deberían existir como vencidas sin criterio claro; si aparecen, producto debe decidir cómo tratarlas.

### Categorías eliminadas o archivadas
Las transacciones históricas deben seguir pudiendo agruparse correctamente o mostrarse con fallback controlado.

### Rango sin datos
No debe producir errores ni NaN.

### Datos históricos importados parcialmente
No deben romper series ni sumatorios aunque falten categorías o terceros opcionales.

---

## 21. Contrato recomendado del dashboard summary

### DTO sugerido
```ts
export type DashboardSummaryDTO = {
  kpis: {
    totalIncome: number
    totalExpense: number
    netProfit: number
    pendingInvoicesCount: number
    pendingInvoicesAmount: number
  }
  latestTransactions: Array<{
    id: string
    type: 'income' | 'expense'
    transactionDate: string
    amount: number
    currency: string
    category: {
      id: string
      name: string
    } | null
    thirdParty: {
      id: string
      name: string
    } | null
    status: 'draft' | 'pending' | 'confirmed' | 'cancelled'
  }>
  expenseByCategory: Array<{
    categoryId: string | null
    categoryName: string
    total: number
  }>
  incomeVsExpenseSeries: Array<{
    date: string
    income: number
    expense: number
  }>
}
```

---

## 22. Queries agregadas recomendadas

### 22.1 Income / Expense KPIs
Basadas en `transactions` confirmadas y filtradas por fecha.

### 22.2 Pending invoices KPIs
Basadas en `invoices` con estado `pending` y `overdue`.

### 22.3 Latest transactions
Consulta limitada y ordenada por fecha reciente.

### 22.4 Expense by category
Agrupación por categoría de gastos confirmados.

### 22.5 Series
Agrupación temporal por bucket.

### Recomendación técnica
Resolver estas métricas en backend o servicio agregado, no componerlas en frontend a partir de múltiples respuestas dispersas.

---

## 23. Reglas para testing de métricas

El testing debe verificar como mínimo:

1. dashboard vacío devuelve ceros y estructuras válidas;
2. totalIncome suma solo ingresos confirmados;
3. totalExpense suma solo gastos confirmados;
4. netProfit = totalIncome - totalExpense;
5. pendingInvoicesCount cuenta pendientes y vencidas según regla definida;
6. pendingInvoicesAmount suma los importes correctos;
7. expenseByCategory agrupa correctamente;
8. latestTransactions respeta orden y límite;
9. incomeVsExpenseSeries refleja correctamente el rango;
10. cambios en transacciones o facturas actualizan las métricas correspondientes.

---

## 24. Reglas para UI del dashboard

### El dashboard debe mostrar claramente
- nombres comprensibles de KPIs,
- formato monetario correcto,
- estados vacíos amigables,
- gráficos legibles,
- accesos rápidos visibles,
- indicadores consistentes con los datos.

### Recomendación de copy
Evitar etiquetas ambiguas como:
- “resultado”
- “balance”

Mejor usar:
- “Ingresos”
- “Gastos”
- “Beneficio neto”
- “Facturas pendientes”

---

## 25. Decisiones cerradas para el MVP

### Se fija que:
1. `totalIncome` y `totalExpense` usan solo transacciones `confirmed`
2. `netProfit = totalIncome - totalExpense`
3. `pendingInvoicesCount` y `pendingInvoicesAmount` usan facturas `pending` + `overdue`
4. las métricas de pendientes son **globales del negocio**, no limitadas por el filtro temporal principal
5. `latestTransactions` respeta el rango temporal y excluye `cancelled`
6. `expenseByCategory` usa gastos confirmados en el rango
7. `incomeVsExpenseSeries` usa transacciones confirmadas en el rango

---

## 26. Open questions relacionadas con dashboard

Estas quedan marcadas para documento posterior si no se cierran ahora:

- ¿Se muestran `pending` en latestTransactions o solo `confirmed`?
- ¿La serie temporal será diaria, semanal o adaptativa desde el inicio?
- ¿El dashboard debe comparar con periodo anterior en MVP o no?
- ¿Cómo se tratarán monedas distintas si aparecen?
- ¿Se quiere incluir un KPI de facturación emitida además de ingresos confirmados?

---

## 27. Instrucciones para Codex

Cuando Codex implemente el dashboard debe:

- usar una única fuente de verdad para las métricas;
- no recalcular KPIs en frontend con reglas distintas;
- mantener coherencia con filtros, listados y reportes;
- devolver estructuras válidas incluso sin datos;
- documentar claramente cualquier excepción, especialmente en métricas de facturas pendientes;
- priorizar claridad y estabilidad sobre complejidad analítica en el MVP.

---

## 28. Próximo documento recomendado

Después de este archivo, el siguiente más útil es:

- `12-task-board.md`
- `13-content-seo.md`
- `14-env-and-integrations.md`
- `15-open-questions.md`
- `16-master-prompt.md`

---

## 29. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo  
**Basado en:** `05-api-spec.md`, `07-acceptance-criteria.md` y `10-testing-strategy.md`  
**Siguiente paso recomendado:** `12-task-board.md`

