import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, SafeAreaView } from '@/components/ui/styled';

const BabyGenderScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedGender, setSelectedGender] = useState('');

  const genders = [
    { id: 'girl', labelKey: 'babyGender.girl', emoji: '👧', color: '#FFE5E0' },
    { id: 'boy', labelKey: 'babyGender.boy', emoji: '👦', color: '#C6F6D5' },
  ];

  const handleContinue = () => {
    if (selectedGender) {
      router.push('/(auth)/notification');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6"
      >
        <View style={{ paddingTop: insets.top + 20 }} className="flex-1 justify-between pb-8">
          <View>
            <View style={{
              height: 60,
              backgroundColor: '#FFE5E0',
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              marginHorizontal: -24,
              marginTop: -20,
              marginBottom: 20,
            }} />

            <Text className="text-3xl font-bold text-gray-900 mb-3 text-center">
              {t('babyGender.title')}
            </Text>

            <View style={{ flexDirection: 'column', gap: 16, marginTop: 40 }}>
              {genders.map((gender) => (
                <TouchableOpacity
                  key={gender.id}
                  style={{
                    backgroundColor: selectedGender === gender.id ? '#FFE5E0' : gender.color,
                    borderWidth: selectedGender === gender.id ? 2 : 1,
                    borderColor: selectedGender === gender.id ? '#FF6B5A' : '#E5E7EB',
                    borderRadius: 16,
                    paddingVertical: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => setSelectedGender(gender.id)}
                >
                  <Text style={{ fontSize: 50, marginBottom: 16 }}>
                    {gender.emoji}
                  </Text>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#111827',
                  }}>
                    {t(gender.labelKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>

      <View style={{
        paddingHorizontal: 24,
        paddingBottom: insets.bottom + 20,
        backgroundColor: 'white'
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: selectedGender ? '#FF6B5A' : '#D1D5DB',
            paddingVertical: 18,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: selectedGender ? '#FF6B5A' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: selectedGender ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={handleContinue}
          disabled={!selectedGender}
        >
          <Text style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 1,
          }}>
            {t('babyGender.continue')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BabyGenderScreen;
