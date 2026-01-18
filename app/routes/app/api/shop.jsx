import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const resp = await admin.graphql(`#graphql
    query {
      shop { name currencyCode myshopifyDomain }
    }
  `);

  const { data, errors } = await resp.json();
  if (errors?.length) return new Response(JSON.stringify({ errors }), { status: 400 });
  return Response.json(data);
}
