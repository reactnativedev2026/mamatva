import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../../context/UserContext';
import { SharedDashboardItems } from './SharedDashboardItems';

export const MotherDashboard = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { t } = useTranslation();
    const { setSession, setToken, setPhone, setAuthStep, setStage } = useUser();

    const handleLogout = async () => {
        await setSession(null);
        await setToken('');
        await setPhone('');
        await setAuthStep('signin');
        await setStage('');
        router.replace('/(auth)/signin');
    };

    return (
        <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
            {/* Header Background */}
            <View style={{ backgroundColor: '#F0FDF4', paddingBottom: 24, paddingHorizontal: 24, paddingTop: insets.top + 20, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>

                {/* User Info Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2E8F0', marginRight: 12 }} />
                        <View>
                            <Text style={{ fontSize: 12, color: '#059669' }}>{t('dashboard.healthcareProvider')}</Text>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>Miss sarah</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="notifications-none" size={24} color="#059669" />
                    </View>
                </View>


                {/* Main Hero Circle - Baby */}
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <View style={{
                        width: 164, height: 164, borderRadius: 82,
                        backgroundColor: '#FFFFFF',
                        borderWidth: 6, borderColor: '#A7F3D0',
                        justifyContent: 'center', alignItems: 'center',
                        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600' }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                            transition={500}
                            cachePolicy="disk"
                        />
                        <View style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: '#FFFFFF', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
                            <MaterialIcons name="edit" size={16} color="#64748B" />
                        </View>
                    </View>
                </View>

                <Text style={{ fontSize: 24, fontWeight: '900', textAlign: 'center', color: '#1E293B', marginBottom: 4 }}>
                    {t('dashboard.motherBaby')}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: '800', textAlign: 'center', color: '#059669', marginBottom: 4 }}>
                    {t('dashboard.motherWeeksOld')}
                </Text>
                <Text style={{ fontSize: 12, textAlign: 'center', color: '#94A3B8', fontWeight: '700', marginBottom: 24 }}>
                    Mar 31, 2026 - Apr 6, 2026
                </Text>

                {/* Stats Cards */}
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
                    <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, alignItems: 'center', borderWidth: 1, borderColor: '#DCFCE7' }}>
                        <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '900', marginBottom: 8, letterSpacing: 0.5 }}>{t('dashboard.motherIdealHeight')}</Text>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B' }}>46.3 - 53.4 cm</Text>
                    </View>

                    <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, alignItems: 'center', borderWidth: 1, borderColor: '#DCFCE7' }}>
                        <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '900', marginBottom: 8, letterSpacing: 0.5 }}>{t('dashboard.motherIdealWeight')}</Text>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B' }}>2.5 - 4.3 kg</Text>
                    </View>
                </View>

                {/* Baby says bubble */}
                <View style={{ backgroundColor: '#E0F2FE', padding: 20, borderRadius: 24, marginBottom: 24, borderTopLeftRadius: 0 }}>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: '#0369A1', marginBottom: 8 }}>{t('dashboard.motherBabySays')}</Text>
                    <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' }}>{t('dashboard.motherBabyMessage')}</Text>
                </View>

                <TouchableOpacity style={{ alignSelf: 'center', marginTop: 8 }}>
                    <Text style={{ color: '#EF4444', fontSize: 14, fontWeight: '800' }}>{t('dashboard.checkDailyUtility')}</Text>
                </TouchableOpacity>
            </View>

            <SharedDashboardItems />

            <View style={{ padding: 24, alignItems: 'center', paddingBottom: insets.bottom + 60 }}>
                <TouchableOpacity onPress={handleLogout} style={{ width: '100%', backgroundColor: '#FEE2E2', paddingVertical: 16, borderRadius: 16, alignItems: 'center' }}>
                    <Text style={{ color: '#B91C1C', fontWeight: '700', fontSize: 16 }}>{t('dashboard.logout')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};
