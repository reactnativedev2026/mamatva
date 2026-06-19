import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://api.mamatvacare.com/api/v1";

const STORAGE_KEYS = {
  token: "mamvatam.token",
  session: "mamvatam.session",
} as const;

export type AuthSession = {
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

export type LoggedInUser = {
  id?: number;
  uuid?: string;
  name?: string;
  phone?: string;
  email?: string;
  language?: string;
  location?: string;
  activeStage?: string;
  isPhoneVerified?: boolean;
  profile?: Record<string, unknown>;
};

type StoredSession = AuthSession | null;

// ─── AsyncStorage helpers ─────────────────────────────────────
const readStoredSession = async (): Promise<StoredSession> => {
  try {
    const rawValue = await AsyncStorage.getItem(STORAGE_KEYS.session);
    if (!rawValue) return null;
    return JSON.parse(rawValue) as StoredSession;
  } catch {
    return null;
  }
};

const persistSession = async (session: StoredSession): Promise<void> => {
  try {
    if (!session) {
      await AsyncStorage.removeItem(STORAGE_KEYS.session);
      await AsyncStorage.removeItem(STORAGE_KEYS.token);
      return;
    }
    if (session.accessToken) {
      await AsyncStorage.setItem(STORAGE_KEYS.token, session.accessToken);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
  } catch (e) {
    console.log("❌ persistSession error:", e);
  }
};

// ─── Refresh Token ────────────────────────────────────────────
async function refreshAccessToken(): Promise<string | null> {
  const storedSession = await readStoredSession();
  const refreshToken = storedSession?.refreshToken;
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) return null;

    const nextSession: AuthSession = {
      accessToken:
        data?.data?.accessToken ||
        data?.accessToken ||
        storedSession?.accessToken,
      refreshToken:
        data?.data?.refreshToken || data?.refreshToken || refreshToken,
      user: storedSession?.user,
      nextScreen: storedSession?.nextScreen,
    };

    await persistSession(nextSession);
    return nextSession.accessToken || null;
  } catch {
    return null;
  }
}

// ─── Base API Request ─────────────────────────────────────────
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    if (response.status === 401 && token) {
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken && refreshedToken !== token) {
        return apiRequest<T>(path, options, refreshedToken);
      }
    }
    const message =
      data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

// ─── Auth APIs ────────────────────────────────────────────────
export async function requestOtp(payload: { phone: string; location: string }) {
  return apiRequest<{ success?: boolean; message?: string }>(
    "/auth/request-otp",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function verifyOtp(payload: { phone: string; otp: string }) {
  const response = await apiRequest<{
    success?: boolean;
    message?: string;
    data?: AuthSession;
  }>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (response.data) {
    await persistSession(response.data); // ✅ await add kiya
  }

  return response;
}

export async function getMe(token: string) {
  return apiRequest<{
    success?: boolean;
    nextScreen?: string;
    data?: LoggedInUser;
  }>("/auth/me", { method: "GET" }, token);
}

// ─── User APIs ────────────────────────────────────────────────
export async function updateUserLanguage(token: string, language: string) {
  return apiRequest<{
    success?: boolean;
    message?: string;
    nextScreen?: string;
  }>(
    "/users/language",
    { method: "PATCH", body: JSON.stringify({ language }) },
    token,
  );
}

export async function updateUserStage(
  token: string,
  activeStage: "CONCEIVE" | "PREGNANCY" | "MOTHERHOOD" | "EXPLORE",
) {
  return apiRequest<{
    success?: boolean;
    message?: string;
    nextScreen?: string;
    data?: unknown;
  }>(
    "/users/stage",
    { method: "PATCH", body: JSON.stringify({ activeStage }) },
    token,
  );
}

export async function updateConceiveProfile(
  token: string,
  payload: {
    lastPeriodDate: string;
    height?: number;
    weight?: number;
    bloodGroup?: string;
    diabetic?: boolean;
    bloodPressure?: string;
  },
) {
  return apiRequest(
    "/profiles/conceive",
    { method: "PATCH", body: JSON.stringify(payload) },
    token,
  );
}

export async function updatePregnancyProfile(
  token: string,
  payload: {
    pregnancyDate: string;
    height?: number;
    weight?: number;
    bloodGroup?: string;
    diabetic?: boolean;
    bloodPressure?: string;
  },
) {
  return apiRequest(
    "/profiles/pregnancy",
    { method: "PATCH", body: JSON.stringify(payload) },
    token,
  );
}

export async function updateMotherhoodProfile(
  token: string,
  payload: {
    babyDob: string;
    motherHeight?: number;
    motherWeight?: number;
    babyHeight?: number;
    babyWeight?: number;
    bloodGroup?: string;
    diabetic?: boolean;
    bloodPressure?: string;
    childGender?: "BOY" | "GIRL";
  },
) {
  return apiRequest(
    "/profiles/motherhood",
    { method: "PATCH", body: JSON.stringify(payload) },
    token,
  );
}

// ─── Content APIs ─────────────────────────────────────────────
export function normalizeApiList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) return maybeData as T[];
    if (maybeData && typeof maybeData === "object") {
      const nestedData = (maybeData as { data?: unknown }).data;
      if (Array.isArray(nestedData)) return nestedData as T[];
    }
  }
  return [];
}

export async function getDailyTips(token?: string) {
  return apiRequest<unknown>("/dailytips/", { method: "GET" }, token);
}

export async function getCourses(token?: string) {
  return apiRequest<unknown>("/courses/", { method: "GET" }, token);
}

export async function getExperts(token?: string) {
  return apiRequest<unknown>("/experts/", { method: "GET" }, token);
}

export async function getExpertPosts(token?: string) {
  return apiRequest<unknown>("/expert-posts/", { method: "GET" }, token);
}

export async function getCommunityPosts(token?: string) {
  return apiRequest<unknown>(
    "/community-posts/user/posts",
    { method: "GET" },
    token,
  );
}

export async function getDietCharts(token?: string) {
  return apiRequest<unknown>(
    "/diet-nuskha/diet-chart",
    { method: "GET" },
    token,
  );
}

export async function getDadiNaniNuskhe(token?: string) {
  return apiRequest<unknown>(
    "/diet-nuskha/dadi-nani-nuskhe",
    { method: "GET" },
    token,
  );
}

export async function getConceiveResourcesByType(type: string, token?: string) {
  return apiRequest<unknown>(
    `/resources/conceive/type/${encodeURIComponent(type)}`,
    { method: "GET" },
    token,
  );
}
