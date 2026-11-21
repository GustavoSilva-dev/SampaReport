import { jsonRequest } from './apiService'
import type { ReportRequestDTO } from '../types'

export async function createReport(reportData: ReportRequestDTO): Promise<unknown> {
  const response = await jsonRequest('POST', '/api/reports', reportData)
  const responseText = await response.text()
  let responseBody: unknown

  try {
    responseBody = responseText ? JSON.parse(responseText) : undefined
  } catch {
    responseBody = undefined
  }

  if (!response.ok) {
    if (typeof responseBody === 'object' && responseBody !== null) {
      if ('message' in responseBody) {
        throw new Error(String(responseBody.message))
      }

      if ('mensagem' in responseBody) {
        throw new Error(String(responseBody.mensagem))
      }

      if ('error' in responseBody) {
        throw new Error(String(responseBody.error))
      }
    }

    throw new Error(responseText || `A API retornou o erro ${response.status}.`)
  }

  return responseBody
}
