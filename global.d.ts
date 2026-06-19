// Allow Tailwind `className` prop on React Native components for NativeWind
import { ViewProps, TextProps, TextInputProps, ScrollViewProps, TouchableOpacityProps } from 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
}
