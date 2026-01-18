import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import Dashboard from "../dashboard/App";

// Make sure the user is authenticated inside Shopify Admin before rendering.
export const loader = async ({ request }: { request: Request }) => {
  await authenticate.admin(request);
  return null;
};

export default function AppIndex() {
  return <Dashboard />;
}

// Keeps Shopify/React Router boundary headers working as expected.
export const headers = (headersArgs: any) => boundary.headers(headersArgs);
