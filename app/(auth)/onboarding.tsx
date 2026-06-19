// import { SafeAreaView, ScrollView, Text, View } from '@/components/ui/styled';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Image, TouchableOpacity } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const onboardingSlides = [
//   {
//     id: 1,
//     titleKey: 'onboarding.slide1Title',
//     descriptionKey: 'onboarding.slide1Description',
//     image: require('../../assets/images/onboarding-family2.jpeg'),
//     fullImage: true, 
//   },
//   {
//     id: 2,
//     titleKey: 'onboarding.slide2Title',
//     descriptionKey: 'onboarding.slide2Description',
//     image: require('../../assets/images/onboarding102.png'),
//   },
//   {
//     id: 3,
//     titleKey: 'onboarding.slide3Title',
//     descriptionKey: 'onboarding.slide3Description',
//     image: require('../../assets/images/onboarding92.png'),
//   },
// ];

// const OnboardingScreen = () => {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const { t } = useTranslation();
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const handleNext = () => {
//     if (currentSlide < onboardingSlides.length - 1) {
//       setCurrentSlide(currentSlide + 1);
//     } else {
//       router.replace('/(auth)/signin');
//     }
//   };

//   const slide = onboardingSlides[currentSlide];

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1 }}
//         className="flex-1"
//       >
//         <View className="flex-1 px-6 justify-between py-8" style={{ paddingTop: insets.top + 20 }}>
//           {/* Illustration Area */}
//           <View style={{ height: '65%', width: '100%', marginBottom: 20 }}>
//             <Image
//               source={slide.image}
//               style={{ width: '100%', height: '100%' }}
//               resizeMode="cover"
//             />
//           </View>

//           {/* Content Area */}
//           <View className="px-6">
//             <Text className="text-4xl font-bold text-gray-900 mb-4 text-center">
//               {t(slide.titleKey)}
//             </Text>
//             <Text className="text-base text-gray-600 text-center mb-8">
//               {t(slide.descriptionKey)}
//             </Text>

//             {/* Slide Indicators */}
//             <View style={{
//               flexDirection: 'row',
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginBottom: 16,
//               gap: 8,
//             }}>
//               {onboardingSlides.map((_, index) => (
//                 <View
//                   key={index}
//                   style={{
//                     height: 8,
//                     borderRadius: 4,
//                     backgroundColor: index === currentSlide ? '#FF6B5A' : '#E5E7EB',
//                     width: index === currentSlide ? 32 : 8,
//                   }}
//                 />
//               ))}
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
//           onPress={handleNext}
//           style={{
//             backgroundColor: '#FF6B5A',
//             borderRadius: 12,
//             paddingVertical: 18,
//             alignItems: 'center',
//             shadowColor: '#FF6B5A',
//             shadowOffset: { width: 0, height: 4 },
//             shadowOpacity: 0.3,
//             shadowRadius: 8,
//             elevation: 5,
//           }}
//         >
//           <Text style={{
//             color: '#FFFFFF',
//             fontSize: 16,
//             fontWeight: '700',
//             letterSpacing: 1,
//           }}>
//             {currentSlide === onboardingSlides.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default OnboardingScreen;

// import { SafeAreaView, Text, View } from '@/components/ui/styled';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Dimensions, Image, TouchableOpacity } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// const onboardingSlides = [
//   {
//     id: 1,
//     titleKey: '',
//     descriptionKey: '',
//     image: require('../../assets/images/onboarding-family2.jpeg'),
//     fullImage: true,
//   },
//   {
//     id: 2,
//     titleKey: 'onboarding.slide2Title',
//     descriptionKey: 'onboarding.slide2Description',
//     image: require('../../assets/images/onboarding102.png'),
//     fullImage: false,
//   },
//   {
//     id: 3,
//     titleKey: 'onboarding.slide3Title',
//     descriptionKey: 'onboarding.slide3Description',
//     image: require('../../assets/images/onboarding92.png'),
//     fullImage: false,
//   },
// ];

// const BUTTON_AREA_HEIGHT = 56 + 16 + 8 + 16; // button height + paddingTop guess + dots gap + margin

