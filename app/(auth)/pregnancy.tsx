import { SafeAreaView, ScrollView, Text, View } from '@/components/ui/styled';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Switch, TextInput, TouchableOpacity } from 'react-native';
import { useUser } from '../../context/UserContext';
import { updateConceiveProfile, updateMotherhoodProfile, updatePregnancyProfile } from '../../utils/api';

const PregnancyScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { stage, token } = useUser() as { stage: 'Conceive' | 'Pregnant' | 'Mother' | 'Explore' | ''; token: string };
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateField, setActiveDateField] = useState<'lastPeriodDate' | 'pregnancyFirstDate' | 'babyDob'>('pregnancyFirstDate');

  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [pregnancyFirstDate, setPregnancyFirstDate] = useState('');
  const [babyDob, setBabyDob] = useState('');

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const [motherHeight, setMotherHeight] = useState('');
  const [motherWeight, setMotherWeight] = useState('');
  const [babyHeight, setBabyHeight] = useState('');
  const [babyWeight, setBabyWeight] = useState('');

  const [bloodGroup, setBloodGroup] = useState('');
  const [isDiabetic, setIsDiabetic] = useState(false);
  const [bloodPressure, setBloodPressure] = useState('');
  const [showBloodGroupPicker, setShowBloodGroupPicker] = useState(false);

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const pressureOptions = [
    { value: 'Low', labelKey: 'profile.pressureLow' },
    { value: 'Normal', labelKey: 'profile.pressureNormal' },
    { value: 'High', labelKey: 'profile.pressureHigh' },
  ] as const;
  const isWeb = Platform.OS === 'web';

  // ── Explore stage ──
  if (stage === 'Explore') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
          <View style={{ paddingTop: 20 }} className="flex-1 pb-4">
            <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t('profile.exploreTitle')}
            </Text>
            <View style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 16,
              padding: 24,
              backgroundColor: '#FFF7F6',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🌸</Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
                {t('profile.exploreHeading')}
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 }}>
                {t('profile.exploreSubtitle')}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: 'white' }}>
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
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
              {t('profile.exploreButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // Pregnancy ke liye allowed date range: aaj se aaj+9 months tak
  const getMinPregnancyDate = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getMaxPregnancyDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 9);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const openDatePicker = (field: 'lastPeriodDate' | 'pregnancyFirstDate' | 'babyDob') => {
    setActiveDateField(field);
    setShowDatePicker(true);
  };

  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    if (!selectedDate) {
      setShowDatePicker(false);
      return;
    }

    // Pregnancy date ko allowed range ke andar clamp karo (safety net)
    if (stage === 'Pregnant' && activeDateField === 'pregnancyFirstDate') {
      const min = getMinPregnancyDate();
      const max = getMaxPregnancyDate();
      if (selectedDate < min) selectedDate = min;
      if (selectedDate > max) selectedDate = max;
    }

    const formattedDate = formatDate(selectedDate);
    if (activeDateField === 'lastPeriodDate') {
      setLastPeriodDate(formattedDate);
    } else if (activeDateField === 'pregnancyFirstDate') {
      setPregnancyFirstDate(formattedDate);
    } else {
      setBabyDob(formattedDate);
    }
    setShowDatePicker(Platform.OS === 'ios');
  };

  const handleContinue = async () => {
    if (loading) return;

    const requiredDate =
      stage === 'Conceive' ? lastPeriodDate : stage === 'Mother' ? babyDob : pregnancyFirstDate;

    if (!requiredDate) {
      setErrorMessage(
        stage === 'Conceive'
          ? t('profile.lastPeriodRequired')
          : stage === 'Mother'
            ? t('profile.babyDobRequired')
            : t('profile.pregnancyDateRequired')
      );
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      if (stage === 'Conceive') {
        await updateConceiveProfile(token, {
          lastPeriodDate,
          height: height ? Number(height) : undefined,
          weight: weight ? Number(weight) : undefined,
          bloodGroup: bloodGroup || undefined,
          diabetic: isDiabetic,
          bloodPressure: bloodPressure || undefined,
        });
      } else if (stage === 'Mother') {
        await updateMotherhoodProfile(token, {
          babyDob,
          motherHeight: motherHeight ? Number(motherHeight) : undefined,
          motherWeight: motherWeight ? Number(motherWeight) : undefined,
          babyHeight: babyHeight ? Number(babyHeight) : undefined,
          babyWeight: babyWeight ? Number(babyWeight) : undefined,
          bloodGroup: bloodGroup || undefined,
          diabetic: isDiabetic,
          bloodPressure: bloodPressure || undefined,
        });
      } else {
        await updatePregnancyProfile(token, {
          pregnancyDate: pregnancyFirstDate,
          height: height ? Number(height) : undefined,
          weight: weight ? Number(weight) : undefined,
          bloodGroup: bloodGroup || undefined,
          diabetic: isDiabetic,
          bloodPressure: bloodPressure || undefined,
        });
      }

      router.push('/(tabs)');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('profile.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (stage === 'Conceive') return t('profile.conceiveTitle');
    if (stage === 'Mother') return t('profile.motherTitle');
    return t('profile.pregnancyTitle');
  };

  const renderDateField = () => {
    let label = 'Expected Delivery Date';
    let value = pregnancyFirstDate;

    if (stage === 'Conceive') {
      label = t('profile.lastPeriodDate');
      value = lastPeriodDate;
    } else if (stage === 'Mother') {
      label = t('profile.babyDob');
      value = babyDob;
    }

    const isPregnancyDateField = stage === 'Pregnant';

    return (
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold mb-3 text-base">{label}</Text>
        {isWeb ? (
          <input
            type="date"
            value={value}
            min={isPregnancyDateField ? formatDate(getMinPregnancyDate()) : undefined}
            max={isPregnancyDateField ? formatDate(getMaxPregnancyDate()) : undefined}
            onChange={(event) => {
              let nextValue = event.target.value;

              // Pregnancy date ko allowed range ke andar clamp karo (safety net)
              if (isPregnancyDateField && nextValue) {
                const min = formatDate(getMinPregnancyDate());
                const max = formatDate(getMaxPregnancyDate());
                if (nextValue < min) nextValue = min;
                if (nextValue > max) nextValue = max;
              }

              if (stage === 'Conceive') setLastPeriodDate(nextValue);
              else if (stage === 'Mother') setBabyDob(nextValue);
              else setPregnancyFirstDate(nextValue);
            }}
            style={{
              width: '100%',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: '#E5E7EB',
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              paddingLeft: 16,
              paddingRight: 16,
              height: 56,
              fontSize: 16,
              color: value ? '#111827' : '#9CA3AF',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        ) : (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              paddingHorizontal: 16,
              height: 56,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onPress={() => openDatePicker(
              stage === 'Conceive' ? 'lastPeriodDate' : stage === 'Mother' ? 'babyDob' : 'pregnancyFirstDate'
            )}
          >
            <Text style={{ fontSize: 16, color: value ? '#111827' : '#9CA3AF' }}>
              {value || t('profile.selectDate')}
            </Text>
            <MaterialIcons name="calendar-today" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        {!isWeb && showDatePicker ? (
          <DateTimePicker
            value={new Date(value || new Date())}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={isPregnancyDateField ? getMinPregnancyDate() : undefined}
            maximumDate={isPregnancyDateField ? getMaxPregnancyDate() : undefined}
          />
        ) : null}
      </View>
    );
  };

  const renderHeightWeightField = () => {
    if (stage === 'Mother') {
      return (
        <>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text className="text-gray-900 font-semibold mb-3 text-base">{t('profile.motherHeight')}</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, fontSize: 16, color: '#111827' }}
                placeholder="165" placeholderTextColor="#D1D5DB" keyboardType="numeric" value={motherHeight} onChangeText={setMotherHeight}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text className="text-gray-900 font-semibold mb-3 text-base">{t('profile.motherWeight')}</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, fontSize: 16, color: '#111827' }}
                placeholder="60" placeholderTextColor="#D1D5DB" keyboardType="numeric" value={motherWeight} onChangeText={setMotherWeight}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            <View style={{ flex: 1 }}>
              <Text className="text-gray-900 font-semibold mb-3 text-base">{t('profile.babyHeight')}</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, fontSize: 16, color: '#111827' }}
                placeholder="50" placeholderTextColor="#D1D5DB" keyboardType="numeric" value={babyHeight} onChangeText={setBabyHeight}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text className="text-gray-900 font-semibold mb-3 text-base">{t('profile.babyWeight')}</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, fontSize: 16, color: '#111827' }}
                placeholder="3.5" placeholderTextColor="#D1D5DB" keyboardType="numeric" value={babyWeight} onChangeText={setBabyWeight}
              />
            </View>
          </View>
        </>
      );
    }

    return (
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        <View style={{ flex: 1 }}>
          <Text className="text-gray-900 font-semibold mb-3 text-base">{t('profile.yourHeight')}</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, fontSize: 16, color: '#111827' }}
            placeholder="165" placeholderTextColor="#D1D5DB" keyboardType="numeric" value={height} onChangeText={setHeight}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text className="text-gray-900 font-semibold mb-3 text-base">{t('profile.yourWeight')}</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, fontSize: 16, color: '#111827' }}
            placeholder="60" placeholderTextColor="#D1D5DB" keyboardType="numeric" value={weight} onChangeText={setWeight}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6"
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ paddingTop: 20 }} className="flex-1 pb-4">
          <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {getTitle()}
          </Text>

          {errorMessage ? (
            <Text className="text-red-500 text-sm mb-4">{errorMessage}</Text>
          ) : null}

          {renderDateField()}
          {renderHeightWeightField()}

          {/* Blood Group */}
          <View className="mb-6">
            <Text className="text-gray-900 font-semibold mb-3 text-base">
              {t('profile.bloodGroup')}
            </Text>
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              onPress={() => setShowBloodGroupPicker(!showBloodGroupPicker)}
            >
              <Text style={{ fontSize: 16, color: bloodGroup ? '#111827' : '#9CA3AF' }}>
                {bloodGroup || t('profile.selectBloodGroup')}
              </Text>
              <MaterialIcons name={showBloodGroupPicker ? 'expand-less' : 'expand-more'} size={24} color="#9CA3AF" />
            </TouchableOpacity>

            {showBloodGroupPicker && (
              <View style={{ marginTop: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: '#FFFFFF', overflow: 'hidden', zIndex: 100 }}>
                {bloodGroups.map((group, index) => (
                  <TouchableOpacity
                    key={group}
                    style={{ paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: index < bloodGroups.length - 1 ? 1 : 0, borderBottomColor: '#F3F4F6' }}
                    onPress={() => { setBloodGroup(group); setShowBloodGroupPicker(false); }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>{group}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Diabetic Toggle */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#F9FAFB', borderRadius: 12, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDiabetic ? '#E0E7FF' : '#DBEAFE', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20 }}>💧</Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>
                {t('profile.diabetic')}
              </Text>
            </View>
            <Switch
              value={isDiabetic}
              onValueChange={setIsDiabetic}
              trackColor={{ false: '#E5E7EB', true: '#FF6B5A' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Blood Pressure */}
          <View className="mb-8">
            <Text className="text-gray-900 font-semibold mb-4 text-base">
              {t('profile.bloodPressure')}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 16, paddingHorizontal: 16, backgroundColor: '#F9FAFB', borderRadius: 12 }}>
              {pressureOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => setBloodPressure(option.value)}
                >
                  <View style={{
                    width: 18, height: 18, borderRadius: 9, borderWidth: 2,
                    borderColor: bloodPressure === option.value
                      ? option.value === 'Low' ? '#EF4444' : option.value === 'Normal' ? '#10B981' : '#F59E0B'
                      : '#D1D5DB',
                    marginRight: 8, alignItems: 'center', justifyContent: 'center'
                  }}>
                    {bloodPressure === option.value && (
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: option.value === 'Low' ? '#EF4444' : option.value === 'Normal' ? '#10B981' : '#F59E0B' }} />
                    )}
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: option.value === 'Low' ? '#EF4444' : option.value === 'Normal' ? '#10B981' : '#F59E0B' }}>
                    {t(option.labelKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Button - Fixed Bottom */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: 'white' }}>
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
          onPress={handleContinue}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
            {loading ? t('profile.saving') : t('profile.continue')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PregnancyScreen;

// import { SafeAreaView, ScrollView, Text, View } from '@/components/ui/styled';
// import { MaterialIcons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Platform, Switch, TextInput, TouchableOpacity } from 'react-native';
// import { useUser } from '../../context/UserContext';
// import { updateConceiveProfile, updateMotherhoodProfile, updatePregnancyProfile } from '../../utils/api';

// const PregnancyScreen = () => {
//   const router = useRouter();
//   const { t } = useTranslation();
//   const { stage, token } = useUser() as { stage: 'Conceive' | 'Pregnant' | 'Mother' | 'Explore' | ''; token: string };
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [activeDateField, setActiveDateField] = useState<'lastPeriodDate' | 'pregnancyFirstDate' | 'babyDob'>('pregnancyFirstDate');

//   const [lastPeriodDate, setLastPeriodDate] = useState('');
//   const [pregnancyFirstDate, setPregnancyFirstDate] = useState('');
//   const [babyDob, setBabyDob] = useState('');

//   const [height, setHeight] = useState('');
//   const [weight, setWeight] = useState('');

//   const [motherHeight, setMotherHeight] = useState('');
//   const [motherWeight, setMotherWeight] = useState('');
//   const [babyHeight, setBabyHeight] = useState('');
//   const [babyWeight, setBabyWeight] = useState('');

//   const [bloodGroup, setBloodGroup] = useState('');
//   const [isDiabetic, setIsDiabetic] = useState(false);
//   const [bloodPressure, setBloodPressure] = useState('');
//   const [showBloodGroupPicker, setShowBloodGroupPicker] = useState(false);

//   const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
//   const pressureOptions = [
//     { value: 'Low', labelKey: 'profile.pressureLow' },
//     { value: 'Normal', labelKey: 'profile.pressureNormal' },
//     { value: 'High', labelKey: 'profile.pressureHigh' },
//   ] as const;
//   const isWeb = Platform.OS === 'web';

//   // ── Explore stage ──
//   if (stage === 'Explore') {
//     return (
//       <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
//         <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
//           <View style={{ paddingTop: 20 }} className="flex-1 pb-4">
//             <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">
//               {t('profile.exploreTitle')}
//             </Text>
//             <View style={{
//               borderWidth: 1,
//               borderColor: '#E5E7EB',
//               borderRadius: 16,
//               padding: 24,
//               backgroundColor: '#FFF7F6',
//               alignItems: 'center',
//               marginBottom: 24,
//             }}>
//               <Text style={{ fontSize: 48, marginBottom: 12 }}>🌸</Text>
//               <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
//                 {t('profile.exploreHeading')}
//               </Text>
//               <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 }}>
//                 {t('profile.exploreSubtitle')}
//               </Text>
//             </View>
//           </View>
//         </ScrollView>

//         <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: 'white' }}>
//           <TouchableOpacity
//             style={{
//               backgroundColor: '#FF6B5A',
//               paddingVertical: 18,
//               borderRadius: 12,
//               alignItems: 'center',
//               shadowColor: '#FF6B5A',
//               shadowOffset: { width: 0, height: 4 },
//               shadowOpacity: 0.3,
//               shadowRadius: 8,
//               elevation: 5,
//             }}
//             onPress={() => router.push('/(tabs)')}
//           >
//             <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
//               {t('profile.exploreButton')}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   const formatDate = (date: Date) => date.toISOString().split('T')[0];

//   const openDatePicker = (field: 'lastPeriodDate' | 'pregnancyFirstDate' | 'babyDob') => {
//     setActiveDateField(field);
//     setShowDatePicker(true);
//   };

//   const handleDateChange = (_event: unknown, selectedDate?: Date) => {
//     if (!selectedDate) {
//       setShowDatePicker(false);
//       return;
//     }
//     const formattedDate = formatDate(selectedDate);
//     if (activeDateField === 'lastPeriodDate') {
//       setLastPeriodDate(formattedDate);
//     } else if (activeDateField === 'pregnancyFirstDate') {
//       setPregnancyFirstDate(formattedDate);
//     } else {
//       setBabyDob(formattedDate);
//     }
//     setShowDatePicker(Platform.OS === 'ios');
//   };

//   const handleContinue = async () => {
//     if (loading) return;

//     const requiredDate =
//       stage === 'Conceive' ? lastPeriodDate : stage === 'Mother' ? babyDob : pregnancyFirstDate;

//     if (!requiredDate) {
//       setErrorMessage(
//         stage === 'Conceive'
//           ? t('profile.lastPeriodRequired')
//           : stage === 'Mother'
//             ? t('profile.babyDobRequired')
//             : t('profile.pregnancyDateRequired')
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       setErrorMessage('');

//       if (stage === 'Conceive') {
//         await updateConceiveProfile(token, {
//           lastPeriodDate,
//           height: height ? Number(height) : undefined,
//           weight: weight ? Number(weight) : undefined,
//           bloodGroup: bloodGroup || undefined,
//           diabetic: isDiabetic,
//           bloodPressure: bloodPressure || undefined,
//         });
//       } else if (stage === 'Mother') {
//         await updateMotherhoodProfile(token, {
//           babyDob,
//           motherHeight: motherHeight ? Number(motherHeight) : undefined,
//           motherWeight: motherWeight ? Number(motherWeight) : undefined,
//           babyHeight: babyHeight ? Number(babyHeight) : undefined,
//           babyWeight: babyWeight ? Number(babyWeight) : undefined,
//           bloodGroup: bloodGroup || undefined,
//           diabetic: isDiabetic,
//           bloodPressure: bloodPressure || undefined,
//         });
//       } else {
//         await updatePregnancyProfile(token, {
//           pregnancyDate: pregnancyFirstDate,
//           height: height ? Number(height) : undefined,
//           weight: weight ? Number(weight) : undefined,
//           bloodGroup: bloodGroup || undefined,
//           diabetic: isDiabetic,
//           bloodPressure: bloodPressure || undefined,
//         });
//       }

//       router.push('/(tabs)');
//     } catch (error) {
//       setErrorMessage(error instanceof Error ? error.message : t('profile.saveFailed'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTitle = () => {
//     if (stage === 'Conceive') return t('profile.conceiveTitle');
//     if (stage === 'Mother') return t('profile.motherTitle');
//     return t('profile.pregnancyTitle');
//   };

//   const renderDateField = () => {
//     let label = 'Expected Delivery Date';
//     let value = pregnancyFirstDate;

//     if (stage === 'Conceive') {
//       label = t('profile.lastPeriodDate');
//       value = lastPeriodDate;
//     } else if (stage === 'Mother') {
//       label = t('profile.babyDob');
//       value = babyDob;
//     }

//     return (
//       <View className="mb-6">
//         <Text className="text-gray-900 font-semibold mb-3 text-base">{label}</Text>
//         {isWeb ? (
//           <input
//             type="date"
//             value={value}
//             onChange={(event) => {
//               const nextValue = event.target.value;
//               if (stage === 'Conceive') setLastPeriodDate(nextValue);
//               else if (stage === 'Mother') setBabyDob(nextValue);
//               else setPregnancyFirstDate(nextValue);
//             }}
//             style={{
//               width: '100%',
//               borderWidth: 1,
//               borderStyle: 'solid',
//               borderColor: '#E5E7EB',
//               backgroundColor: '#FFFFFF',
//               borderRadius: 12,
//               paddingLeft: 16,
//               paddingRight: 16,
//               height: 56,
//               fontSize: 16,
//               color: value ? '#111827' : '#9CA3AF',
//               outline: 'none',
//               boxSizing: 'border-box',
//             }}
//           />
//         ) : (
//           <TouchableOpacity
//             style={{
//               borderWidth: 1,
//               borderColor: '#E5E7EB',
//               backgroundColor: '#FFFFFF',
//               borderRadius: 12,
//               paddingHorizontal: 16,
//               height: 56,
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}
//             onPress={() => openDatePicker(
//               stage === 'Conceive' ? 'lastPeriodDate' : stage === 'Mother' ? 'babyDob' : 'pregnancyFirstDate'
//             )}
//           >
//             <Text style={{ fontSize: 16, color: value ? '#111827' : '#9CA3AF' }}>
//               {value || t('profile.selectDate')}
//             </Text>
//             <MaterialIcons name="calendar-today" size={20} color="#9CA3AF" />
//           </TouchableOpacity>
//         )}
//         {!isWeb && showDatePicker ? (
//           <DateTimePicker
//             value={new Date(value || new Date())}
//             mode="date"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={handleDateChange}
//             minimumDate={stage === 'Pregnant' ? new Date() : undefined}
//           />
//         ) : null}
//       </View>
//     );
//   };

//   const renderHeightWeightField = () => {
//     if (stage === 'Mother') {
//       return (
//         <>
//           <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
//             <View style={{ flex: 1 }}>
//               <Text className="text-gray-900 font-semibold mb-3 text-base">{t('profile.motherHeight')}</Text>
//               <TextInput
//                 style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, fontSize: 16, color: '#111827' }}
//                 placeholder="165" placeholderTextColor="#D1D5DB" keyboardType="numeric" value={motherHeight} onChangeText={setMotherHeight}
//               />
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text className="text-gray-900 font-semibold mb-3 text-base">{t('profile.motherWeight')}</Text>
//               <TextInput
//                 style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, fontSize: 16, color: '#111827' }}
//                 placeholder="60" placeholderTextColor="#D1D5DB" keyboardType="numeric" value={motherWeight} onChangeText={setMotherWeight}
//               />
//             </View>
//           </View>
//           <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
//             <View style={{ flex: 1 }}>
//               <Text className="text-gray-900 font-semibold mb-3 text-base">{t('profile.babyHeight')}</Text>
//               <TextInput
//                 style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, fontSize: 16, color: '#111827' }}
//                 placeholder="50" placeholderTextColor="#D1D5DB" keyboardType="numeric" value={babyHeight} onChangeText={setBabyHeight}
//               />
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text className="text-gray-900 font-semibold mb-3 text-base">{t('profile.babyWeight')}</Text>
//               <TextInput
//                 style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, fontSize: 16, color: '#111827' }}
//                 placeholder="3.5" placeholderTextColor="#D1D5DB" keyboardType="numeric" value={babyWeight} onChangeText={setBabyWeight}
//               />
//             </View>
//           </View>
//         </>
//       );
//     }

//     return (
//       <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
//         <View style={{ flex: 1 }}>
//           <Text className="text-gray-900 font-semibold mb-3 text-base">{t('profile.yourHeight')}</Text>
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, fontSize: 16, color: '#111827' }}
//             placeholder="165" placeholderTextColor="#D1D5DB" keyboardType="numeric" value={height} onChangeText={setHeight}
//           />
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text className="text-gray-900 font-semibold mb-3 text-base">{t('profile.yourWeight')}</Text>
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, fontSize: 16, color: '#111827' }}
//             placeholder="60" placeholderTextColor="#D1D5DB" keyboardType="numeric" value={weight} onChangeText={setWeight}
//           />
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1 }}
//         className="px-6"
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={{ paddingTop: 20 }} className="flex-1 pb-4">
//           <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">
//             {getTitle()}
//           </Text>

