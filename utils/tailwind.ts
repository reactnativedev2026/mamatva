import { StyleSheet, useColorScheme } from 'react-native';

// Tailwind color palette
const colors = {
  primary: '#FF6B5A',
  'primary-light': '#FFE5E0',
  secondary: '#6B7280',
  'secondary-light': '#F3F4F6',
  white: '#FFFFFF',
  black: '#000000',
  'gray-50': '#F9FAFB',
  'gray-100': '#F3F4F6',
  'gray-200': '#E5E7EB',
  'gray-300': '#D1D5DB',
  'gray-400': '#9CA3AF',
  'gray-500': '#6B7280',
  'gray-600': '#4B5563',
  'gray-700': '#374151',
  'gray-800': '#1F2937',
  'gray-900': '#111827',
  'red-50': '#FEF2F2',
  'red-100': '#FEE2E2',
  'red-500': '#EF4444',
};

const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
};

const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
};

interface TailwindClassMap {
  [key: string]: any;
}

export const tailwindToStyle = (classNames: string | undefined): any => {
  if (!classNames) return {};

  const classes = classNames.split(' ').filter(Boolean);
  const styles: any = {};

  const classMap: TailwindClassMap = {
    // Flex
    'flex-1': { flex: 1 },
    flex: { display: 'flex', flexDirection: 'row' },
    'flex-col': { flexDirection: 'column' },
    'flex-row': { flexDirection: 'row' },
    'flex-wrap': { flexWrap: 'wrap' },

    // Items & Justify (alignment)
    'items-center': { alignItems: 'center' },
    'items-start': { alignItems: 'flex-start' },
    'items-end': { alignItems: 'flex-end' },
    'items-stretch': { alignItems: 'stretch' },
    'justify-center': { justifyContent: 'center' },
    'justify-start': { justifyContent: 'flex-start' },
    'justify-end': { justifyContent: 'flex-end' },
    'justify-between': { justifyContent: 'space-between' },
    'justify-around': { justifyContent: 'space-around' },

    // Padding
    'px-4': { paddingHorizontal: spacing[4] },
    'px-6': { paddingHorizontal: 24 },
    'py-3': { paddingVertical: 12 },
    'p-4': { padding: 16 },
    'p-6': { padding: 24 },
    'mb-2': { marginBottom: 8 },
    'mb-3': { marginBottom: 12 },
    'mb-4': { marginBottom: 16 },
    'mb-6': { marginBottom: 24 },
    'mb-8': { marginBottom: 32 },
    'mb-12': { marginBottom: 48 },
    'mt-1': { marginTop: 4 },
    'mt-2': { marginTop: 8 },
    'ml-3': { marginLeft: 12 },

    // Width & Height
    'w-24': { width: 96 },
    'w-32': { width: 128 },
    'h-14': { height: 56 },
    'h-24': { height: 96 },
    'h-32': { height: 128 },

    // Border
    'border': { borderWidth: 1, borderColor: colors['gray-300'] },
    'border-gray-300': { borderColor: colors['gray-300'] },
    'border-primary': { borderColor: colors.primary },
    'rounded-full': { borderRadius: 999 },
    'rounded-lg': { borderRadius: 8 },

    // Background colors
    'bg-white': { backgroundColor: colors.white },
    'bg-gray-50': { backgroundColor: colors['gray-50'] },
    'bg-gray-300': { backgroundColor: colors['gray-300'] },
    'bg-gray-500': { backgroundColor: colors['gray-500'] },
    'bg-gray-900': { backgroundColor: colors['gray-900'] },
    'bg-primary': { backgroundColor: colors.primary },
    'bg-primary-light': { backgroundColor: colors['primary-light'] },
    'bg-red-100': { backgroundColor: colors['red-100'] },

    // Text colors
    'text-gray-500': { color: colors['gray-500'] },
    'text-gray-600': { color: colors['gray-600'] },
    'text-gray-900': { color: colors['gray-900'] },
    'text-white': { color: colors.white },
    'text-primary': { color: colors.primary },

    // Text sizes
    'text-xs': { fontSize: fontSize.xs },
    'text-sm': { fontSize: fontSize.sm },
    'text-base': { fontSize: fontSize.base },
    'text-lg': { fontSize: fontSize.lg },
    'text-2xl': { fontSize: fontSize['2xl'] },
    'text-3xl': { fontSize: fontSize['3xl'] },
    'text-4xl': { fontSize: fontSize['4xl'] },
    'text-5xl': { fontSize: fontSize['5xl'] },
    'text-6xl': { fontSize: fontSize['6xl'] },

    // Font weight
    'font-semibold': { fontWeight: '600' },
    'font-bold': { fontWeight: 'bold' },
    'font-medium': { fontWeight: '500' },

    // Overflow & Text
    'truncate': { overflow: 'hidden' },
  };

  // Special handling for dynamic colors and sizes
  classes.forEach((cls) => {
    if (classMap[cls]) {
      Object.assign(styles, classMap[cls]);
    } else if (cls.startsWith('text-')) {
      const colorKey = cls.replace('text-', '');
      if (colors[colorKey as keyof typeof colors]) {
        styles.color = colors[colorKey as keyof typeof colors];
      }
    } else if (cls.startsWith('bg-')) {
      const colorKey = cls.replace('bg-', '');
      if (colors[colorKey as keyof typeof colors]) {
        styles.backgroundColor = colors[colorKey as keyof typeof colors];
      }
    }
  });

  return styles;
};
