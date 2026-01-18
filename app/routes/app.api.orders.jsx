import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const url = new URL(request.url);
  const first = Math.min(Number(url.searchParams.get("first") ?? 10), 50);

  const resp = await admin.graphql(
    `#graphql
    query RecentOrders($first: Int!) {
      orders(first: $first, sortKey: CREATED_AT, reverse: true) {
        nodes {
          id
          name
          createdAt
          displayFinancialStatus
          totalPriceSet {
            shopMoney { amount currencyCode }
          }
        }
      }
    }`,
    { variables: { first } }
  );

  const { data, errors } = await resp.json();
  if (errors?.length) return new Response(JSON.stringify({ errors }), { status: 400 });

  return Response.json({ items: data.orders.nodes });
}