//           {errorMessage ? (
//             <Text className="text-red-500 text-sm mb-4">{errorMessage}</Text>
//           ) : null}

//           {renderDateField()}
//           {renderHeightWeightField()}

//           {/* Blood Group */}
//           <View className="mb-6">
//             <Text className="text-gray-900 font-semibold mb-3 text-base">
//               {t('profile.bloodGroup')}
//             </Text>
//             <TouchableOpacity
//               style={{ borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
//               onPress={() => setShowBloodGroupPicker(!showBloodGroupPicker)}
//             >
//               <Text style={{ fontSize: 16, color: bloodGroup ? '#111827' : '#9CA3AF' }}>
//                 {bloodGroup || t('profile.selectBloodGroup')}
//               </Text>
//               <MaterialIcons name={showBloodGroupPicker ? 'expand-less' : 'expand-more'} size={24} color="#9CA3AF" />
//             </TouchableOpacity>

//             {showBloodGroupPicker && (
//               <View style={{ marginTop: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: '#FFFFFF', overflow: 'hidden', zIndex: 100 }}>
//                 {bloodGroups.map((group, index) => (
//                   <TouchableOpacity
//                     key={group}
//                     style={{ paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: index < bloodGroups.length - 1 ? 1 : 0, borderBottomColor: '#F3F4F6' }}
//                     onPress={() => { setBloodGroup(group); setShowBloodGroupPicker(false); }}
//                   >
//                     <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>{group}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>

