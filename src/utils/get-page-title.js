import defaultSettings from '@/settings'

// const title = defaultSettings.title || 'Vue Admin Template'
const title = defaultSettings.title || 'KG Interactive Construction'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
