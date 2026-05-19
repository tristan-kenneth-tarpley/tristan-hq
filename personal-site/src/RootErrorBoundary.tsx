import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { usePostHog } from "@posthog/react";

export default function RootErrorBoundary() {
  const error = useRouteError();
  const posthog = usePostHog();
  if (error) {
    posthog?.captureException(error);
  }
  if (isRouteErrorResponse(error)) {
    return <h1>{error.status} {error.statusText}</h1>;
  }
  if (error instanceof Error) {
    return <div><h1>Error</h1><p>{error.message}</p></div>;
  }
  return <h1>Unknown Error</h1>;
}
