import { launchImageLibrary } from 'react-native-image-picker';

export async function pickOccasionCoverPhoto(): Promise<string | undefined> {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 1,
    quality: 0.8,
    includeBase64: false,
  });

  if (result.didCancel) return undefined;
  if (result.errorCode) {
    throw new Error(result.errorMessage ?? result.errorCode);
  }

  return result.assets?.[0]?.uri;
}
