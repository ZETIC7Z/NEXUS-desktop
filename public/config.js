window.__CONFIG__ = {
  // The URL for the CORS proxy (Worker Proxy), the URL must NOT end with a slash!
  VITE_CORS_PROXY_URL:
    'https://65304ac9-simple-proxy.reyamae14.workers.dev,https://eloquent-gumdrop-637ae8.netlify.app,https://simple-proxy.reyamae14.workers.dev,https://1497fc65-zeticuz-proxy12.reyamae14.workers.dev',

  // M3U8 Proxy URLs for video streaming (multiple for load balancing)
  VITE_M3U8_PROXY_URL:
    'https://gkaflfvriifxaikoyjwlnis.lordflix.club,https://kpuimjwezgxthmjmtuzaahf.lordflix.club,https://rijksdadhwqo.aether.mom,https://jdkehkfhjksd.aether.mom,https://ps-proxy-pps.flather.online,https://prism.pstream.mov,https://prozy.aether.mom',

  // The READ API key to access TMDB (v4 Read Access Token)
  VITE_TMDB_READ_API_KEY:
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGJmMGMyMTY1Y2E3Y2VjMDFkNjFiNjMyZjgxMjkwZCIsIm5iZiI6MTc2MTc4MDcxNi40MDcsInN1YiI6IjY5MDJhM2VjYmRmMDRhNGI2NTZiMmZhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eVJ_v1IzpxWhtA54DUDp_8R08fmKDmciQ1aLVV0kUx4',

  // The DMCA email displayed in the footer, null to hide the DMCA link
  VITE_DMCA_EMAIL: null,

  // Whether to disable hash-based routing
  VITE_NORMAL_ROUTER: 'false',

  // The backend URL to communicate with (CB's Community Backend)
  VITE_BACKEND_URL: 'https://backend.aether.mom',

  // A comma separated list of disallowed IDs in the case of a DMCA claim
  VITE_DISALLOWED_IDS: '',

  // Disable onboarding - use built-in proxy directly
  VITE_HAS_ONBOARDING: 'true',

  // Hide the proxy setup in onboarding - use built-in proxy
  VITE_HIDE_PROXY_ONBOARDING: 'true',

  // Enable febbox token settings in UI
  VITE_ALLOW_FEBBOX_KEY: 'true',

  // Enable debrid settings in UI
  VITE_ALLOW_DEBRID_KEY: 'true',

  // Enable autoplay feature
  VITE_ALLOW_AUTOPLAY: 'true',

  // Chrome extension install link
  VITE_ONBOARDING_CHROME_EXTENSION_INSTALL_LINK:
    'https://chromewebstore.google.com/detail/p-stream-extension/gnheenieicoichghfmjlpofcaebbgclh',

  // Shared Febbox token for all users (fallback if user doesn't have their own)
  VITE_SHARED_FEBBOX_TOKEN:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NjYzMTA4NTUsIm5iZiI6MTc2NjMxMDg1NSwiZXhwIjoxNzk3NDE0ODc1LCJkYXRhIjp7InVpZCI6MTIzODI3MSwidG9rZW4iOiIxZWYyNjhiNTQ0ZGY0YjE4MzBkZDQwOWFlMDNiOWJlMCJ9fQ.VKBF-cMR-nKArky3qCthsjTehhv0x4EB7CgaqXiC2oQ',

  VITE_APP_DOMAIN: 'https://www.zeticuz.online',
};
