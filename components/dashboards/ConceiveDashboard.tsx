import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { SharedDashboardItems } from './SharedDashboardItems';
import { MaterialIcons } from '@expo/vector-icons';

export const ConceiveDashboard = () => {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    return (
        <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
            {/* Header Background */}
            <View style={{ backgroundColor: '#F8FAFC', paddingBottom: 24, paddingHorizontal: 24, paddingTop: insets.top + 20, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>

                {/* User Info Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2E8F0', marginRight: 12 }} />
                        <View>
                            <Text style={{ fontSize: 12, color: '#64748B' }}>{t('dashboard.conceiveStrawberry')}</Text>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>Miss sarah</Text>
                        </View>
                    </View>
                    <MaterialIcons name="notifications-none" size={24} color="#EF4444" />
                </View>


                {/* Main Hero Circle - Pregnancy Chance with Premium Image */}
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <View style={{
                        width: 170, height: 170, borderRadius: 85,
                        backgroundColor: '#FFFFFF',
                        borderWidth: 6, borderColor: '#FDA4AF',
                        justifyContent: 'center', alignItems: 'center',
                        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
                        overflow: 'hidden', position: 'relative'
                    }}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=600' }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                            transition={500}
                            cachePolicy="disk"
                        />
                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.85)', paddingVertical: 8, alignItems: 'center' }}>
                            <Text style={{ fontSize: 10, color: '#64748B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('dashboard.conceiveChance')}</Text>
                            <Text style={{ fontSize: 18, fontWeight: '900', color: '#EF4444' }}>{t('dashboard.conceiveLow')}</Text>
                        </View>
                    </View>
                </View>

                <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#1E293B', marginBottom: 24 }}>
                    {t('dashboard.conceiveBaby')}
                </Text>

                {/* Tracking Cards */}
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                                <MaterialIcons name="event" size={20} color="#EF4444" />
                            </View>
                            <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '700' }}>{t('dashboard.conceiveNextPeriod')}</Text>
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 4 }}>13 Feb</Text>
                        <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>{t('dashboard.conceiveInDays')}</Text>
                    </View>

                    <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                                <MaterialIcons name="star-outline" size={20} color="#F59E0B" />
                            </View>
                            <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '700' }}>{t('dashboard.conceiveOvulation')}</Text>
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 4 }}>13 Feb</Text>
                        <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>{t('dashboard.conceiveInDays')}</Text>
                    </View>
                </View>

                <TouchableOpacity style={{ marginTop: 24, alignSelf: 'center' }}>
                    <Text style={{ color: '#EF4444', fontSize: 14, fontWeight: '700' }}>{t('dashboard.checkDailyUtility')}</Text>
                </TouchableOpacity>

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#FF6B5A', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: '#FF6B5A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}>
                        <MaterialIcons name="calendar-today" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>{t('dashboard.conceiveCalendar')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#FFE4E6', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons name="check" size={20} color="#FF6B5A" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#FF6B5A', fontWeight: '700', fontSize: 16 }}>{t('dashboard.conceiveEndPeriod')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <SharedDashboardItems />
        </ScrollView>
    );
};

