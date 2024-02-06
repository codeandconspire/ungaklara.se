import { MARKETHYPE_API_KEY } from '$env/static/private'
import { fail } from '@sveltejs/kit'

export async function signup({ request }) {
  const { email, name, /* subscription, */ form } =
    /** @type {{ [key: string]: string }}  */ (
      Object.fromEntries(await request.formData())
    )
  if (!name) return fail(400, { signup: { email, form } })
  if (!email) return fail(400, { signup: { name, form } })

  const names = name.split(' ')
  const lastName = names.length > 1 ? names.pop() : ''
  const firstName = names.join(' ')

  try {
    const res = await fetch(
      'https://api.markethype.io/ingestion/v1/imports/contacts',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'X-API-TOKEN': MARKETHYPE_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contacts: [
            {
              firstName,
              lastName,
              emails: [email],
              consent: {
                subscriptionType: 'auto',
                legalBasis: 'freelyGiven',
                occurredAt: new Date()
              }
            }
          ]
        })
      }
    )

    if (!res.ok) {
      throw new Error('Kunde inte spara uppgifter.')
    }

    return { signup: { success: true, form } }
  } catch (err) {
    return fail(500, { signup: { success: false, name, email, form } })
  }
}
