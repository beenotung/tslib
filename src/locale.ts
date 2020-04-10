export function getEnvLocale(): string | undefined {
  if (typeof navigator !== 'undefined') {
    // userLanguage is for IE, it get the language in Windows Control Panel - Regional Options
    const locale = (navigator as any).userLanguage || navigator.language
    if (locale) {
      return locale
    }
  }
  if (typeof process !== 'undefined') {
    const env = process.env || {}
    const locale = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE
    if (locale) {
      return locale.split('.')[0].replace(/_/g, '-')
    }
  }
  return undefined
}
