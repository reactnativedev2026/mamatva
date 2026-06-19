// import { Redirect } from 'expo-router';

// import { useUser } from '../context/UserContext';

// export default function Index() {
//   const { token, stage } = useUser();

//   if (!token) {
//     return <Redirect href="/(auth)/onboarding" />;
//   }

//   if (!stage) {
//     return <Redirect href="/(auth)/stage" />;
//   }

//   return <Redirect href="/(tabs)" />;
// }
import { Redirect } from 'expo-router';
export default function Index() {
 
  return <Redirect href="/(auth)/onboarding" />;
}