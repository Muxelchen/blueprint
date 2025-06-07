# TODO - Personal Notes

## Widgets Verbesserungen

### Problem: Widget Größen
Die widgets sollen verbessert werden - alle haben Größenprobleme und verwenden die gleiche Größe obwohl sie unterschiedliche Größen benötigen.

### Layout Änderung
✅ **ERLEDIGT**: Aus 3 Widgets pro Reihe sollen 2 Widgets pro Reihe werden, damit sie mehr Platz haben.
- Geändert in App.tsx: `lg:grid-cols-3` → `md:grid-cols-2`
- Jetzt zeigt das Layout maximal 2 Widgets nebeneinander
- Donut Chart ist automatisch in die nächste Reihe gerutscht

### Detaillierter Prompt für Widget-Verbesserungen:

I love all the chart widgets. They are super great but there are a few problems I want you to figure out the problems of every one by yourself. 90% of them have problems. I think every single one of them has in comen: They dont have the fitting size. They all have the same size even tho they need other sizes. Your task is to figure out the problem with every single one and also resize them. You should only do one widget per prompt start with the first one in the list

**Widget Liste (ein Widget pro Prompt bearbeiten):**
1. Heatmap.tsx
2. index.ts
3. KPICard.tsx
4. LineChart.tsx
5. ProgressBar.tsx (coole Animation fehlt)
6. RealtimeChart.tsx
7. ScatterPlot.tsx
8. Treemap.tsx

**Regel:** Only fix one widget per prompt from the list

### Status
- [X] AreaChart.tsx (als erstes bearbeiten)
- [X] BarChart.tsx
- [X] Calendar.tsx
- [X] DataTable.tsx
- [X] DonutChart.tsx
- [X] GaugeChart.tsx
- [ ] Heatmap.tsx
- [ ] index.ts
- [ ] KPICard.tsx
- [ ] LineChart.tsx
- [X] PieChart.tsx
- [ ] ProgressBar.tsx
- [ ] RealtimeChart.tsx
- [ ] ScatterPlot.tsx
- [X] Timeline.tsx
- [ ] Treemap.tsx
- [X] WeatherWidget.tsx





## UI/UX Anpassungssystem - Schnelle Konfiguration

### Ziel: Alles schnell und einfach anpassbar machen

Das gesamte System soll so entwickelt werden, dass Änderungen am Layout und Design schnell vorgenommen werden können, ohne im Code rumwühlen zu müssen.

### Wichtige Konfigurationsmöglichkeiten:

#### Layout & Navigation
- [ ] **Sidebar Position**: Links, rechts oder ausblendbar **[M]** *(Mittlerer Aufwand, Layout-Umbrüche möglich)*
- [ ] **Navigation Style**: Sidebar vs. Top-Navigation mit Tabs **[L]** *(Komplexe Refactoring, hohes Bug-Risiko)*
- [ ] **Header Position**: Oben, ausblendbar oder sticky **[S]** *(Einfach, niedrigeres Risiko)*
- [ ] **Footer**: Ein-/ausblendbar und Position anpassbar **[XS]** *(Sehr einfach, kaum Risiko)*

#### Typography & Design
- [ ] **Schriftart**: Schnell zwischen verschiedenen Font-Familien wechseln **[S]** *(CSS Variables, geringes Risiko)*
- [ ] **Schriftgrößen**: Global scaling für alle Text-Elemente **[M]** *(Responsive Design beachten, mittleres Risiko)*
- [ ] **Farbschema**: Einfache Theme-Auswahl (Light, Dark, Custom) **[S]** *(Bereits teilweise vorhanden)*
- [ ] **Accent Colors**: Primär- und Sekundärfarben schnell ändern **[XS]** *(CSS Variables, sehr einfach)*

#### Widget & Content Layout
- [ ] **Grid System**: Flexibel zwischen 1, 2, 3, 4 Spalten wechseln **[S]** *(Tailwind Grid Classes, einfach)*
- [ ] **Widget Spacing**: Abstände zwischen Elementen anpassbar **[XS]** *(CSS Gap Properties, sehr einfach)*
- [ ] **Container Width**: Fluid vs. Fixed width Layouts **[S]** *(Max-width CSS, einfach)*
- [ ] **Card Styles**: Verschiedene Card-Designs (bordered, shadow, flat) **[S]** *(Variant Props, einfach)*

#### Erweiterte Anpassungen
- [ ] **Animation Speed**: Hover, Transition und Loading-Animationen **[M]** *(Framer Motion Config, Performance beachten)*
- [ ] **Border Radius**: Global für alle UI-Elemente **[S]** *(CSS Variables, einfach)*
- [ ] **Button Styles**: Verschiedene Button-Varianten (outlined, filled, ghost) **[XS]** *(Bereits vorhanden, sehr einfach)*
- [ ] **Icon Set**: Zwischen verschiedenen Icon-Bibliotheken wechseln **[L]** *(Bundle Size, Import-Management komplex)*
- [ ] **Density**: Compact vs. Comfortable spacing modes **[M]** *(Alle Komponenten anpassen, mittlerer Aufwand)*

### Implementation Approach
- [ ] **Config File**: Zentrale JSON/TS Konfigurationsdatei **[S]** *(TypeScript Types, strukturiert)*
- [ ] **Live Preview**: Änderungen in Echtzeit sehen **[L]** *(State Management, Performance kritisch)*
- [ ] **Preset Templates**: Vorgefertigte Design-Kombinationen **[S]** *(JSON Configs, einfach)*
- [ ] **Export/Import**: Konfigurationen speichern und teilen **[M]** *(File I/O, Validation nötig)*
- [ ] **CSS Variables**: Dynamische CSS Custom Properties nutzen **[S]** *(Modern CSS, gut unterstützt)*
- [ ] **Context API**: React Context für globale Design-States **[M]** *(Re-render Optimierung wichtig)*

### Technische Umsetzung
- [ ] Theme Provider erweitern für mehr Konfigurationsoptionen **[M]** *(Bestehenden Code erweitern, mittleres Risiko)*
- [ ] CSS Custom Properties für alle anpassbaren Werte **[L]** *(Großer Refactor, alle Styles anpassen)*
- [ ] Hook für Theme-Switching entwickeln **[S]** *(Custom Hook, localStorage)*
- [ ] Konfigurationspanel/Settings-Seite erstellen **[M]** *(UI Components, Form Handling)*
- [ ] Responsive Breakpoints konfigurierbar machen **[L]** *(Tailwind Config, Build-Process Änderungen)*