//           {/* Diabetic Toggle */}
//           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#F9FAFB', borderRadius: 12, marginBottom: 16 }}>
//             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
//               <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDiabetic ? '#E0E7FF' : '#DBEAFE', alignItems: 'center', justifyContent: 'center' }}>
//                 <Text style={{ fontSize: 20 }}>💧</Text>
//               </View>
//               <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>
//                 {t('profile.diabetic')}
//               </Text>
//             </View>
//             <Switch
//               value={isDiabetic}
//               onValueChange={setIsDiabetic}
//               trackColor={{ false: '#E5E7EB', true: '#FF6B5A' }}
//               thumbColor="#FFFFFF"
//             />
//           </View>

//           {/* Blood Pressure */}
//           <View className="mb-8">
//             <Text className="text-gray-900 font-semibold mb-4 text-base">
//               {t('profile.bloodPressure')}
//             </Text>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 16, paddingHorizontal: 16, backgroundColor: '#F9FAFB', borderRadius: 12 }}>
//               {pressureOptions.map((option) => (
//                 <TouchableOpacity
//                   key={option.value}
//                   style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
//                   onPress={() => setBloodPressure(option.value)}
//                 >
//                   <View style={{
//                     width: 18, height: 18, borderRadius: 9, borderWidth: 2,
//                     borderColor: bloodPressure === option.value
//                       ? option.value === 'Low' ? '#EF4444' : option.value === 'Normal' ? '#10B981' : '#F59E0B'
//                       : '#D1D5DB',
//                     marginRight: 8, alignItems: 'center', justifyContent: 'center'
//                   }}>
//                     {bloodPressure === option.value && (
//                       <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: option.value === 'Low' ? '#EF4444' : option.value === 'Normal' ? '#10B981' : '#F59E0B' }} />
//                     )}
//                   </View>
//                   <Text style={{ fontSize: 14, fontWeight: '500', color: option.value === 'Low' ? '#EF4444' : option.value === 'Normal' ? '#10B981' : '#F59E0B' }}>
//                     {t(option.labelKey)}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Button - Fixed Bottom */}
//       <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: 'white' }}>
//         <TouchableOpacity
//           style={{
//             backgroundColor: '#FF6B5A',
//             paddingVertical: 18,
//             borderRadius: 12,
//             alignItems: 'center',
//             shadowColor: '#FF6B5A',
//             shadowOffset: { width: 0, height: 4 },
//             shadowOpacity: 0.3,
//             shadowRadius: 8,
//             elevation: 5,
//           }}
//           onPress={handleContinue}
//         >
//           <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
//             {loading ? t('profile.saving') : t('profile.continue')}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default PregnancyScreen;