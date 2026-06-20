import { SafeAreaView, ScrollView, Text, View } from '@/components/ui/styled';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { useUser } from '../../context/UserContext';
import { updateUserStage } from '../../utils/api';

type UserStage = 'Conceive' | 'Pregnant' | 'Mother' | 'Explore' | '';
type StageOption = Exclude<UserStage, ''>;

const stageTranslationKeys: Record<StageOption, string> = {
  Pregnant: 'stage.pregnant',
  Mother: 'stage.mother',
  Conceive: 'stage.conceive',
  Explore: 'stage.explore',
};

const StageScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { setStage, token, setAuthStep } = useUser();
  const [selectedStage, setSelectedStage] = useState<UserStage>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const stages: { id: StageOption; emoji: string; color: string }[] = [
    { id: 'Pregnant', emoji: '🎀', color: '#FFE5E0' },
    { id: 'Mother',   emoji: '👩‍❤️‍👶', color: '#C6F6D5' },
    { id: 'Conceive', emoji: '👫', color: '#E6FFFE' },
    { id: 'Explore',  emoji: '🌸', color: '#EDE9FE' },
  ];

  const handleContinue = async () => {
    if (!selectedStage || loading) return;

    if (selectedStage === 'Explore') {
      await setStage(selectedStage);
      await setAuthStep('completed');
      router.push('/(tabs)');
      return;
    }

    const activeStage =
      selectedStage === 'Conceive'
        ? 'CONCEIVE'
        : selectedStage === 'Mother'
          ? 'MOTHERHOOD'
          : 'PREGNANCY';

    try {
      setLoading(true);
      setErrorMessage('');
      await setStage(selectedStage);
      await updateUserStage(token, activeStage);
      await setAuthStep('completed');
      router.push('/(tabs)');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('stage.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6"
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ paddingTop: 20 }} className="flex-1 pb-4">
          {/* Wavy top */}
          <View style={{
            height: 60,
            backgroundColor: '#FFE5E0',
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            marginHorizontal: -24,
            marginTop: -20,
            marginBottom: 20,
          }} />

          <Text className="text-3xl font-bold text-gray-900 mb-3">
            {t('stage.title')}
          </Text>
          <Text className="text-gray-600 text-base mb-12">
            {t('stage.subtitle')}
          </Text>

          {errorMessage ? (
            <Text className="text-red-500 text-sm mb-4">{errorMessage}</Text>
          ) : null}

          {/* Stage Grid — 2x2 */}
          <View style={{ flexDirection: 'column', gap: 12 }}>
            {/* Row 1: Pregnant + Mother */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {stages.slice(0, 2).map((stageItem) => (
                <TouchableOpacity
                  key={stageItem.id}
                  style={{
                    flex: 1,
                    backgroundColor: selectedStage === stageItem.id ? '#FFE5E0' : stageItem.color,
                    borderWidth: selectedStage === stageItem.id ? 2 : 1,
                    borderColor: selectedStage === stageItem.id ? '#FF6B5A' : '#E5E7EB',
                    borderRadius: 16,
                    paddingVertical: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => setSelectedStage(stageItem.id)}
                >
                  <Text style={{ fontSize: 40, marginBottom: 12 }}>{stageItem.emoji}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                    {t(stageTranslationKeys[stageItem.id])}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 2: Conceive + Explore */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {stages.slice(2, 4).map((stageItem) => (
                <TouchableOpacity
                  key={stageItem.id}
                  style={{
                    flex: 1,
                    backgroundColor: selectedStage === stageItem.id ? '#FFE5E0' : stageItem.color,
                    borderWidth: selectedStage === stageItem.id ? 2 : 1,
                    borderColor: selectedStage === stageItem.id ? '#FF6B5A' : '#E5E7EB',
                    borderRadius: 16,
                    paddingVertical: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => setSelectedStage(stageItem.id)}
                >
                  <Text style={{ fontSize: 40, marginBottom: 12 }}>{stageItem.emoji}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                    {t(stageTranslationKeys[stageItem.id])}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Button - Fixed Bottom */}
      <View style={{
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 20,
        backgroundColor: 'white',
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: selectedStage ? '#FF6B5A' : '#D1D5DB',
            paddingVertical: 18,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: selectedStage ? '#FF6B5A' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: selectedStage ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={handleContinue}
          disabled={!selectedStage}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
            {loading ? t('stage.saving') : t('stage.continue')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StageScreen;