import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function DebugScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Debug Navigator</Text>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/(auth)/splash')}>
        <Text style={styles.btnText}>Open Splash</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/(auth)/signin')}>
        <Text style={styles.btnText}>Open Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/(auth)/otp')}>
        <Text style={styles.btnText}>Open OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/(auth)/onboarding')}>
        <Text style={styles.btnText}>Open Onboarding</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.btnText}>Open Home (tabs)</Text>
      </TouchableOpacity>

      <Text style={styles.note}>Note: This is temporary for testing on a physical device.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#FF6B5A',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  note: {
    marginTop: 20,
    color: '#555',
    textAlign: 'center',
  },
});
