import { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import Home from "./pages/Home";
import AttentionLab from "./pages/AttentionLab";
import RingAttention from "./pages/RingAttention";
import SelfAttention from "./pages/SelfAttention";
import Essays from "./pages/Essays";
import EssayPost from "./pages/EssayPost";
import RootErrorBoundary from "./RootErrorBoundary";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return <Outlet />;
}

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <ScrollToTop />,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, element: <Home /> },
      { path: "attention", element: <AttentionLab /> },
      { path: "ring-attention", element: <RingAttention /> },
      { path: "self-attention", element: <SelfAttention /> },
      { path: "essays", element: <Essays /> },
      { path: "essays/:slug", element: <EssayPost /> },
    ],
  },
];
