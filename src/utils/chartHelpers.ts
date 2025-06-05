import { ChartData, ChartOptions } from '../types/charts';

// Chart data formatting utilities
export const formatChartData = (
  data: any[],
  labelKey: string,
  valueKeys: string[]
): ChartData => {
  const labels = data.map(item => item[labelKey]);
  const datasets = valueKeys.map((key, index) => ({
    label: key,
    data: data.map(item => item[key]),
    backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
    borderColor: `hsl(${index * 60}, 70%, 40%)`
  }));

  return { labels, datasets };
};

// Color palette generation
export const generateColorPalette = (count: number): string[] => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

// Chart options helpers
export const getDefaultChartOptions = (type: string): Partial<ChartOptions> => {
  const baseOptions: Partial<ChartOptions> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false
      }
    }
  };

  switch (type) {
    case 'line':
      return {
        ...baseOptions,
        scales: {
          x: { display: true },
          y: { display: true, beginAtZero: true }
        }
      };
    case 'bar':
      return {
        ...baseOptions,
        scales: {
          x: { display: true },
          y: { display: true, beginAtZero: true }
        }
      };
    case 'pie':
    case 'doughnut':
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: {
            display: true,
            position: 'right'
          }
        }
      };
    default:
      return baseOptions;
  }
};