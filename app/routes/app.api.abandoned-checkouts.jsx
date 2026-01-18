import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const url = new URL(request.url);
  const first = Math.min(Number(url.searchParams.get("first") ?? 10), 50);

  const resp = await admin.graphql(
    `#graphql
    query Abandoned($first: Int!) {
      abandonedCheckouts(first: $first, reverse: true) {
        nodes {
          id
          createdAt
          updatedAt
          completedAt
          email
          totalPriceSet { shopMoney { amount currencyCode } }
          lineItems(first: 10) {
            nodes {
              title
              quantity
              variant { id title price product { id title } }
            }
          }
        }
      }
    }`,
    { variables: { first } }
  );

  const { data, errors } = await resp.json();
  if (errors?.length) return new Response(JSON.stringify({ errors }), { status: 400 });

  return Response.json({ items: data.abandonedCheckouts.nodes });
}
