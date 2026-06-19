// import { SafeAreaView, ScrollView, Text, View } from '@/components/ui/styled';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Image, TextInput, TouchableOpacity } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { requestOtp } from '../../utils/api';

// const SignInScreen = () => {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const { t } = useTranslation();
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [location, setLocation] = useState('');
//   const [isPhoneFocused, setIsPhoneFocused] = useState(false);
//   const [showLocationPicker, setShowLocationPicker] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const locations = ['Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Egypt'];

//   const handleContinue = async () => {
//     if (!phoneNumber || !location || loading) {
//       return;
//     }

//     try {
//       setLoading(true);
//       setErrorMessage('');
//       await requestOtp({ phone: phoneNumber, location });
//       router.push({ pathname: '/(auth)/otp', params: { phone: phoneNumber, location } });
//     } catch (error) {
//       setErrorMessage(error instanceof Error ? error.message : t('signIn.requestOtpFailed'));
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
//           {/* Logo with Glow */}
//           <View className="items-center mb-12 mt-10">
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
//               }}
//             >
//               <Image
//                 source={require('../../assets/images/mamvatamlogo.jpeg')}
//                 style={{ width: 120, height: 120, borderRadius: 60 }}
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           {/* Sign In Content */}
//           <View className="flex-1">
//             <Text className="text-3xl font-bold text-gray-900 mb-2">
//               {t('signIn.title')}
//             </Text>
//             <Text className="text-gray-600 text-base mb-10">
//               {t('signIn.subtitle')}
//             </Text>

//             {errorMessage ? (
//               <Text className="text-red-500 text-sm mb-4">{errorMessage}</Text>
//             ) : null}

//             {/* Phone Number Input */}
//             <View className="mb-6">
//               <Text className="text-gray-900 font-semibold mb-3 text-base">
//                 {t('signIn.phoneNumber')}
//               </Text>
//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderColor: isPhoneFocused ? '#FF6B5A' : '#E5E7EB',
//                   backgroundColor: isPhoneFocused ? '#FFE5E0' : '#FFFFFF',
//                   borderRadius: 12,
//                   paddingHorizontal: 16,
//                   height: 56,
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                 }}
//               >
//                 <MaterialIcons
//                   name="phone"
//                   size={20}
//                   color={isPhoneFocused ? '#FF6B5A' : '#9CA3AF'}
//                 />
//                 <TextInput
//                   style={{
//                     flex: 1,
//                     marginLeft: 12,
//                     fontSize: 16,
//                     fontWeight: '500',
//                     color: '#111827',
//                   }}
//                   placeholder={t('signIn.phonePlaceholder')}
//                   placeholderTextColor="#D1D5DB"
//                   keyboardType="phone-pad"
//                   value={phoneNumber}
//                   onChangeText={setPhoneNumber}
//                   onFocus={() => setIsPhoneFocused(true)}
//                   onBlur={() => setIsPhoneFocused(false)}
//                 />
//               </View>
//             </View>

//             {/* Location Dropdown */}
//             <View className="mb-10">
//               <Text className="text-gray-900 font-semibold mb-3 text-base">
//                 {t('signIn.location')}
//               </Text>
//               <TouchableOpacity
//                 style={{
//                   borderWidth: 1,
//                   borderColor: showLocationPicker ? '#FF6B5A' : '#E5E7EB',
//                   backgroundColor: showLocationPicker ? '#FFE5E0' : '#FFFFFF',
//                   borderRadius: 12,
//                   paddingHorizontal: 16,
//                   height: 56,
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                 }}
//                 onPress={() => setShowLocationPicker(!showLocationPicker)}
//               >
//                 <Text style={{
//                   fontSize: 16,
//                   fontWeight: location ? '500' : '400',
//                   color: location ? '#111827' : '#9CA3AF',
//                 }}>
//                   {location || t('signIn.locationPlaceholder')}
//                 </Text>
//                 <MaterialIcons
//                   name={showLocationPicker ? 'expand-less' : 'expand-more'}
//                   size={24}
//                   color={showLocationPicker ? '#FF6B5A' : '#9CA3AF'}
//                 />
//               </TouchableOpacity>

