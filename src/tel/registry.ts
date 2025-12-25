// Import handlers
import * as hk_tel from './hk'
import * as sg_tel from './sg'
import * as au_tel from './au'
import * as cn_tel from './cn'
import * as mo_tel from './mo'
import * as ae_tel from './ae'
import * as th_tel from './th'
import * as in_tel from './in'
import * as jp_tel from './jp'
import * as vn_tel from './vn'
import * as id_tel from './id'
import * as my_tel from './my'
import * as us_tel from './us'
import * as ch_tel from './ch'
import * as fr_tel from './fr'
import * as de_tel from './de'
import * as it_tel from './it'
import * as es_tel from './es'
import * as nl_tel from './nl'
import * as be_tel from './be'
import * as at_tel from './at'

/** *****************
 * Registry Pattern *
 ********************/

export type TelHandler = {
  country_code: string
  to_full: (tel: string | number) => string
  format: (tel: string | number) => string
}

/**
 * Registry for all country handlers
 * Order matters: unique patterns first, then overlapping patterns
 * Registration order determines auto-detection priority
 */
export const tel_handlers: TelHandler[] = []

// Register all countries
// Order matters: unique patterns first, then overlapping patterns
// Countries with unique patterns are registered first
tel_handlers.push({
  country_code: '+852',
  to_full: hk_tel.to_full_hk_mobile_phone,
  format: hk_tel.format_hk_mobile_phone,
})
tel_handlers.push({
  country_code: '+65',
  to_full: sg_tel.to_full_sg_mobile_phone,
  format: sg_tel.format_sg_mobile_phone,
})
tel_handlers.push({
  country_code: '+86',
  to_full: cn_tel.to_full_cn_mobile_phone,
  format: cn_tel.format_cn_mobile_phone,
})
tel_handlers.push({
  country_code: '+853',
  to_full: mo_tel.to_full_mo_mobile_phone,
  format: mo_tel.format_mo_mobile_phone,
})
tel_handlers.push({
  country_code: '+971',
  to_full: ae_tel.to_full_ae_mobile_phone,
  format: ae_tel.format_ae_mobile_phone,
})
tel_handlers.push({
  country_code: '+91',
  to_full: in_tel.to_full_in_mobile_phone,
  format: in_tel.format_in_mobile_phone,
})
tel_handlers.push({
  country_code: '+81',
  to_full: jp_tel.to_full_jp_mobile_phone,
  format: jp_tel.format_jp_mobile_phone,
})
tel_handlers.push({
  country_code: '+60',
  to_full: my_tel.to_full_my_mobile_phone,
  format: my_tel.format_my_mobile_phone,
})
tel_handlers.push({
  country_code: '+1',
  to_full: us_tel.to_full_us_mobile_phone,
  format: us_tel.format_us_mobile_phone,
})
tel_handlers.push({
  country_code: '+34',
  to_full: es_tel.to_full_es_mobile_phone,
  format: es_tel.format_es_mobile_phone,
}) // 9 digits, no leading 0 - unique pattern
tel_handlers.push({
  country_code: '+84',
  to_full: vn_tel.to_full_vn_mobile_phone,
  format: vn_tel.format_vn_mobile_phone,
}) // Has unique 03x/05x prefixes
tel_handlers.push({
  country_code: '+66',
  to_full: th_tel.to_full_th_mobile_phone,
  format: th_tel.format_th_mobile_phone,
}) // Has unique 08x/09x prefixes
tel_handlers.push({
  country_code: '+61',
  to_full: au_tel.to_full_au_mobile_phone,
  format: au_tel.format_au_mobile_phone,
}) // Check before Belgium
tel_handlers.push({
  country_code: '+62',
  to_full: id_tel.to_full_id_mobile_phone,
  format: id_tel.format_id_mobile_phone,
}) // Variable length
tel_handlers.push({
  country_code: '+41',
  to_full: ch_tel.to_full_ch_mobile_phone,
  format: ch_tel.format_ch_mobile_phone,
}) // Check before France
tel_handlers.push({
  country_code: '+33',
  to_full: fr_tel.to_full_fr_mobile_phone,
  format: fr_tel.format_fr_mobile_phone,
}) // Check before Netherlands
tel_handlers.push({
  country_code: '+49',
  to_full: de_tel.to_full_de_mobile_phone,
  format: de_tel.format_de_mobile_phone,
})
tel_handlers.push({
  country_code: '+39',
  to_full: it_tel.to_full_it_mobile_phone,
  format: it_tel.format_it_mobile_phone,
})
tel_handlers.push({
  country_code: '+43',
  to_full: at_tel.to_full_at_mobile_phone,
  format: at_tel.format_at_mobile_phone,
})
tel_handlers.push({
  country_code: '+31',
  to_full: nl_tel.to_full_nl_mobile_phone,
  format: nl_tel.format_nl_mobile_phone,
}) // Most generic, check last
tel_handlers.push({
  country_code: '+32',
  to_full: be_tel.to_full_be_mobile_phone,
  format: be_tel.format_be_mobile_phone,
}) // Check after Australia
