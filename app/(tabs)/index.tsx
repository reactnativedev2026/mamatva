import { Redirect } from 'expo-router';
import React from 'react';

import { ConceiveDashboard } from '../../components/dashboards/ConceiveDashboard';
import { PregnantDashboard } from '../../components/dashboards/PregnantDashboard';
import { MotherDashboard } from '../../components/dashboards/MotherDashboard';
import { useUser } from '../../context/UserContext';

export default function HomeScreen() {
  const { stage, token } = useUser();

  if (!stage) {
    if (!token) {
      return <Redirect href="/(auth)/onboarding" />;
    }

    return <Redirect href="/(auth)/stage" />;
  }

  if (stage === 'Conceive') {
    return <ConceiveDashboard />;
  }

  if (stage === 'Mother') {
    return <MotherDashboard />;
  }

  if (stage === 'Pregnant') {
    return <PregnantDashboard />;
  }

  return <Redirect href="/(auth)/stage" />;
}
