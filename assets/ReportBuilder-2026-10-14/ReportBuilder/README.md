# Report Builder · POC

A report builder prototype on top of the Silver dimensions proposed for th_datalake. It runs entirely in
the browser against deterministic mock data for a single tenant (about 25k rows across 10 tables).

Requires [Node.js](https://nodejs.org) 20 or later. From this folder:

```sh
npx pnpm@10 install --frozen-lockfile   # once: installs exactly the versions in pnpm-lock.yaml
npm run dev                              # http://localhost:4669 → "Nuevo reporte" opens the simple editor
npm run smoke                            # runs every example template and checks the engine invariants
```

`npx` downloads pnpm on the fly, so it doesn't need to be installed. `npm install` also works, but it may
pick newer compatible versions of the libraries instead of the locked ones. The sample data is generated in the browser on
every load, and saved reports live in that browser's `localStorage`; "Restaurar ejemplos" resets them.

Design rationale, full feature list, module-by-module explanation and the execution plan (in Spanish) are in [doc/](doc/README.md).

## Pages

| Route | What it does |
|---|---|
| `#/` Reports | Lists the Report Templates and the latest Report Runs. Shows the Template → (Ad-hoc / Scheduled) → Run flow. |
| `#/studio/:id` Editor (simple) | The default way to create a report. Three steps: pick a source (**Transacciones**, **Saldos** or **Conciliaciones**), then drag business blocks into **Agrupar por / Mostrar / Filtrar** with a period picker, then see the live result. Includes quick starts and a two-value calculated-field dialog. "Modo avanzado" hands the report to the Builder. |
| `#/builder/:id` Builder (advanced) | Field catalog by domain, organized as a parent / child / subtype tree. Three shelves: Dimensions, Measures and Filters, with drag & drop. Also holds formulas, the output type, a live preview, the generated SQL and scheduling. |
| `#/view/:id[/run/:runId]` Viewer | Exposed parameters, **Run**, run metadata, the output, CSV export and the run history (ad-hoc and scheduled). Each run keeps a snapshot of the template. |
| `#/model` Silver model | Proposed tables, lineage for each column, and the gaps found in the source repos. See also [SILVER_MODEL.md](SILVER_MODEL.md). |

## What it supports

- **Simple editor (Studio):** reports are described in business terms and compiled into a regular template (`src/studio/spec.ts`), so the Viewer, runs and schedules work unchanged.
  - **Transacciones:** PSP / Internal / External Payins, PSP / Internal Payouts, payment orders and Bank Movements, toggled as chips. **Saldos:** balance at the start and end of the period, plus the variation. **Conciliaciones:** matching columns (left / right / difference) and KPIs such as % conciliado, pending amount, days open and % automatic.
  - **Extracto de cuenta:** every statement line of an account (one row per movement), with **Saldo después del movimiento**. This is a running total: the account's last balance before *Desde*, plus each movement in date order, restarting for each account (`ColumnRef.running`, shown as a window function in the SQL tab). **Saldo después del movimiento (USD)** is that balance converted at each movement's day rate (`running.divideBy`), and it brings a **Tipo de cambio** column along. Transacciones also offers **Neto (moneda original)** and one row per transaction.
  - Every source groups by **Grupo, Empresa, Cuenta, Moneda, País** (and Banco) in any combination. It uses the flat grain (`grain: { signature: '*', mode: 'flat' }`), so child-level groupings such as Categoría are never dropped.
  - Transactions carry a cashflow **Categoría** (CF01…O09) and a user-defined **Tag**. Both can be used to group and to filter.
  - **Showing a field without grouping:** drop Categoría, Tag, Descripción… on **Mostrar** (or use the column button in the panel) to add it as a text column. Each row shows its value, or "n valores" when a summary row mixes several (aggregation `ONE`, also offered in the Builder).
  - Calculated fields: pick two values and an operation (−, +, ×, ÷, % of, Δ%), or write a free formula in the existing editor. Any values a formula needs are added automatically.

- **Parent/child:** when a report combines a parent with its child, the Builder asks how to group them:
  - summarize by parent;
  - hierarchical, with subtotals and expandable rows;
  - detail by child.

  Each option shows its real row count. The answer is stored in the template as `grain`, and the Builder asks again only when the combination of entities changes.
- **Siblings:** fields from siblings (e.g. Balances + Transactions) are combined by drill-across, with no fan-out.
- **M:N through a bridge:** a report can use two entities joined only through a bridge (e.g. Tag Group + Transactions). Totals are deduplicated.
- **Subtypes:** using a payload field (e.g. Payin) adds the type filter automatically.
- **Semi-additive measures:** balances take `LAST` per account, then are summed across accounts.
- **Currency guard:** adding amounts in different currencies raises a warning, and the total is hidden.
- **Formulas:**
  - Row-level, e.g. `IF([x] > 7, "…", "…")`.
  - Aggregate, e.g. `DIV(SUM([a]), SUM([b]))`, which behaves as a measure.
  - A formula can reference another formula by name, e.g. `[Cobros] - [Pagos]`.
  - Formulas are validated live and show a sample value.
- **Filters:**
  - Filters by type: list, range, last N days, contains, empty.
  - HAVING on aggregate formulas.
  - A filter on a child entity becomes a semi-join.
  - Any filter can be exposed as a parameter in the Viewer.
- **JOIN contexts: the same table joined more than once.**
  - Use this when a report needs two columns from the same table under different filters. Example: balance as of t1 vs balance as of t2, or transactions this month vs last month.
  - When you add a measure from a table that is already in the report, the Builder asks **"same JOIN or new JOIN?"**.
  - A new JOIN gets its own row (t1, t2…). Its filters, dropped onto that row, apply to that JOIN only.
  - Each JOIN is filtered and aggregated separately. The JOINs are then combined on the report's dimensions (`FULL OUTER JOIN`), just as siblings are.
  - The dimensions can also be fields of the duplicated table itself, e.g. counterparty in "this month vs last month".
- **Report parameters:**
  - Variables such as `Desde` and `Hasta`, with a fixed or relative default: start or end of month, previous month, today…
  - Relative defaults are resolved on each run, which suits scheduled reports.
  - Any filter value, global or per JOIN, can be bound to a parameter with the selector next to the value.
  - Column labels interpolate parameters: `Saldo al {Desde}` → `Saldo al 01/09/2026`.
  - The Viewer asks for the parameters before running, and each Run stores the values it used.
- **Column formulas:**
  - Syntax: `[@Saldo al {Hasta}] - [@Saldo al {Desde}]`. They are computed on the aggregated result, including totals.
  - "Compare with…" on a measure adds Δ and Δ% automatically.
  - Example: *Comparación de cierre de caja*. It shows the balance as of t1, the balance as of t2, the variance, the period's movements and the difference left unexplained.
- **Outputs:** Table (flat or hierarchical), Pivot, Bars, Stacked bars, Lines, Area, Pie and KPI.
  - Pivot totals and charts that show fewer dimensions are re-queried at their own grain. They are never summed from the displayed cells.

## Code

```
src/
  model/        silver.ts (semantic layer) · mockData.ts · seeds.ts (9 example templates + runs)
  engine/       formula.ts (parser/evaluator) · catalog.ts (graph + joins) · query.ts (grain resolution, execution, SQL) · report.ts (Template/Run)
  builder/      FieldPanel · Shelves · FilterEditor · FormulaEditor · GrainDialog · ScheduleDialog · OutputBar
  output/       ReportOutput (table, pivot, charts, KPI)
  pages/        Library · Builder · Viewer · Model
```

In a real implementation, the engine in `query.ts` would move to the backend and generate the SQL it
already shows in the "SQL over Silver" tab. The Report Run would persist its result, not recompute it.
Templates and runs are stored in `localStorage`; use "Restore examples" to reset them.
