import { useMemo } from 'react';
import { tailwindToStyle } from '../utils/tailwind';

export const useTailwindStyle = (classNames: string | undefined) => {
  return useMemo(() => tailwindToStyle(classNames), [classNames]);
};
