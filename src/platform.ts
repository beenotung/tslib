export type PlatformType = 'Windows Phone' | 'Android' | 'iOS' | 'unknown'

export function detectMobilePlatform(): PlatformType {
  if (
    typeof navigator === 'undefined' &&
    (typeof window === 'undefined' ||
      typeof (window as any).opera === 'undefined')
  ) {
    // not browser env
    return 'unknown'
  }
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone'
  }
  if (/android/i.test(userAgent)) {
    return 'Android'
  }
  if (/ipad|iphone|ipod/i.test(userAgent)) {
    return 'iOS'
  }
  return 'unknown'
}
