import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import 'react-native-reanimated';
import '../global.css';

import { UserProvider } from '../context/UserContext';
import i18n, { loadSavedLanguage } from '../i18n';

export const unstable_settings = {
  initialRouteName: 'index',
};
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isI18nReady, setIsI18nReady] = useState(false);
  const [isUserReady, setIsUserReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadSavedLanguage();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsI18nReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (!isI18nReady || !isUserReady) return;

    async function hideSplash() {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    }

    hideSplash();
  }, [isI18nReady, isUserReady]);

  return (
    <I18nextProvider i18n={i18n}>
      <UserProvider onReady={() => setIsUserReady(true)}>
        {(!isI18nReady || !isUserReady) ? null : (
          <ThemeProvider value={DefaultTheme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        )}
      </UserProvider>
    </I18nextProvider>
  );
}
