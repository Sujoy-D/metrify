import { authenticate } from "../shopify.server";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const body = await request.json();
  const { productId, variantId, price, compareAtPrice } = body;

  if (!productId || !variantId || !price) {
    return new Response(JSON.stringify({ error: "productId, variantId, price required" }), { status: 400 });
  }

  const resp = await admin.graphql(
    `#graphql
    mutation UpdateVariantPrice($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        product { id }
        productVariants { id price compareAtPrice }
        userErrors { field message }
      }
    }`,
    {
      variables: {
        productId,
        variants: [
          {
            id: variantId,
            price,
            ...(compareAtPrice !== undefined ? { compareAtPrice } : {}),
          },
        ],
      },
    }
  );

  const { data, errors } = await resp.json();
  if (errors?.length) return new Response(JSON.stringify({ errors }), { status: 400 });

  const userErrors = data.productVariantsBulkUpdate.userErrors;
  if (userErrors?.length) return new Response(JSON.stringify({ userErrors }), { status: 400 });

  return Response.json({
    updated: data.productVariantsBulkUpdate.productVariants,
  });
}
