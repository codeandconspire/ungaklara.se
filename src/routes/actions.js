import { ZAPIER_WEBHOOK_URL } from '$env/static/private'
import { fail } from '@sveltejs/kit'

export async function signup({ fetch, request }) {
  const { email, name, subscription, form } =
    /** @type {{ [key: string]: string }}  */ (
      Object.fromEntries(await request.formData())
    )
  if (!name) return fail(400, { signup: { email, form } })
  if (!email) return fail(400, { signup: { name, form } })

  const names = name.split(' ')
  const lastName = names.length > 1 ? names.pop() : ''
  const firstName = names.join(' ')
  const [date] = new Date().toJSON().split('T')

  try {
    const res = await fetch(ZAPIER_WEBHOOK_URL, {
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        date,
        email,
        firstName,
        lastName,
        subscription
      }),
      method: 'POST'
    })

    if (!res.ok) throw new Error('Failed to send to Zapier')

    return { signup: { success: true, form } }
  } catch (err) {
    return fail(500, { signup: { success: false, name, email, form } })
  }
}
