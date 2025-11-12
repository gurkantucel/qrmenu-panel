import { useIntl } from 'react-intl'

type LocalizedField = Record<string, string>

export function useLocalizedField() {
  const intl = useIntl()
  const locale = intl.locale

  return (field: LocalizedField | null | undefined): string => {
    if (!field) return ''
    return field[locale] || field['tr'] || Object.values(field)[0] || ''
  }
}