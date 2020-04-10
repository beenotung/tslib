export function decodeResponse(res: Response) {
  const contentType = res.headers.get('content-type')
  if (!contentType) {
    return res.blob()
  }
  if (contentType.includes('json')) {
    return res.json()
  }
  if (contentType.includes('form')) {
    return res.formData()
  }
  if (contentType.startsWith('text')) {
    return res.text()
  }
  return res.blob()
}

export function is2xxResponseStatus(status: number): boolean {
  return 200 <= status && status < 300
}

export function is2xxResponse(res: { status: number }): boolean {
  return is2xxResponseStatus(res.status)
}
