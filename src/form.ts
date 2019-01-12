import axios from 'axios';
import FormData = require('form-data');
import * as request from 'request';

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
        if (value instanceof File) {
          formData.append(key, value);
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
  if (typeof window === 'undefined') {
    /* node.js */
    return new Promise((resolve, reject) => {
      const req = request.post(url, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        resolve({
          status: response.statusCode,
          statusText: response.statusMessage,
          data: body,
        });
      });
      const formData = req.form();
      jsonToFormData(json, formData);
    });
  }
  /* web browser */
  const formData = new FormData();
  jsonToFormData(json, formData);
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
