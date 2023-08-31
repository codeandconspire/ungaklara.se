import { error } from '@sveltejs/kit';
import { createClient } from '@prismicio/client';
import { page as pageQuery } from '$lib/queries.js';

const graphQuery = `
    {
      page ${pageQuery}
    }
  `;

export async function load({ fetch }) {
  try {
    const client = createClient('unga-klara', { fetch });
    const [page] = await Promise.all([
      client.getByUID('page', 'start', { graphQuery })
    ]);

    return { page };
  } catch (err) {
    console.log(err);
    throw error(404, 'Not found');
  }
}
