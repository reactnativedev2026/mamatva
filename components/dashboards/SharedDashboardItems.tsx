import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// import FALLBACK_LOGO from '../../assets/images/mamvatamlogo.png';
import { useUser } from '../../context/UserContext';
import { getDashboardFallbackContent } from '../../i18n/dashboardFallbacks';
import {
    getCommunityPosts,
    getCourses,
    getDadiNaniNuskhe,
    getDailyTips,
    getDietCharts,
    getExpertPosts,
    getExperts,
    normalizeApiList,
} from '../../utils/api';

const FALLBACK_LOGO = require('../../assets/images/mamvatamlogo.png');

const { width } = Dimensions.get('window');

type AnyRecord = Record<string, unknown>;

const readText = (value: unknown) => (typeof value === 'string' ? value : '');

const firstText = (item: unknown, keys: string[], fallback = '') => {
    if (!item || typeof item !== 'object') {
        return fallback;
    }

    const record = item as AnyRecord;
    for (const key of keys) {
        const candidate = readText(record[key]);
        if (candidate.trim()) {
            return candidate;
        }
    }

    return fallback;
};

const firstImage = (item: unknown, fallback: string) => {
    if (!item || typeof item !== 'object') {
        return fallback;
    }

    const record = item as AnyRecord;
    const candidate = readText(record.image) || readText(record.thumbnail) || readText(record.url) || readText(record.img);
    return candidate || fallback;
};

const toPrice = (item: unknown, fallback: string) => {
    if (!item || typeof item !== 'object') {
        return fallback;
    }

    const record = item as AnyRecord;
    const candidate = readText(record.price) || readText(record.amount) || readText(record.cost);
    return candidate ? candidate : fallback;
};