//               {/* Location Picker Dropdown */}
//               {showLocationPicker && (
//                 <View style={{
//                   marginTop: 8,
//                   borderWidth: 1,
//                   borderColor: '#E5E7EB',
//                   borderRadius: 12,
//                   backgroundColor: '#FFFFFF',
//                   overflow: 'hidden',
//                   zIndex: 100,
//                 }}>
//                   {locations.map((loc, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={{
//                         paddingVertical: 12,
//                         paddingHorizontal: 16,
//                         borderBottomWidth: index < locations.length - 1 ? 1 : 0,
//                         borderBottomColor: '#F3F4F6',
//                       }}
//                       onPress={() => {
//                         setLocation(loc);
//                         setShowLocationPicker(false);
//                       }}
//                     >
//                       <Text style={{
//                         fontSize: 16,
//                         fontWeight: '500',
//                         color: '#111827',
//                       }}>
//                         {loc}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
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
//             backgroundColor: phoneNumber && location ? '#FF6B5A' : '#D1D5DB',
//             paddingVertical: 18,
//             borderRadius: 12,
//             alignItems: 'center',
//             shadowColor: phoneNumber && location ? '#FF6B5A' : '#000',
//             shadowOffset: { width: 0, height: 4 },
//             shadowOpacity: phoneNumber && location ? 0.3 : 0.1,
//             shadowRadius: 8,
//             elevation: 5,
//           }}
//           onPress={handleContinue}
//           disabled={!phoneNumber || !location}
//         >
//           <Text style={{
//             color: '#FFFFFF',
//             fontSize: 16,
//             fontWeight: '700',
//             letterSpacing: 1,
//           }}>
//             {loading ? t('signIn.sendingOtp') : t('signIn.continue')}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default SignInScreen;


// import { SafeAreaView, ScrollView, Text, View } from '@/components/ui/styled';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Image, TextInput, TouchableOpacity } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { requestOtp } from '../../utils/api';

// const SignInScreen = () => {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const { t } = useTranslation();
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [location, setLocation] = useState('');
//   const [isPhoneFocused, setIsPhoneFocused] = useState(false);
//   const [showLocationPicker, setShowLocationPicker] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const locations = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa','Gujarat','Haryana',
// 'Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
// 'Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
// 'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',

// 'Andaman and Nicobar Islands ','Chandigarh','Dadra and Nagar Haveli and Daman and Diu', 
// 'Delhi (National Capital Territory)','Jammu and Kashmir',
// 'Ladakh','Lakshadweep','Puducherry'];

//   const handleContinue = async () => {
//     if (!phoneNumber || !location || loading) {
//       return;
//     }

//     try {
//       setLoading(true);
//       setErrorMessage('');
//       await requestOtp({ phone: phoneNumber, location });
//       router.push({ pathname: '/(auth)/otp', params: { phone: phoneNumber, location } });
//     } catch (error) {
//       setErrorMessage(error instanceof Error ? error.message : t('signIn.requestOtpFailed'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1 }}
//         className="px-6"
//         // Needed so the inner dropdown ScrollView can capture its own scroll
//         // gestures instead of the outer page ScrollView swallowing them.
//         nestedScrollEnabled
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={{ paddingTop: insets.top + 20 }} className="flex-1 justify-between pb-8">
//           {/* Logo with Glow */}
//           <View className="items-center mb-12 mt-10">
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
//               }}
//             >
//               <Image
//                 source={require('../../assets/images/mamvatamlogo2.jpeg')}
//                 style={{ width: 120, height: 120, borderRadius: 60 }}
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           {/* Sign In Content */}
//           <View className="flex-1">
//             <Text className="text-3xl font-bold text-gray-900 mb-2">
//               {t('signIn.title')}
//             </Text>
//             <Text className="text-gray-600 text-base mb-10">
//               {t('signIn.subtitle')}
//             </Text>

