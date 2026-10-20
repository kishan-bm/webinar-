import { useEffect, useState } from "react";

const FALLBACK_URL = "https://member.navigationtrading.com/join/pro";

/**
 * Reads the "Get Access to FLUX" checkout URL from the admin-managed
 * site config (page key "flux", field "proCheckoutLink"), falling back
 * to FALLBACK_URL if nothing is set or the request fails.
 */
export function useCheckoutLink() {
  const [url, setUrl] = useState(FALLBACK_URL);

  useEffect(() => {
    fetch(`/api/config?page=flux&t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.config?.proCheckoutLink) {
          setUrl(data.config.proCheckoutLink);
        }
      })
      .catch(() => {
        // keep fallback
      });
  }, []);

  return url;
}
