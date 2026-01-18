import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const url = new URL(request.url);
  const first = Math.min(Number(url.searchParams.get("first") ?? 25), 100);
  const after = url.searchParams.get("after");

  const resp = await admin.graphql(
    `#graphql
    query Products($first: Int!, $after: String) {
      products(first: $first, after: $after, sortKey: UPDATED_AT, reverse: true) {
        nodes {
          id
          title
          totalInventory
          variants(first: 25) {
            nodes {
              id
              title
              price
              compareAtPrice
              inventoryQuantity
              product { id title }
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }`,
    { variables: { first, after } }
  );

  const { data, errors } = await resp.json();
  if (errors?.length) return new Response(JSON.stringify({ errors }), { status: 400 });

  return Response.json({
    items: data.products.nodes,
    pageInfo: data.products.pageInfo,
  });
}