//             {errorMessage ? (
//               <Text className="text-red-500 text-sm mb-4">{errorMessage}</Text>
//             ) : null}

//             {/* Phone Number Input */}
//             <View className="mb-6">
//               <Text className="text-gray-900 font-semibold mb-3 text-base">
//                 {t('signIn.phoneNumber')}
//               </Text>
//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderColor: isPhoneFocused ? '#FF6B5A' : '#E5E7EB',
//                   backgroundColor: isPhoneFocused ? '#FFE5E0' : '#FFFFFF',
//                   borderRadius: 12,
//                   paddingHorizontal: 16,
//                   height: 56,
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                 }}
//               >
//                 <MaterialIcons
//                   name="phone"
//                   size={20}
//                   color={isPhoneFocused ? '#FF6B5A' : '#9CA3AF'}
//                 />
//                 <TextInput
//                   style={{
//                     flex: 1,
//                     marginLeft: 12,
//                     fontSize: 16,
//                     fontWeight: '500',
//                     color: '#111827',
//                   }}
//                   placeholder={t('signIn.phonePlaceholder')}
//                   placeholderTextColor="#D1D5DB"
//                   keyboardType="phone-pad"
//                   value={phoneNumber}
//                   onChangeText={setPhoneNumber}
//                   onFocus={() => setIsPhoneFocused(true)}
//                   onBlur={() => setIsPhoneFocused(false)}
//                 />
//               </View>
//             </View>

//             {/* Location Dropdown */}
//             <View className="mb-10">
//               <Text className="text-gray-900 font-semibold mb-3 text-base">
//                 {t('signIn.location')}
//               </Text>
//               <TouchableOpacity
//                 style={{
//                   borderWidth: 1,
//                   borderColor: showLocationPicker ? '#FF6B5A' : '#E5E7EB',
//                   backgroundColor: showLocationPicker ? '#FFE5E0' : '#FFFFFF',
//                   borderRadius: 12,
//                   paddingHorizontal: 16,
//                   height: 56,
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                 }}
//                 onPress={() => setShowLocationPicker(!showLocationPicker)}
//               >
//                 <Text style={{
//                   fontSize: 16,
//                   fontWeight: location ? '500' : '400',
//                   color: location ? '#111827' : '#9CA3AF',
//                 }}>
//                   {location || t('signIn.locationPlaceholder')}
//                 </Text>
//                 <MaterialIcons
//                   name={showLocationPicker ? 'expand-less' : 'expand-more'}
//                   size={24}
//                   color={showLocationPicker ? '#FF6B5A' : '#9CA3AF'}
//                 />
//               </TouchableOpacity>

//               {/* Location Picker Dropdown — now scrollable.
//                   Key changes:
//                   1. View -> ScrollView so it can scroll its own content.
//                   2. maxHeight caps it (roughly 5-6 rows) instead of letting
//                      it expand to fit all ~36 states/UTs.
//                   3. nestedScrollEnabled lets it scroll independently of the
//                      outer page ScrollView (mainly matters on Android).
//                   4. showsVerticalScrollIndicator gives a visual scroll hint. */}
//               {showLocationPicker && (
//                 <ScrollView
//                   style={{
//                     marginTop: 8,
//                     maxHeight: 260,
//                     borderWidth: 1,
//                     borderColor: '#E5E7EB',
//                     borderRadius: 12,
//                     backgroundColor: '#FFFFFF',
//                   }}
//                   nestedScrollEnabled
//                   showsVerticalScrollIndicator
//                   keyboardShouldPersistTaps="handled"
//                 >
//                   {locations.map((loc, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={{
//                         paddingVertical: 12,
//                         paddingHorizontal: 16,
//                         borderBottomWidth: index < locations.length - 1 ? 1 : 0,
//                         borderBottomColor: '#F3F4F6',
//                       }}
//                       onPress={() => {
//                         setLocation(loc);
//                         setShowLocationPicker(false);
//                       }}
//                     >
//                       <Text style={{
//                         fontSize: 16,
//                         fontWeight: '500',
//                         color: '#111827',
//                       }}>
//                         {loc}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               )}
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Action Button - Absolute Bottom */}
//       <View style={{
//         paddingHorizontal: 24,
//         paddingBottom: insets.bottom + 60,
//         backgroundColor: 'white'
//       }}>
//         <TouchableOpacity
//           style={{
//             backgroundColor: phoneNumber && location ? '#FF6B5A' : '#D1D5DB',
//             paddingVertical: 18,
//             borderRadius: 12,
//             alignItems: 'center',
//             shadowColor: phoneNumber && location ? '#FF6B5A' : '#000',
//             shadowOffset: { width: 0, height: 4 },
//             shadowOpacity: phoneNumber && location ? 0.3 : 0.1,
//             shadowRadius: 8,
//             elevation: 5,
//             marginBottom: 20,
//           }}
//           onPress={handleContinue}
//           disabled={!phoneNumber || !location}
//         >
//           <Text style={{
//             color: '#FFFFFF',
//             fontSize: 16,
//             fontWeight: '700',
//             letterSpacing: 1,
//           }}>
//             {loading ? t('signIn.sendingOtp') : t('signIn.continue')}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default SignInScreen;

