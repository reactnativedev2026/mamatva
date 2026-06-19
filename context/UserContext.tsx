// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
// import { getMe } from '../utils/api';

// // ─── Types ────────────────────────────────────────────────────
// type UserStage = 'Conceive' | 'Pregnant' | 'Mother' | '';

// type AuthSession = {
//   accessToken?: string;
//   refreshToken?: string;
//   user?: {
//     id?: string | number;
//     uuid?: string;
//     phone?: string;
//     name?: string;
//   };
//   nextScreen?: string;
// };

// interface UserContextType {
//   stage: UserStage;
//   setStage: (stage: UserStage) => Promise<void>;
//   token: string;
//   session: AuthSession | null;
//   setSession: (session: AuthSession | null) => Promise<void>;
//   setToken: (token: string) => Promise<void>;
// }

// // ─── Context ──────────────────────────────────────────────────
// const UserContext = createContext<UserContextType | undefined>(undefined);

// const STORAGE_KEYS = {
//   stage: 'mamvatam.stage',
//   token: 'mamvatam.token',
//   session: 'mamvatam.session',
// } as const;

// const mapApiStageToUserStage = (activeStage?: string): UserStage => {
//   if (activeStage === 'CONCEIVE') return 'Conceive';
//   if (activeStage === 'MOTHERHOOD') return 'Mother';
//   if (activeStage === 'PREGNANCY') return 'Pregnant';
//   return '';
// };

// // ─── Provider ─────────────────────────────────────────────────
// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [stage, setStageState] = useState<UserStage>('');
//   const [token, setTokenState] = useState<string>('');
//   const [session, setSessionState] = useState<AuthSession | null>(null);
//   const [isLoaded, setIsLoaded] = useState<boolean>(false);

//   // App start hote hi AsyncStorage se load karo
//   useEffect(() => {
//     const loadStorage = async () => {
//       try {
//         const [savedStage, savedToken, savedSession] = await Promise.all([
//           AsyncStorage.getItem(STORAGE_KEYS.stage),
//           AsyncStorage.getItem(STORAGE_KEYS.token),
//           AsyncStorage.getItem(STORAGE_KEYS.session),
//         ]);

//         if (savedStage) setStageState(savedStage as UserStage);
//         if (savedToken) setTokenState(savedToken);
//         if (savedSession) setSessionState(JSON.parse(savedSession) as AuthSession);

//         console.log('💾 Storage loaded:', { savedStage, savedToken });
//       } catch (e) {
//         console.log('❌ Storage load error:', e);
//       } finally {
//         setIsLoaded(true);
//       }
//     };

//     loadStorage();
//   }, []);

//   const setStage = async (nextStage: UserStage): Promise<void> => {
//     setStageState(nextStage);
//     if (nextStage) {
//       await AsyncStorage.setItem(STORAGE_KEYS.stage, nextStage);
//     } else {
//       await AsyncStorage.removeItem(STORAGE_KEYS.stage);
//     }
//   };

//   const setToken = async (nextToken: string): Promise<void> => {
//     setTokenState(nextToken);
//     if (nextToken) {
//       await AsyncStorage.setItem(STORAGE_KEYS.token, nextToken);
//     } else {
//       await AsyncStorage.removeItem(STORAGE_KEYS.token);
//     }
//   };

//   const setSession = async (nextSession: AuthSession | null): Promise<void> => {
//     setSessionState(nextSession);
//     if (nextSession) {
//       await AsyncStorage.setItem(STORAGE_KEYS.session, JSON.stringify(nextSession));
//     } else {
//       await AsyncStorage.removeItem(STORAGE_KEYS.session);
//     }
//   };

//   // Token se user hydrate karo
//   useEffect(() => {
//     if (!token) return;

//     let cancelled = false;

//     const hydrateUser = async () => {
//       try {
//         const response = await getMe(token);
//         if (cancelled || !response.data) return;

//         const user = response.data;
//         if (user.activeStage) {
//           setStageState(mapApiStageToUserStage(user.activeStage));
//         }

