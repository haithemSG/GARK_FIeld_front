// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  SCARF_ANALYTICS : false,
  adminRoot: '/football/app',
  apiUrl: 'http://localhost:3000/api',
  backend: 'http://localhost:3000/',
  defaultMenuType: 'menu-default',
  subHiddenBreakpoint: 1440,
  menuHiddenBreakpoint: 768,
  themeColorStorageKey: 'gark-themecolor',
  defaultColor: 'light.greenlime',
  isDarkSwitchActive: true,
  defaultDirection: 'ltr',
  themeRadiusStorageKey: 'gark-themeradius',
  isAuthGuardActive: true,
};
