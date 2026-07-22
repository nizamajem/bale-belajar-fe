"use client";

import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleAuthButton({
  onSuccess,
  onError,
}: {
  onSuccess: (idToken: string) => void;
  onError?: () => void;
}) {
  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="rounded-[8px] border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-center text-sm font-bold text-slate-400">
        Login Google belum dikonfigurasi di server ini.
      </div>
    );
  }

  function handleSuccess(credentialResponse: CredentialResponse) {
    if (credentialResponse.credential) {
      onSuccess(credentialResponse.credential);
    } else {
      onError?.();
    }
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex justify-center">
        <GoogleLogin
          onError={() => onError?.()}
          onSuccess={handleSuccess}
          shape="pill"
          size="large"
          text="continue_with"
          width="320"
        />
      </div>
    </GoogleOAuthProvider>
  );
}
