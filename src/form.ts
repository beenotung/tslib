import axios from 'axios';
import * as FormData from 'form-data';
import * as fetch from 'isomorphic-fetch';

export function jsonToFormData(json, formData: FormData) {
  Object.keys(json).forEach(key => {
    const value = json[key];
    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean':
        formData.append(key, value.toString());
        break;
      default:
        if (typeof File !== 'undefined' && value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach(value => formData.append(key, value));
        } else {
          formData.append(key, JSON.stringify(value));
        }
    }
  });
}

export interface PostFormResponse<T> {
  status: number;
  statusText: string;
  data: Buffer | string | any;
}

export function postMultipartFormData<T>(
  url: string,
  json,
): Promise<PostFormResponse<T>> {
  const formData = new FormData();
  jsonToFormData(json, formData);
  if (typeof window === 'undefined') {
    /* node.js */
    return fetch(url, { method: 'POST', body: formData as any }).then(
      async res => {
        const contentType = res.headers.get('content-type');
        if (
          contentType.startsWith('application/json') ||
          contentType.startsWith('text/json')
        ) {
          return {
            status: res.status,
            statusText: res.statusText,
            data: await res.json(),
          };
        }
        if (contentType.indexOf('form') !== -1) {
          return {
            status: res.status,
            statusText: res.statusText,
            data: await res.formData(),
          };
        }
        if (contentType.startsWith('text')) {
          return {
            status: res.status,
            statusText: res.statusText,
            data: await res.text(),
          };
        }
        return {
          status: res.status,
          statusText: res.statusText,
          data: await res.blob(),
        };
      },
    );
  }
  /* web browser */
  return axios({
    method: 'post',
    url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => ({
    status: res.status,
    statusText: res.statusText,
    data: res.data,
  }));
}
