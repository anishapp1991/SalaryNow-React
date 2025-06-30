import { NativeModules } from 'react-native';

const { DeveloperOptions } = NativeModules;

export const isDeveloperOptionsEnabled = async () => {
  try {
    const isEnabled = await DeveloperOptions.isDeveloperOptionsEnabled();
    return isEnabled;
  } catch (error) {
    console.error('Error checking Developer Options:', error);
    return false;
  }
};