export const SharedDashboardItems = () => {
    const { token } = useUser();
    const { t, i18n } = useTranslation();
    const fallbackContent = useMemo(() => getDashboardFallbackContent(t), [t, i18n.language]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [tips, setTips] = useState(fallbackContent.tips);
    const [courses, setCourses] = useState(fallbackContent.courses);
    const [tools, setTools] = useState(fallbackContent.tools);
    const [experts, setExperts] = useState(fallbackContent.experts);
    const [expertAdvice, setExpertAdvice] = useState(fallbackContent.expertAdvice);
    const [communityPosts, setCommunityPosts] = useState(fallbackContent.communityPosts);

    useEffect(() => {
        setTips(fallbackContent.tips);
        setCourses(fallbackContent.courses);
        setTools(fallbackContent.tools);
        setExperts(fallbackContent.experts);
        setExpertAdvice(fallbackContent.expertAdvice);
        setCommunityPosts(fallbackContent.communityPosts);
    }, [fallbackContent]);

    useEffect(() => {
        let cancelled = false;

        const loadContent = async () => {
            setLoading(true);
            setErrorMessage('');

            const results = await Promise.allSettled([
                getDailyTips(token),
                getCourses(token),
                getDietCharts(token),
                getDadiNaniNuskhe(token),
                getExperts(token),
                getExpertPosts(token),
                getCommunityPosts(token),
            ]);

            if (cancelled) {
                return;
            }

            const [tipsResult, coursesResult, dietChartsResult, dadiNaniResult, expertsResult, expertPostsResult, communityPostsResult] = results;

            const tipItems = normalizeApiList<AnyRecord>(tipsResult.status === 'fulfilled' ? tipsResult.value : undefined);
            const courseItems = normalizeApiList<AnyRecord>(coursesResult.status === 'fulfilled' ? coursesResult.value : undefined);
            const dietItems = normalizeApiList<AnyRecord>(dietChartsResult.status === 'fulfilled' ? dietChartsResult.value : undefined);
            const dadiItems = normalizeApiList<AnyRecord>(dadiNaniResult.status === 'fulfilled' ? dadiNaniResult.value : undefined);
            const expertItems = normalizeApiList<AnyRecord>(expertsResult.status === 'fulfilled' ? expertsResult.value : undefined);
            const expertPostItems = normalizeApiList<AnyRecord>(expertPostsResult.status === 'fulfilled' ? expertPostsResult.value : undefined);
            const communityItems = normalizeApiList<AnyRecord>(communityPostsResult.status === 'fulfilled' ? communityPostsResult.value : undefined);

            if (tipItems.length) {
                setTips([
                    {
                        title: firstText(tipItems[0], ['title', 'name', 'label'], t('dashboard.todayTips')),
                        description: firstText(tipItems[0], ['description', 'content', 'message', 'subtitle'], fallbackContent.tips[0].description),
                    },
                    {
                        title: firstText(tipItems[1] || tipItems[0], ['title', 'name', 'label'], t('dashboard.yesterdayTips')),
                        description: firstText(tipItems[1] || tipItems[0], ['description', 'content', 'message', 'subtitle'], fallbackContent.tips[1].description),
                    },
                ]);
            }

            if (courseItems.length) {
                setCourses(courseItems.slice(0, 4).map((course, index) => ({
                    title: firstText(course, ['title', 'name', 'label'], fallbackContent.courses[index]?.title || t('dashboard.courseNutrition')),
                    price: toPrice(course, fallbackContent.courses[index]?.price || '$ 499'),
                    img: firstImage(course, fallbackContent.courses[index]?.img || fallbackContent.courses[0].img),
                })));
            }

            if (dietItems.length || dadiItems.length) {
                const combinedTools = [...dietItems, ...dadiItems].slice(0, 9);
                setTools(
                    combinedTools.map((tool, index) => ({
                        title: firstText(tool, ['title', 'name', 'label', 'subtitle'], fallbackContent.tools[index]?.title || t('dashboard.helpfulTools')),
                        img: firstImage(tool, fallbackContent.tools[index]?.img || fallbackContent.tools[0].img),
                    }))
                );
            }

            if (expertItems.length) {
                setExperts(
                    expertItems.slice(0, 10).map((expert, index) => ({
                        name: firstText(expert, ['name', 'title', 'profession', 'label'], fallbackContent.experts[index]?.name || t('dashboard.expertDoctor')),
                        img: firstImage(expert, fallbackContent.experts[index]?.img || fallbackContent.experts[0].img),
                    }))
                );
            }

            if (expertPostItems.length) {
                setExpertAdvice(
                    expertPostItems.slice(0, 3).map((post, index) => ({
                        title: firstText(post, ['title', 'name', 'label'], fallbackContent.expertAdvice[index]?.title || t('dashboard.expertAdvice')),
                        date: firstText(post, ['date', 'created_at', 'createdAt'], fallbackContent.expertAdvice[index]?.date || 'MAR 2026'),
                        author: firstText(post, ['author', 'name', 'expertName'], fallbackContent.expertAdvice[index]?.author || 'expert one'),
                        img: firstImage(post, fallbackContent.expertAdvice[index]?.img || fallbackContent.expertAdvice[0].img),
                    }))
                );
            }

            if (communityItems.length) {
                setCommunityPosts(
                    communityItems.slice(0, 3).map((post, index) => ({
                        title: firstText(post, ['title', 'name', 'label'], fallbackContent.communityPosts[index]?.title || t('dashboard.communitySpot')),
                        content: firstText(post, ['content', 'description', 'message', 'subtitle'], fallbackContent.communityPosts[0].content),
                        mediaType: firstText(post, ['mediaType', 'type'], 'text'),
                    }))
                );
            }

            setLoading(false);
        };

        void loadContent().catch((error) => {
            if (!cancelled) {
                setErrorMessage(error instanceof Error ? error.message : t('dashboard.contentLoadError'));
                setLoading(false);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [token, fallbackContent, t]);

    const todayTip = tips[0];
    const yesterdayTip = tips[1];

    const toolsToRender = useMemo(() => tools.length ? tools : fallbackContent.tools, [tools, fallbackContent.tools]);

    return (
        <View style={{ marginTop: 24, marginBottom: 40, width: '100%', paddingHorizontal: 24 }}>
            {loading ? (
                <View style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <ActivityIndicator color="#FF6B5A" />
                    <Text style={{ color: '#64748B', fontSize: 14 }}>{t('dashboard.loadingContent')}</Text>
                </View>
            ) : null}

            {errorMessage ? (
                <View style={{ backgroundColor: '#FEF2F2', borderRadius: 16, padding: 14, marginBottom: 20 }}>
                    <Text style={{ color: '#B91C1C', fontWeight: '700', marginBottom: 4 }}>{t('dashboard.contentLoadErrorTitle')}</Text>
                    <Text style={{ color: '#991B1B', fontSize: 13 }}>{errorMessage}</Text>
                </View>
            ) : null}

            {/* Today Tips */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 20, marginRight: 12 }}>💡</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#B45309', marginBottom: 4 }}>{todayTip?.title || t('dashboard.todayTips')}</Text>
                        <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 20 }}>{todayTip?.description || fallbackContent.tips[0].description}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity><Text style={{ color: '#FF6B5A', fontSize: 14, fontWeight: '600' }}>{t('dashboard.moreTips')}</Text></TouchableOpacity>
                            <TouchableOpacity><Text style={{ color: '#6B7280', fontSize: 14 }}>{t('dashboard.share')}</Text></TouchableOpacity>
                        </View>
                    </View>
                    <Image
                        source={FALLBACK_LOGO}
                        style={{ width: 40, height: 40, position: 'absolute', bottom: 10, right: 10, opacity: 0.15 }}
                        contentFit="contain"
                    />
                </View>
            </View>

            {/* Holistic Courses */}
            <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827' }}>{t('dashboard.holisticCourses')}</Text>
                    <TouchableOpacity><Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '600' }}>{t('dashboard.seeMore')}</Text></TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                    {courses.map((course, index) => (
                        <View key={index} style={{ width: (width - 48 - 16) / 2, backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
                            <View style={{ height: 110 }}>
                                <Image
                                    source={{ uri: course.img }}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="cover"
                                    transition={500}
                                    cachePolicy="disk"
                                />
                                <View style={{ position: 'absolute', top: 5, right: 5, backgroundColor: '#FBBF24', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 }}>
                                    <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '800' }}>{course.price}</Text>
                                </View>
                            </View>
                            <View style={{ padding: 12 }}>
                                <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 2 }}>{course.title}</Text>
                                <Text style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>{t('dashboard.essentialGuides')}</Text>
                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#EF4444' }}>{t('dashboard.discount')}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Helpful Tools */}
            <View style={{ marginBottom: 40 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>{t('dashboard.helpfulTools')}</Text>
                    <TouchableOpacity><Text style={{ fontSize: 13, color: '#FF6B5A', fontWeight: '700' }}>{t('dashboard.seeMore')}</Text></TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
                    {toolsToRender.map((tool, index) => (
                        <TouchableOpacity key={index} style={{
                            width: (width - 48 - 24) / 3,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 20,
                            padding: 12,
                            alignItems: 'center',
                            marginBottom: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.05,
                            shadowRadius: 8,
                            elevation: 3,
                            borderWidth: 1,
                            borderColor: '#F8FAFC'
                        }}>
                            <View style={{
                                width: 56,
                                height: 56,
                                borderRadius: 28,
                                backgroundColor: '#F1F5F9',
                                overflow: 'hidden',
                                marginBottom: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#E2E8F0'
                            }}>
                                <Image
                                    source={{ uri: tool.img }}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="cover"
                                    transition={500}
                                    cachePolicy="disk"
                                />
                                <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.02)' }} />
                            </View>
                            <Text style={{
                                fontSize: 10,
                                fontWeight: '700',
                                color: '#334155',
                                textAlign: 'center',
                                lineHeight: 12
                            }}>
                                {tool.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Expert Advice For You */}
            <View style={{ marginBottom: 40 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>{t('dashboard.expertAdvice')}</Text>
                    <TouchableOpacity><Text style={{ fontSize: 13, color: '#FF6B5A', fontWeight: '700' }}>{t('dashboard.seeMore')}</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                    {expertAdvice.map((advice, index) => (
                        <View key={index} style={{ width: 220, backgroundColor: '#FFFFFF', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 5 }}>
                            <View style={{ height: 120 }}>
                                <Image
                                    source={{ uri: advice.img }}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="cover"
                                    transition={600}
                                    cachePolicy="disk"
                                />
                            </View>
                            <View style={{ padding: 15 }}>
                                <Text style={{ fontSize: 10, fontWeight: '600', color: '#9CA3AF', marginBottom: 4 }}>{advice.date}</Text>
                                <Text numberOfLines={2} style={{ fontSize: 13, fontWeight: '700', color: '#1F2937', marginBottom: 12, lineHeight: 18 }}>
                                    {advice.title}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#E5E7EB', marginRight: 8 }} />
                                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#4B5563' }}>{advice.author}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Expert Post Category */}
            <View style={{ marginBottom: 40 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>{t('dashboard.expertPostCategory')}</Text>
                    <TouchableOpacity><Text style={{ fontSize: 13, color: '#FF6B5A', fontWeight: '700' }}>{t('dashboard.seeMore')}</Text></TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
                    {experts.map((expert, index) => (
                        <TouchableOpacity key={index} style={{
                            width: (width - 48 - 24) / 3,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 16,
                            overflow: 'hidden',
                            marginBottom: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.05,
                            shadowRadius: 10,
                            elevation: 4,
                            borderWidth: 1,
                            borderColor: '#F1F5F9'
                        }}>
                            <View style={{ height: 80, width: '100%' }}>
                                <Image
                                    source={{ uri: expert.img }}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="cover"
                                    transition={500}
                                    cachePolicy="disk"
                                />
                            </View>
                            <View style={{ padding: 8, height: 40, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 9, fontWeight: '800', color: '#334155', textAlign: 'center', lineHeight: 11 }}>
                                    {expert.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Community Spot */}
            <View style={{ marginBottom: 40 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>{t('dashboard.communitySpot')}</Text>
                    <TouchableOpacity><Text style={{ fontSize: 13, color: '#FF6B5A', fontWeight: '700' }}>{t('dashboard.seeMore')}</Text></TouchableOpacity>
                </View>

                <View style={{ gap: 12 }}>
                    {communityPosts.map((post, index) => (
                        <View key={index} style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#111827', marginBottom: 6 }}>{post.title}</Text>
                            <Text style={{ fontSize: 13, color: '#4B5563', lineHeight: 18 }}>{post.content}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Yesterday Tips */}
            <View style={{ backgroundColor: '#FFE4E6', borderRadius: 16, padding: 16, marginBottom: 40 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 20, marginRight: 12 }}>💡</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 4 }}>{yesterdayTip?.title || t('dashboard.yesterdayTips')}</Text>
                        <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 20 }}>{yesterdayTip?.description || fallbackContent.tips[1].description}</Text>
                        <TouchableOpacity style={{ marginTop: 8 }}><Text style={{ color: '#FF6B5A', fontSize: 14, fontWeight: '600' }}>{t('dashboard.moreTips')}</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};
