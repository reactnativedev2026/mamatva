import { SafeAreaView, ScrollView, Text, View } from '@/components/ui/styled';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity } from 'react-native';
import { useUser } from '../../context/UserContext';
import { changeAppLanguage, isSupportedLanguage } from '../../i18n';
import { updateUserLanguage } from '../../utils/api';

const languages = [
  { id: 'en', name: 'English', nativeName: 'English' },
  { id: 'hi', name: 'हिन्दी', nativeName: 'Hindi' },
  { id: 'bn', name: 'বাংলা', nativeName: 'Bangla' },
  { id: 'te', name: 'తెలుగు', nativeName: 'Telugu' },
  { id: 'mr', name: 'मराठी', nativeName: 'Marathi' },
];

const LanguageScreen = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { token, setAuthStep } = useUser();
  const [selectedLanguage, setSelectedLanguage] = useState(
    isSupportedLanguage(i18n.language) ? i18n.language : ''
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLanguageSelect = async (languageId: string) => {
    setSelectedLanguage(languageId);
    await changeAppLanguage(languageId);
  };

  const handleNext = async () => {
    if (!selectedLanguage || loading) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      await updateUserLanguage(token, selectedLanguage);
      await setAuthStep('stage');
      router.push('/(auth)/stage');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('language.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6"
      >
        <View style={{ paddingTop: 20 }} className="flex-1 justify-between pb-8">
          {/* Header */}
          <View>
            <View className="items-center mb-12">
              <View
                style={{
                  shadowColor: '#FF6B5A',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.4,
                  shadowRadius: 20,
                  elevation: 12,
                  backgroundColor: 'white',
                  borderRadius: 60,
                  padding: 5,
                }}
              >
                <Image
                  source={require('../../assets/images/mamvatamlogo3.jpeg')}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                  }}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text className="text-3xl font-bold text-gray-900 mb-3">
              {t('language.title')}
            </Text>

            <Text className="text-gray-600 text-base mb-10">
              {t('language.subtitle')}
            </Text>

            {errorMessage ? (
              <Text className="text-red-500 text-sm mb-4">{errorMessage}</Text>
            ) : null}

            {/* Language Options */}
            <View className="gap-3">
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.id}
                  style={{
                    backgroundColor: selectedLanguage === lang.id ? '#FFE5E0' : '#F5F5F5',
                    borderWidth: 2,
                    borderColor: selectedLanguage === lang.id ? '#FF6B5A' : '#E5E7EB',
                    borderRadius: 16,
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => handleLanguageSelect(lang.id)}
                >
                  <View className="flex-1">
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: 4,
                    }}>
                      {lang.name}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: '#6B7280',
                    }}>
                      {lang.nativeName}
                    </Text>
                  </View>
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: selectedLanguage === lang.id ? '#FF6B5A' : '#D1D5DB',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {selectedLanguage === lang.id && (
                      <View style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: '#FF6B5A',
                      }} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Action Button - Fixed Bottom */}
      <View style={{
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 20,
        backgroundColor: 'white'
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: selectedLanguage ? '#FF6B5A' : '#D1D5DB',
            paddingVertical: 18,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: selectedLanguage ? '#FF6B5A' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: selectedLanguage ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={handleNext}
          disabled={!selectedLanguage}
        >
          <Text style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 1,
          }}>
            {loading ? t('language.saving') : t('language.next')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LanguageScreen;