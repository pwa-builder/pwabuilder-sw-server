Please use our [main repository for any issues/bugs/features suggestion](https://github.com/pwa-builder/PWABuilder/issues/new/choose).

# pwabuilder-sw-server

Handles serving our service workers from https://github.com/pwa-builder/pwabuilder-serviceworkers.

Supports 3 endpoints:
- /download: Downloads a service worker and its register script
- /listing: Get the list (with id's) of our available service workers
- /codePreview: Gets the code as a string for display in the site
