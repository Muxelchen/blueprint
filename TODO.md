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
1. AreaChart.tsx
2. BarChart.tsx  
3. Calendar.tsx
4. DataTable.tsx
5. DonutChart.tsx
6. GaugeChart.tsx
7. Heatmap.tsx
8. index.ts
9. KPICard.tsx
10. LineChart.tsx
11. PieChart.tsx
12. ProgressBar.tsx
13. RealtimeChart.tsx
14. ScatterPlot.tsx
15. Timeline.tsx
16. Treemap.tsx
17. WeatherWidget.tsx

**Regel:** Only fix one widget per prompt from the list

### Status
- [ ] AreaChart.tsx (als erstes bearbeiten)
- [ ] BarChart.tsx
- [ ] Calendar.tsx
- [ ] DataTable.tsx
- [ ] DonutChart.tsx
- [ ] GaugeChart.tsx
- [ ] Heatmap.tsx
- [ ] index.ts
- [ ] KPICard.tsx
- [ ] LineChart.tsx
- [ ] PieChart.tsx
- [ ] ProgressBar.tsx
- [ ] RealtimeChart.tsx
- [ ] ScatterPlot.tsx
- [ ] Timeline.tsx
- [ ] Treemap.tsx
- [ ] WeatherWidget.tsx





## UI/UX Anpassungssystem - Schnelle Konfiguration

### Ziel: Alles schnell und einfach anpassbar machen

Das gesamte System soll so entwickelt werden, dass Änderungen am Layout und Design schnell vorgenommen werden können, ohne im Code rumwühlen zu müssen.

### Wichtige Konfigurationsmöglichkeiten:

#### Layout & Navigation
- [ ] **Sidebar Position**: Links, rechts oder ausblendbar
- [ ] **Navigation Style**: Sidebar vs. Top-Navigation mit Tabs
- [ ] **Header Position**: Oben, ausblendbar oder sticky
- [ ] **Footer**: Ein-/ausblendbar und Position anpassbar

#### Typography & Design
- [ ] **Schriftart**: Schnell zwischen verschiedenen Font-Familien wechseln
- [ ] **Schriftgrößen**: Global scaling für alle Text-Elemente
- [ ] **Farbschema**: Einfache Theme-Auswahl (Light, Dark, Custom)
- [ ] **Accent Colors**: Primär- und Sekundärfarben schnell ändern

#### Widget & Content Layout
- [ ] **Grid System**: Flexibel zwischen 1, 2, 3, 4 Spalten wechseln
- [ ] **Widget Spacing**: Abstände zwischen Elementen anpassbar
- [ ] **Container Width**: Fluid vs. Fixed width Layouts
- [ ] **Card Styles**: Verschiedene Card-Designs (bordered, shadow, flat)

#### Erweiterte Anpassungen
- [ ] **Animation Speed**: Hover, Transition und Loading-Animationen
- [ ] **Border Radius**: Global für alle UI-Elemente
- [ ] **Button Styles**: Verschiedene Button-Varianten (outlined, filled, ghost)
- [ ] **Icon Set**: Zwischen verschiedenen Icon-Bibliotheken wechseln
- [ ] **Density**: Compact vs. Comfortable spacing modes

### Implementation Approach
- [ ] **Config File**: Zentrale JSON/TS Konfigurationsdatei
- [ ] **Live Preview**: Änderungen in Echtzeit sehen
- [ ] **Preset Templates**: Vorgefertigte Design-Kombinationen
- [ ] **Export/Import**: Konfigurationen speichern und teilen
- [ ] **CSS Variables**: Dynamische CSS Custom Properties nutzen
- [ ] **Context API**: React Context für globale Design-States

### Technische Umsetzung
- [ ] Theme Provider erweitern für mehr Konfigurationsoptionen
- [ ] CSS Custom Properties für alle anpassbaren Werte
- [ ] Hook für Theme-Switching entwickeln
- [ ] Konfigurationspanel/Settings-Seite erstellen
- [ ] Responsive Breakpoints konfigurierbar machen