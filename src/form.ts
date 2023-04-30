import { decodeResponse } from './response'

export type FormPrimitive = string | number | boolean | File

export interface FormObject {
  [key: string]: FormValue
}

export interface FormArray {
  readonly length: number

  [key: number]: FormValue
}

export type FormValue = FormPrimitive | FormObject | FormArray

/**
 * @description also support files in { [field: string]: File[] | File }
 * One use-case is for FileFieldsInterceptor in nest-client
 */
export function jsonToFormData(
  json: FormObject,
  formData: FormData = new FormData(),
) {
  Object.keys(json).forEach(key => {
    const value = json[key]
    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean':
        formData.append(key, value.toString())
        break
      default:
        if (isFile(value)) {
          formData.append(key, value as File)
        } else if (Array.isArray(value)) {
          value.forEach(value => formData.append(key, value))
        } else if (value) {
          let hasFile = false
          for (const [key, val] of Object.entries(value)) {
            if (isFile(val)) {
              hasFile = true
              formData.append(key, val)
            } else if (Array.isArray(val)) {
              for (const v of val) {
                if (isFile(v)) {
                  hasFile = true
                  formData.append(key, v)
                }
              }
            }
          }
          if (!hasFile) {
            formData.append(key, JSON.stringify(value))
          }
        }
    }
  })
  return formData
}

function isFile(value: unknown) {
  return typeof File !== 'undefined' && value instanceof File
}

export interface PostFormResponse<T> {
  status: number
  statusText: string
  data: Buffer | string | T
}

export function postMultipartFormData<T>(
  url: string,
  json: FormObject,
): Promise<PostFormResponse<T>> {
  const formData = new FormData()
  jsonToFormData(json, formData)
  return fetch(url, { method: 'POST', body: formData as any }).then(res =>
    decodeResponse(res).then((data): PostFormResponse<T> => {
      return {
        status: res.status,
        statusText: res.statusText,
        data: data as any,
      }
    }),
  )
}
