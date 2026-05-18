import { renderToStaticMarkup } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom";
import { routes } from "./App";

export async function render(url: string): Promise<string> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`http://ssr${url}`));

  if (context instanceof Response) return "";

  const router = createStaticRouter(handler.dataRoutes, context);

  return renderToStaticMarkup(
    <StaticRouterProvider router={router} context={context} hydrate={false} />
  );
}