// import { SafeAreaView, ScrollView, Text, View } from '@/components/ui/styled';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Image, TextInput, TouchableOpacity } from 'react-native';
// import { requestOtp } from '../../utils/api';

// const SignInScreen = () => {
//   const router = useRouter();
//   const { t } = useTranslation();
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [location, setLocation] = useState('');
//   const [isPhoneFocused, setIsPhoneFocused] = useState(false);
//   const [showLocationPicker, setShowLocationPicker] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const locations = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa','Gujarat','Haryana',
// 'Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
// 'Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
// 'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
// 'Andaman and Nicobar Islands ','Chandigarh','Dadra and Nagar Haveli and Daman and Diu', 
// 'Delhi (National Capital Territory)','Jammu and Kashmir',
// 'Ladakh','Lakshadweep','Puducherry'];

//   const handleContinue = async () => {
//     if (!phoneNumber || !location || loading) return;
//     try {
//       setLoading(true);
//       setErrorMessage('');
//       await requestOtp({ phone: phoneNumber, location });
//       router.push({ pathname: '/(auth)/otp', params: { phone: phoneNumber, location } });
//     } catch (error) {
//       setErrorMessage(error instanceof Error ? error.message : t('signIn.requestOtpFailed'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1 }}
//         className="px-6"
//         nestedScrollEnabled
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={{ paddingTop: 20 }} className="flex-1 justify-between pb-8">
//           {/* Logo */}
//           <View className="items-center mb-12 mt-10">
//             <View style={{
//               shadowColor: '#FF6B5A',
//               shadowOffset: { width: 0, height: 10 },
//               shadowOpacity: 0.4,
//               shadowRadius: 20,
//               elevation: 12,
//               backgroundColor: 'white',
//               borderRadius: 60,
//               padding: 5,
//             }}>
//               <Image
//                 source={require('../../assets/images/mamvatamlogo2.jpeg')}
//                 style={{ width: 120, height: 120, borderRadius: 60 }}
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           {/* Sign In Content */}
//           <View className="flex-1">
//             <Text className="text-3xl font-bold text-gray-900 mb-2">{t('signIn.title')}</Text>
//             <Text className="text-gray-600 text-base mb-10">{t('signIn.subtitle')}</Text>

//             {errorMessage ? (
//               <Text className="text-red-500 text-sm mb-4">{errorMessage}</Text>
//             ) : null}

