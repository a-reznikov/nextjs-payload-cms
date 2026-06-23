import {
  RegisterClassSubmissionStatus,
  type RegisterClassFormValues,
  type RegisterClassSubmissionError,
  type RegisterClassSubmissionSuccess,
} from './types'

export const submitRegistration = async (
  values: RegisterClassFormValues,
): Promise<RegisterClassSubmissionSuccess> => {
  const response = await fetch('/api/register-class', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

  const result = (await response.json()) as RegisterClassSubmissionSuccess | RegisterClassSubmissionError

  if (!response.ok || result.status === RegisterClassSubmissionStatus.ERROR) {
    const message = result.message || 'We could not submit your registration. Please try again.'

    throw {
      ...result,
      message,
      status: RegisterClassSubmissionStatus.ERROR,
    } satisfies RegisterClassSubmissionError
  }

  return result
}