//         setSessionState((currentSession) => ({
//           accessToken: currentSession?.accessToken || token,
//           refreshToken: currentSession?.refreshToken,
//           nextScreen: response.nextScreen || currentSession?.nextScreen,
//           user: {
//             ...currentSession?.user,
//             id: user.id,
//             uuid: user.uuid,
//             phone: user.phone,
//             name: user.name,
//           },
//         }));
//       } catch {
//         // Cache se session rakho agar fail ho
//       }
//     };

//     void hydrateUser();

//     return () => { cancelled = true; };
//   }, [token]);

//   if (!isLoaded) return null;

//   return (
//     <UserContext.Provider value={{ stage, setStage, token, session, setSession, setToken }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // ─── Hook ─────────────────────────────────────────────────────
// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };


import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getMe } from '../utils/api';

// ─── Types ────────────────────────────────────────────────────
type UserStage = 'Conceive' | 'Pregnant' | 'Mother' | 'Explore' | '';

type AuthSession = {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id?: string | number;
    uuid?: string;
    phone?: string;
    name?: string;
  };
  nextScreen?: string;
};

interface UserContextType {
  stage: UserStage;
  setStage: (stage: UserStage) => Promise<void>;
  token: string;
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => Promise<void>;
  setToken: (token: string) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────
const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEYS = {
  stage: 'mamvatam.stage',
  token: 'mamvatam.token',
  session: 'mamvatam.session',
} as const;

const mapApiStageToUserStage = (activeStage?: string): UserStage => {
  if (activeStage === 'CONCEIVE') return 'Conceive';
  if (activeStage === 'MOTHERHOOD') return 'Mother';
  if (activeStage === 'PREGNANCY') return 'Pregnant';
  return '';
};

// ─── Provider ─────────────────────────────────────────────────
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [stage, setStageState] = useState<UserStage>('');
  const [token, setTokenState] = useState<string>('');
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadStorage = async () => {
      try {
        const [savedStage, savedToken, savedSession] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.stage),
          AsyncStorage.getItem(STORAGE_KEYS.token),
          AsyncStorage.getItem(STORAGE_KEYS.session),
        ]);

        if (savedStage) setStageState(savedStage as UserStage);
        if (savedToken) setTokenState(savedToken);
        if (savedSession) setSessionState(JSON.parse(savedSession) as AuthSession);

        console.log('💾 Storage loaded:', { savedStage, savedToken });
      } catch (e) {
        console.log('❌ Storage load error:', e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadStorage();
  }, []);

  const setStage = async (nextStage: UserStage): Promise<void> => {
    setStageState(nextStage);
    if (nextStage) {
      await AsyncStorage.setItem(STORAGE_KEYS.stage, nextStage);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.stage);
    }
  };

  const setToken = async (nextToken: string): Promise<void> => {
    setTokenState(nextToken);
    if (nextToken) {
      await AsyncStorage.setItem(STORAGE_KEYS.token, nextToken);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.token);
    }
  };

  const setSession = async (nextSession: AuthSession | null): Promise<void> => {
    setSessionState(nextSession);
    if (nextSession) {
      await AsyncStorage.setItem(STORAGE_KEYS.session, JSON.stringify(nextSession));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.session);
    }
  };

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const hydrateUser = async () => {
      try {
        const response = await getMe(token);
        if (cancelled || !response.data) return;

        const user = response.data;
        if (user.activeStage) {
          setStageState(mapApiStageToUserStage(user.activeStage));
        }

        setSessionState((currentSession) => ({
          accessToken: currentSession?.accessToken || token,
          refreshToken: currentSession?.refreshToken,
          nextScreen: response.nextScreen || currentSession?.nextScreen,
          user: {
            ...currentSession?.user,
            id: user.id,
            uuid: user.uuid,
            phone: user.phone,
            name: user.name,
          },
        }));
      } catch {
        // Cache se session rakho agar fail ho
      }
    };

    void hydrateUser();

    return () => { cancelled = true; };
  }, [token]);

  if (!isLoaded) return null;

  return (
    <UserContext.Provider value={{ stage, setStage, token, session, setSession, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};