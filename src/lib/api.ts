const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ApiSuccessEnvelope<T> = {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
};

type ApiErrorEnvelope = {
  success: false;
  message: string;
  errors: { field?: string; message: string }[];
};

export class ApiError extends Error {
  status: number;
  errors: { field?: string; message: string }[];

  constructor(
    message: string,
    status: number,
    errors: { field?: string; message: string }[] = [],
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

const TOKEN_KEY = "bb_token";
const USER_KEY = "bb_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export { TOKEN_KEY, USER_KEY };

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<{ data: T; meta?: ApiMeta }> {
  const { method = "GET", body, query, auth = true } = options;

  const url = new URL(`${API_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Tidak bisa terhubung ke server. Periksa koneksi internet.", 0);
  }

  const json = (await res.json().catch(() => null)) as
    | ApiSuccessEnvelope<T>
    | ApiErrorEnvelope
    | null;

  if (!res.ok || !json || json.success !== true) {
    const errJson = json as ApiErrorEnvelope | null;
    throw new ApiError(
      errJson?.message ?? "Terjadi kesalahan pada server.",
      res.status,
      errJson?.errors ?? [],
    );
  }

  return { data: json.data, meta: json.meta };
}
