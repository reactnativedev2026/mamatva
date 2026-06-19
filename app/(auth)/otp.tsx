// import { SafeAreaView, ScrollView, Text, View } from '@/components/ui/styled';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import React, { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Image, TextInput, TouchableOpacity } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useUser } from '../../context/UserContext';
// import { verifyOtp } from '../../utils/api';

// const OTPScreen = () => {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const { t } = useTranslation();
//   const params = useLocalSearchParams<{ phone?: string }>();
//   const { setSession, setToken } = useUser();
//   const [otp, setOtp] = useState<string[]>(['', '', '', '']);
//   const [timeLeft, setTimeLeft] = useState<number>(180);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const inputs = useRef<React.RefObject<TextInput | null>[]>([]);

//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [timeLeft]);

//   const handleOtpChange = (index: number, value: string) => {
//     const newOtp = [...otp];

//     if (value.length > 1) {
//       const paste = value.split('');
//       paste.forEach((digit: string, i: number) => {
//         if (index + i < otp.length && /^\d$/.test(digit)) {
//           newOtp[index + i] = digit;
//         }
//       });
//       setOtp(newOtp);
//       const nextIndex = newOtp.findIndex((v, i) => i > index && v === '');
//       if (nextIndex > -1 && inputs.current[nextIndex]) {
//         inputs.current[nextIndex]?.current?.focus();
//       }
//     } else if (/^\d?$/.test(value)) {
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (value && index < otp.length - 1 && inputs.current[index + 1]) {
//         inputs.current[index + 1]?.current?.focus();
//       }
//     }
//   };

//   const handleBackspace = (index: number, value: string) => {
//     if (!value && index > 0 && inputs.current[index - 1]) {
//       inputs.current[index - 1]?.current?.focus();
//     }
//   };

//   const handleLogin = async () => {
//     const otpString = otp.join('');
//     if (otpString.length !== 4 || loading) return;

//     try {
//       setLoading(true);
//       setErrorMessage('');

//       const response = await verifyOtp({
//         phone: String(params.phone || ''),
//         otp: otpString
//       });

//       console.log('VERIFY OTP RESPONSE', response);
//       console.log('VERIFY OTP RESPONSE DATA', response.data);

//       const session = response.data;

//       if (session?.accessToken) {
//         await setToken(session.accessToken);
//       }

//       await setSession(session || null);

//       router.push('/(auth)/language');
//     } catch (error) {
//       setErrorMessage(error instanceof Error ? error.message : t('otp.verifyFailed'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1 }}
//         className="px-6"
//       >
//         <View style={{ paddingTop: insets.top + 20 }} className="flex-1 justify-between pb-8">
//           {/* Logo */}
//           <View className="items-center mt-8 mb-8">
//             <View
//               style={{
//                 shadowColor: '#FF6B5A',
//                 shadowOffset: { width: 0, height: 10 },
//                 shadowOpacity: 0.4,
//                 shadowRadius: 20,
//                 elevation: 12,
//                 backgroundColor: 'white',
//                 borderRadius: 60,
//                 padding: 5,
//                 marginBottom: 12,
//               }}
//             >
//               <Image
//                 source={require('../../assets/images/mamvatamlogo2.jpeg')}
//                 style={{
//                   width: 120,
//                   height: 120,
//                   borderRadius: 60,
//                 }}
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           {/* OTP Content */}
//           <View className="flex-1">
//             <Text className="text-4xl font-bold text-gray-900 mb-3 text-center">
//               {t('otp.title')}
//             </Text>
//             <Text className="text-gray-600 text-center mb-8 text-base">
//               {t('otp.subtitle')}
//             </Text>

//             {errorMessage ? (
//               <Text className="text-red-500 text-center text-sm mb-4">{errorMessage}</Text>
//             ) : null}

//             {/* OTP Inputs */}
//             <View className="mb-8">
//               <Text className="text-gray-900 font-semibold mb-4 text-base">{t('otp.label')}</Text>
//               <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
//                 {otp.map((digit, index) => (
//                   <TextInput
//                     key={index}
//                     ref={(ref) => {
//                       if (!inputs.current[index]) {
//                         inputs.current[index] = React.createRef<TextInput>();
//                       }
//                       if (ref && inputs.current[index]) {
//                         inputs.current[index]!.current = ref;
//                       }
//                     }}
//                     style={{
//                       width: 75,
//                       height: 75,
//                       borderWidth: 2,
//                       borderColor: digit ? '#FF6B5A' : '#E5E7EB',
//                       borderRadius: 16,
//                       textAlign: 'center',
//                       fontSize: 28,
//                       fontWeight: 'bold',
//                       color: '#111827',
//                       backgroundColor: digit ? '#FFF5F3' : '#FFFFFF',
//                     }}
//                     maxLength={1}
//                     keyboardType="numeric"
//                     value={digit}
//                     onChangeText={(value) => handleOtpChange(index, value)}
//                     onKeyPress={({ nativeEvent }) => {
//                       if (nativeEvent.key === 'Backspace') {
//                         handleBackspace(index, otp[index]);
//                       }
//                     }}
//                   />
//                 ))}
//               </View>

//               {/* Auto verifying text */}
//               <Text className="text-center text-gray-500 text-sm mb-2">
//                 {t('otp.autoVerifying')}
//               </Text>

//               {/* Resend section */}
//               {timeLeft > 0 ? (
//                 <Text className="text-center text-gray-400 text-sm mb-6">
//                   {t('otp.resendIn')} {timeLeft} sec
//                 </Text>
//               ) : (
//                 <TouchableOpacity className="mb-6">
//                   <Text className="text-center text-primary text-sm font-semibold">
//                     {t('otp.resend')}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>

//         </View>
//       </ScrollView>

//       {/* Action Button - Absolute Bottom */}
//       <View style={{
//         paddingHorizontal: 24,
//         paddingBottom: insets.bottom + 20,
//         backgroundColor: 'white'
//       }}>
//         <TouchableOpacity
//           style={{
//             backgroundColor: otp.join('').length === 4 ? '#FF6B5A' : '#D1D5DB',
//             paddingVertical: 18,
//             borderRadius: 12,
//             alignItems: 'center',
//             shadowColor: otp.join('').length === 4 ? '#FF6B5A' : '#000',
//             shadowOffset: { width: 0, height: 4 },
//             shadowOpacity: otp.join('').length === 4 ? 0.3 : 0.1,
//             shadowRadius: 8,
//             elevation: 5,
//           }}
//           onPress={handleLogin}
//           disabled={otp.join('').length !== 4}
//         >
//           <Text style={{
//             color: '#FFFFFF',
//             fontSize: 16,
//             fontWeight: '700',
//             letterSpacing: 1,
//           }}>
//             {loading ? t('otp.verifying') : t('otp.login')}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default OTPScreen;



import { SafeAreaView, ScrollView, Text, View } from '@/components/ui/styled';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TextInput, TouchableOpacity } from 'react-native';
import { useUser } from '../../context/UserContext';
import { verifyOtp } from '../../utils/api';

const OTPScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ phone?: string }>();
  const { setSession, setToken } = useUser();
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const inputs = useRef<React.RefObject<TextInput | null>[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    if (value.length > 1) {
      const paste = value.split('');
      paste.forEach((digit: string, i: number) => {
        if (index + i < otp.length && /^\d$/.test(digit)) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      const nextIndex = newOtp.findIndex((v, i) => i > index && v === '');
      if (nextIndex > -1 && inputs.current[nextIndex]) {
        inputs.current[nextIndex]?.current?.focus();
      }
    } else if (/^\d?$/.test(value)) {
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1 && inputs.current[index + 1]) {
        inputs.current[index + 1]?.current?.focus();
      }
    }
  };

  const handleBackspace = (index: number, value: string) => {
    if (!value && index > 0 && inputs.current[index - 1]) {
      inputs.current[index - 1]?.current?.focus();
    }
  };

  const handleLogin = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4 || loading) return;
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await verifyOtp({ phone: String(params.phone || ''), otp: otpString });
      const session = response.data;
      if (session?.accessToken) await setToken(session.accessToken);
      await setSession(session || null);
      router.push('/(auth)/language');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('otp.verifyFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
        <View style={{ paddingTop: 20 }} className="flex-1 justify-between pb-8">
          {/* Logo */}
          <View className="items-center mt-8 mb-8">
            <View style={{
              shadowColor: '#FF6B5A',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 12,
              backgroundColor: 'white',
              borderRadius: 60,
              padding: 5,
              marginBottom: 12,
            }}>
              <Image
                source={require('../../assets/images/mamvatamlogo2.jpeg')}
                style={{ width: 120, height: 120, borderRadius: 60 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* OTP Content */}
          <View className="flex-1">
            <Text className="text-4xl font-bold text-gray-900 mb-3 text-center">{t('otp.title')}</Text>
            <Text className="text-gray-600 text-center mb-8 text-base">{t('otp.subtitle')}</Text>

            {errorMessage ? (
              <Text className="text-red-500 text-center text-sm mb-4">{errorMessage}</Text>
            ) : null}

            {/* OTP Inputs */}
            <View className="mb-8">
              <Text className="text-gray-900 font-semibold mb-4 text-base">{t('otp.label')}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      if (!inputs.current[index]) inputs.current[index] = React.createRef<TextInput>();
                      if (ref && inputs.current[index]) inputs.current[index]!.current = ref;
                    }}
                    style={{
                      width: 75,
                      height: 75,
                      borderWidth: 2,
                      borderColor: digit ? '#FF6B5A' : '#E5E7EB',
                      borderRadius: 16,
                      textAlign: 'center',
                      fontSize: 28,
                      fontWeight: 'bold',
                      color: '#111827',
                      backgroundColor: digit ? '#FFF5F3' : '#FFFFFF',
                    }}
                    maxLength={1}
                    keyboardType="numeric"
                    value={digit}
                    onChangeText={(value) => handleOtpChange(index, value)}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace') handleBackspace(index, otp[index]);
                    }}
                  />
                ))}
              </View>

              <Text className="text-center text-gray-500 text-sm mb-2">{t('otp.autoVerifying')}</Text>

              {timeLeft > 0 ? (
                <Text className="text-center text-gray-400 text-sm mb-6">
                  {t('otp.resendIn')} {timeLeft} sec
                </Text>
              ) : (
                <TouchableOpacity className="mb-6">
                  <Text className="text-center text-primary text-sm font-semibold">{t('otp.resend')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Button - Fixed Bottom - Onboarding jaisa */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: 'white' }}>
        <TouchableOpacity
          style={{
            backgroundColor: otp.join('').length === 4 ? '#FF6B5A' : '#D1D5DB',
            borderRadius: 12,
            paddingVertical: 18,
            alignItems: 'center',
            shadowColor: otp.join('').length === 4 ? '#FF6B5A' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: otp.join('').length === 4 ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={handleLogin}
          disabled={otp.join('').length !== 4}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
            {loading ? t('otp.verifying') : t('otp.login')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;