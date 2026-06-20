import { Redirect } from 'expo-router';
import { useUser } from '../context/UserContext';

export default function Index() {
  const { token, stage, authStep } = useUser();

  if (!token) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (stage) {
    return <Redirect href="/(tabs)" />;
  }

  if (authStep === 'language') {
    return <Redirect href="/(auth)/language" />;
  }

  if (authStep === 'otp') {
    return <Redirect href="/(auth)/otp" />;
  }

  if (authStep === 'stage') {
    return <Redirect href="/(auth)/stage" />;
  }

  return <Redirect href="/(auth)/signin" />;
}