//             {/* Phone Number Input */}
//             <View className="mb-6">
//               <Text className="text-gray-900 font-semibold mb-3 text-base">{t('signIn.phoneNumber')}</Text>
//               <View style={{
//                 borderWidth: 1,
//                 borderColor: isPhoneFocused ? '#FF6B5A' : '#E5E7EB',
//                 backgroundColor: isPhoneFocused ? '#FFE5E0' : '#FFFFFF',
//                 borderRadius: 12,
//                 paddingHorizontal: 16,
//                 height: 56,
//                 flexDirection: 'row',
//                 alignItems: 'center',
//               }}>
//                 <MaterialIcons name="phone" size={20} color={isPhoneFocused ? '#FF6B5A' : '#9CA3AF'} />
//                 <TextInput
//                   style={{ flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '500', color: '#111827' }}
//                   placeholder={t('signIn.phonePlaceholder')}
//                   placeholderTextColor="#D1D5DB"
//                   keyboardType="phone-pad"
//                   value={phoneNumber}
//                   onChangeText={setPhoneNumber}
//                   onFocus={() => setIsPhoneFocused(true)}
//                   onBlur={() => setIsPhoneFocused(false)}
//                 />
//               </View>
//             </View>

//             {/* Location Dropdown */}
//             <View className="mb-10">
//               <Text className="text-gray-900 font-semibold mb-3 text-base">{t('signIn.location')}</Text>
//               <TouchableOpacity
//                 style={{
//                   borderWidth: 1,
//                   borderColor: showLocationPicker ? '#FF6B5A' : '#E5E7EB',
//                   backgroundColor: showLocationPicker ? '#FFE5E0' : '#FFFFFF',
//                   borderRadius: 12,
//                   paddingHorizontal: 16,
//                   height: 56,
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                 }}
//                 onPress={() => setShowLocationPicker(!showLocationPicker)}
//               >
//                 <Text style={{
//                   fontSize: 16,
//                   fontWeight: location ? '500' : '400',
//                   color: location ? '#111827' : '#9CA3AF',
//                 }}>
//                   {location || t('signIn.locationPlaceholder')}
//                 </Text>
//                 <MaterialIcons
//                   name={showLocationPicker ? 'expand-less' : 'expand-more'}
//                   size={24}
//                   color={showLocationPicker ? '#FF6B5A' : '#9CA3AF'}
//                 />
//               </TouchableOpacity>

//               {showLocationPicker && (
//                 <ScrollView
//                   style={{
//                     marginTop: 8,
//                     maxHeight: 260,
//                     borderWidth: 1,
//                     borderColor: '#E5E7EB',
//                     borderRadius: 12,
//                     backgroundColor: '#FFFFFF',
//                   }}
//                   nestedScrollEnabled
//                   showsVerticalScrollIndicator
//                   keyboardShouldPersistTaps="handled"
//                 >
//                   {locations.map((loc, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={{
//                         paddingVertical: 12,
//                         paddingHorizontal: 16,
//                         borderBottomWidth: index < locations.length - 1 ? 1 : 0,
//                         borderBottomColor: '#F3F4F6',
//                       }}
//                       onPress={() => { setLocation(loc); setShowLocationPicker(false); }}
//                     >
//                       <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>{loc}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               )}
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Button - Fixed Bottom - Onboarding jaisa */}
//       <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: 'white' }}>
//         <TouchableOpacity
//           style={{
//             backgroundColor: phoneNumber && location ? '#FF6B5A' : '#D1D5DB',
//             borderRadius: 12,
//             paddingVertical: 18,
//             alignItems: 'center',
//             shadowColor: phoneNumber && location ? '#FF6B5A' : '#000',
//             shadowOffset: { width: 0, height: 4 },
//             shadowOpacity: phoneNumber && location ? 0.3 : 0.1,
//             shadowRadius: 8,
//             elevation: 5,
//           }}
//           onPress={handleContinue}
//           disabled={!phoneNumber || !location}
//         >
//           <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
//             {loading ? t('signIn.sendingOtp') : t('signIn.continue')}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default SignInScreen;

import { SafeAreaView, ScrollView, Text, View } from '@/components/ui/styled';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TextInput, TouchableOpacity } from 'react-native';
import { requestOtp } from '../../utils/api';

const SignInScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const locations = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa','Gujarat','Haryana',
'Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
'Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
'Andaman and Nicobar Islands ','Chandigarh','Dadra and Nagar Haveli and Daman and Diu', 
'Delhi (National Capital Territory)','Jammu and Kashmir',
'Ladakh','Lakshadweep','Puducherry'];

  const handleContinue = async () => {
    if (!phoneNumber || !location || loading) return;
    try {
      setLoading(true);
      setErrorMessage('');
      await requestOtp({ phone: phoneNumber, location });
      router.push({ pathname: '/(auth)/otp', params: { phone: phoneNumber, location } });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('signIn.requestOtpFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6"
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ paddingTop: 20 }} className="flex-1 justify-between pb-8">
          {/* Logo */}
          <View className="items-center mb-12 mt-10">
            <View style={{
              shadowColor: '#FF6B5A',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 12,
              backgroundColor: 'white',
              borderRadius: 60,
              padding: 5,
            }}>
              <Image
                source={require('../../assets/images/mamvatamlogo2.jpeg')}
                style={{ width: 120, height: 120, borderRadius: 60 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Sign In Content */}
          <View className="flex-1">
            <Text className="text-3xl font-bold text-gray-900 mb-2">{t('signIn.title')}</Text>
            <Text className="text-gray-600 text-base mb-10">{t('signIn.subtitle')}</Text>

            {errorMessage ? (
              <Text className="text-red-500 text-sm mb-4">{errorMessage}</Text>
            ) : null}

            {/* Phone Number Input */}
            <View className="mb-6">
              <Text className="text-gray-900 font-semibold mb-3 text-base">{t('signIn.phoneNumber')}</Text>
              <View style={{
                borderWidth: 1,
                borderColor: isPhoneFocused ? '#FF6B5A' : '#E5E7EB',
                backgroundColor: isPhoneFocused ? '#FFE5E0' : '#FFFFFF',
                borderRadius: 12,
                paddingHorizontal: 16,
                height: 56,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <MaterialIcons name="phone" size={20} color={isPhoneFocused ? '#FF6B5A' : '#9CA3AF'} />
                <TextInput
                  style={{ flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '500', color: '#111827' }}
                  placeholder={t('signIn.phonePlaceholder')}
                  placeholderTextColor="#D1D5DB"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                />
              </View>
            </View>

            {/* Location Dropdown */}
            <View className="mb-10">
              <Text className="text-gray-900 font-semibold mb-3 text-base">{t('signIn.location')}</Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: showLocationPicker ? '#FF6B5A' : '#E5E7EB',
                  backgroundColor: showLocationPicker ? '#FFE5E0' : '#FFFFFF',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  height: 56,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => setShowLocationPicker(!showLocationPicker)}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: location ? '500' : '400',
                  color: location ? '#111827' : '#9CA3AF',
                }}>
                  {location || t('signIn.locationPlaceholder')}
                </Text>
                <MaterialIcons
                  name={showLocationPicker ? 'expand-less' : 'expand-more'}
                  size={24}
                  color={showLocationPicker ? '#FF6B5A' : '#9CA3AF'}
                />
              </TouchableOpacity>

              {showLocationPicker && (
                <ScrollView
                  style={{
                    marginTop: 8,
                    maxHeight: 260,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 12,
                    backgroundColor: '#FFFFFF',
                  }}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                  keyboardShouldPersistTaps="handled"
                >
                  {locations.map((loc, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderBottomWidth: index < locations.length - 1 ? 1 : 0,
                        borderBottomColor: '#F3F4F6',
                      }}
                      onPress={() => { setLocation(loc); setShowLocationPicker(false); }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>{loc}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Button - Fixed Bottom - Onboarding jaisa */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: 'white' }}>
        <TouchableOpacity
          style={{
            backgroundColor: phoneNumber && location ? '#FF6B5A' : '#D1D5DB',
            borderRadius: 12,
            paddingVertical: 18,
            alignItems: 'center',
            shadowColor: phoneNumber && location ? '#FF6B5A' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: phoneNumber && location ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={handleContinue}
          disabled={!phoneNumber || !location}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
            {loading ? t('signIn.sendingOtp') : t('signIn.continue')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;