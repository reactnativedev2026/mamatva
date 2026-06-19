// import React from 'react';
// import {
//   View as RNView,
//   Text as RNText,
//   TextInput as RNTextInput,
//   ScrollView as RNScrollView,
//   SafeAreaView as RNSafeAreaView,
//   TouchableOpacity as RNTouchableOpacity,
//   ViewProps,
//   TextProps,
//   TextInputProps,
//   ScrollViewProps,
//   TouchableOpacityProps,
// } from 'react-native';
// import { tailwindToStyle } from '../../utils/tailwind';

// interface StyledViewProps extends ViewProps {
//   className?: string;
//   children?: React.ReactNode;
// }

// interface StyledTextProps extends TextProps {
//   className?: string;
//   children?: React.ReactNode;
// }

// interface StyledTextInputProps extends TextInputProps {
//   className?: string;
//   children?: React.ReactNode;
// }

// interface StyledScrollViewProps extends ScrollViewProps {
//   className?: string;
//   children?: React.ReactNode;
// }

// interface StyledSafeAreaViewProps extends ViewProps {
//   className?: string;
//   children?: React.ReactNode;
// }

// interface StyledTouchableOpacityProps extends TouchableOpacityProps {
//   className?: string;
//   children?: React.ReactNode;
// }

// export const View: React.FC<StyledViewProps> = ({ className, style, ...props }) => {
//   const tailwindStyle = tailwindToStyle(className);
//   return <RNView {...props} style={[tailwindStyle, style]} />;
// };

// export const Text: React.FC<StyledTextProps> = ({ className, style, ...props }) => {
//   const tailwindStyle = tailwindToStyle(className);
//   return <RNText {...props} style={[tailwindStyle, style]} />;
// };

// export const TextInput: React.FC<StyledTextInputProps> = ({ className, style, ...props }) => {
//   const tailwindStyle = tailwindToStyle(className);
//   return <RNTextInput {...props} style={[tailwindStyle, style]} />;
// };

// export const ScrollView: React.FC<StyledScrollViewProps> = ({ className, style, ...props }) => {
//   const tailwindStyle = tailwindToStyle(className);
//   return <RNScrollView {...props} style={[tailwindStyle, style]} />;
// };

// export const SafeAreaView: React.FC<StyledSafeAreaViewProps> = ({ className, style, ...props }) => {
//   const tailwindStyle = tailwindToStyle(className);
//   return <RNSafeAreaView {...props} style={[tailwindStyle, style]} />;
// };

// export const TouchableOpacity: React.FC<StyledTouchableOpacityProps> = ({ className, style, ...props }) => {
//   const tailwindStyle = tailwindToStyle(className);
//   return <RNTouchableOpacity {...props} style={[tailwindStyle, style]} />;
// };


import React from 'react';
import {
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView,
  ScrollViewProps,
  TextInputProps,
  TextProps,
  TouchableOpacityProps,
  ViewProps,
} from 'react-native';
// IMPORTANT: SafeAreaView must come from react-native-safe-area-context,
// NOT from react-native. The react-native one only handles the TOP inset
// on iOS and does nothing on Android, and never handles the bottom inset
// at all — which is why content was going under the status bar and the
// nav/home-indicator area.
import { SafeAreaView as RNSafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { tailwindToStyle } from '../../utils/tailwind';

interface StyledViewProps extends ViewProps {
  className?: string;
  children?: React.ReactNode;
}

interface StyledTextProps extends TextProps {
  className?: string;
  children?: React.ReactNode;
}

interface StyledTextInputProps extends TextInputProps {
  className?: string;
  children?: React.ReactNode;
}

interface StyledScrollViewProps extends ScrollViewProps {
  className?: string;
  children?: React.ReactNode;
}

interface StyledSafeAreaViewProps extends SafeAreaViewProps {
  className?: string;
  children?: React.ReactNode;
}

interface StyledTouchableOpacityProps extends TouchableOpacityProps {
  className?: string;
  children?: React.ReactNode;
}

export const View: React.FC<StyledViewProps> = ({ className, style, ...props }) => {
  const tailwindStyle = tailwindToStyle(className);
  return <RNView {...props} style={[tailwindStyle, style]} />;
};

export const Text: React.FC<StyledTextProps> = ({ className, style, ...props }) => {
  const tailwindStyle = tailwindToStyle(className);
  return <RNText {...props} style={[tailwindStyle, style]} />;
};

export const TextInput: React.FC<StyledTextInputProps> = ({ className, style, ...props }) => {
  const tailwindStyle = tailwindToStyle(className);
  return <RNTextInput {...props} style={[tailwindStyle, style]} />;
};

export const ScrollView: React.FC<StyledScrollViewProps> = ({ className, style, ...props }) => {
  const tailwindStyle = tailwindToStyle(className);
  return <RNScrollView {...props} style={[tailwindStyle, style]} />;
};

export const SafeAreaView: React.FC<StyledSafeAreaViewProps> = ({ className, style, ...props }) => {
  const tailwindStyle = tailwindToStyle(className);
  return <RNSafeAreaView {...props} style={[tailwindStyle, style]} />;
};

export const TouchableOpacity: React.FC<StyledTouchableOpacityProps> = ({ className, style, ...props }) => {
  const tailwindStyle = tailwindToStyle(className);
  return <RNTouchableOpacity {...props} style={[tailwindStyle, style]} />;
};