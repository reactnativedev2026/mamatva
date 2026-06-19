import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, SafeAreaView } from '@/components/ui/styled';

const NotificationScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  const handleEnableNotifications = () => {
    router.replace('/(tabs)');
  };

  const handleMaybeLater = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6"
      >
        <View style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }} className="flex-1 justify-between">
          <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
            <TouchableOpacity onPress={handleMaybeLater}>
              <MaterialIcons name="close" size={28} color="#111827" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 items-center justify-center">
            <View style={{
              width: 140,
              height: 200,
              borderWidth: 2,
              borderColor: '#111827',
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}>
              <View style={{
                width: 100,
                height: 150,
                backgroundColor: '#F3F4F6',
                borderRadius: 20,
              }} />
            </View>

            <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
              {t('notification.title')}
            </Text>
            <Text className="text-gray-600 text-base text-center mb-12">
              {t('notification.subtitle')}
            </Text>
          </View>

        </View>
      </ScrollView>

      <View style={{
        paddingHorizontal: 24,
        paddingBottom: insets.bottom + 20,
        backgroundColor: 'white',
        gap: 12
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#FF6B5A',
            paddingVertical: 18,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: '#FF6B5A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={handleEnableNotifications}
        >
          <Text style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 1,
          }}>
            {t('notification.enable')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}
          onPress={handleMaybeLater}
        >
          <Text style={{
            color: '#6B7280',
            fontSize: 16,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            {t('notification.maybeLater')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
