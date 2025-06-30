import { AppState, NativeModules, Platform } from 'react-native';

const { AppExit } = NativeModules;

export const closeApp = () => {
  if (
    Platform.OS === 'android' &&
    AppExit?.exitApp &&
    AppState.currentState === 'active'
  ) {
    AppExit.exitApp();
  } else {
    console.warn('closeApp() skipped: app not in foreground or module not available.');
  }
};
