import { error } from '@sveltejs/kit';
import { createClient } from '@prismicio/client';

export const prerender = 'auto';

export async function load({ fetch }) {
  try {
    const client = createClient('unga-klara', { fetch });
    const settings = await client.getSingle('settings')

    return { settings };
  } catch (err) {
    throw error(404, 'Not found');
  }
}