// const OnboardingScreen = () => {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const { t } = useTranslation();
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const handleNext = () => {
//     if (currentSlide < onboardingSlides.length - 1) {
//       setCurrentSlide(currentSlide + 1);
//     } else {
//       router.replace('/(auth)/signin');
//     }
//   };

//   const slide = onboardingSlides[currentSlide];

//   // Total height already eaten by top inset + bottom bar (insets + content) needs to be
//   // subtracted from full image height, otherwise image pushes content under the notch
//   // or off the bottom edge.
//   const fullImageHeight =
//     SCREEN_HEIGHT - insets.top - insets.bottom - 20 - BUTTON_AREA_HEIGHT;

//   return (
//     // edges explicitly set so both notification bar (top) and home-indicator (bottom)
//     // areas are respected on every device, not just whatever the default applies.
//     <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
//       <View className="flex-1">
//         {/* Image */}
//         <Image
//           source={slide.image}
//           style={{
//             width: '100%',
//             height: slide.fullImage ? fullImageHeight : SCREEN_HEIGHT * 0.45,
//           }}
//           resizeMode="cover"
//         />

//         {/* Content — only when not fullImage */}
//         {!slide.fullImage && (
//           <View className="flex-1 px-6 justify-between py-6">
//             <View>
//               <Text className="text-4xl font-bold text-gray-900 mb-4 text-center">
//                 {t(slide.titleKey)}
//               </Text>
//               <Text className="text-base text-gray-600 text-center">
//                 {t(slide.descriptionKey)}
//               </Text>
//             </View>

//             {/* Dots */}
//             <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
//               {onboardingSlides.map((_, index) => (
//                 <View
//                   key={index}
//                   style={{
//                     height: 8,
//                     borderRadius: 4,
//                     backgroundColor: index === currentSlide ? '#FF6B5A' : '#E5E7EB',
//                     width: index === currentSlide ? 32 : 8,
//                   }}
//                 />
//               ))}
//             </View>
//           </View>
//         )}
//       </View>

//       {/* Bottom bar: dots (fullImage only) + button. SafeAreaView already reserves
//           insets.bottom space, so we only add the extra visual padding (20) on top
//           of it — NOT insets.bottom + 20, which double-counts the inset. */}
//       <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: 'white' }}>
//         {slide.fullImage && (
//           <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 16 }}>
//             {onboardingSlides.map((_, index) => (
//               <View
//                 key={index}
//                 style={{
//                   height: 8,
//                   borderRadius: 4,
//                   backgroundColor: index === currentSlide ? '#FF6B5A' : '#E5E7EB',
//                   width: index === currentSlide ? 32 : 8,
//                 }}
//               />
//             ))}
//           </View>
//         )}

//         <TouchableOpacity
//           onPress={handleNext}
//           style={{
//             backgroundColor: '#FF6B5A',
//             borderRadius: 12,
//             paddingVertical: 18,
//             alignItems: 'center',
//             shadowColor: '#FF6B5A',
//             shadowOffset: { width: 0, height: 4 },
//             shadowOpacity: 0.3,
//             shadowRadius: 8,
//             elevation: 5,
//           }}
//         >
//           <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
//             {currentSlide === onboardingSlides.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default OnboardingScreen;



import { SafeAreaView, Text, View } from '@/components/ui/styled';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity } from 'react-native';

const onboardingSlides = [
  {
    id: 1,
    titleKey: '',
    descriptionKey: '',
    image: require('../../assets/images/onboarding-family2.jpeg'),
    fullImage: true,
  },
  {
    id: 2,
    titleKey: 'onboarding.slide2Title',
    descriptionKey: 'onboarding.slide2Description',
    image: require('../../assets/images/onboarding92.png'),
    fullImage: false,
  },
  {
    id: 3,
    titleKey: 'onboarding.slide3Title',
    descriptionKey: 'onboarding.slide3Description',
    image: require('../../assets/images/onboarding102.png'),
    fullImage: false,
  },
];

const OnboardingScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace('/(auth)/signin');
    }
  };

  const slide = onboardingSlides[currentSlide];

  return (
    // edges explicitly set so both notification bar (top) and home-indicator (bottom)
    // areas are respected on every device, not just whatever the default applies.
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1">
        {/* Image — flex:1 instead of a hardcoded height. It now takes
            whatever space is actually left after SafeAreaView reserves the
            top/bottom insets and after the text block below claims its own
            natural height, so nothing gets cropped under the notch or
            squeezed at the bottom. */}
        <Image
          source={slide.image}
          style={{
            width: '100%',
            flex: 1,
          }}
          resizeMode="cover"
        />

        {/* Content — only when not fullImage */}
        {!slide.fullImage && (
          <View className="px-6 pt-6">
            <View>
              <Text className="text-4xl font-bold text-gray-900 mb-4 text-center">
                {t(slide.titleKey)}
              </Text>
              <Text className="text-base text-gray-600 text-center">
                {t(slide.descriptionKey)}
              </Text>
            </View>

            {/* Dots */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
              {onboardingSlides.map((_, index) => (
                <View
                  key={index}
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: index === currentSlide ? '#FF6B5A' : '#E5E7EB',
                    width: index === currentSlide ? 32 : 8,
                  }}
                />
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Bottom bar: dots (fullImage only) + button. SafeAreaView already reserves
          insets.bottom space, so we only add the extra visual padding (20) on top
          of it — NOT insets.bottom + 20, which double-counts the inset. */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: 'white' }}>
        {slide.fullImage && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            {onboardingSlides.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: index === currentSlide ? '#FF6B5A' : '#E5E7EB',
                  width: index === currentSlide ? 32 : 8,
                }}
              />
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: '#FF6B5A',
            borderRadius: 12,
            paddingVertical: 18,
            alignItems: 'center',
            shadowColor: '#FF6B5A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
            {currentSlide === onboardingSlides.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;