/* eslint-disable @typescript-eslint/no-explicit-any */
// Thin adapter so the ported pages can keep react-router-style calls on top of TanStack Router.
import { forwardRef, useEffect, useMemo, type AnchorHTMLAttributes, type ReactNode } from "react";
import {
  Link as TLink,
  useNavigate as useTNavigate,
  useParams as useTParams,
  useLocation as useTLocation,
  useRouter,
} from "@tanstack/react-router";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  replace?: boolean;
  state?: unknown;
  children?: ReactNode;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, replace, state: _state, ...rest },
  ref,
) {
  const L = TLink as any;
  return <L ref={ref} to={to} replace={replace} {...rest} />;
});

export const NavLink = Link;

export function useNavigate() {
  const navigate = useTNavigate();
  const router = useRouter();
  return (to: string | number, opts?: { replace?: boolean; state?: unknown }) => {
    if (typeof to === "number") {
      router.history.go(to);
      return;
    }
    (navigate as any)({ to, replace: opts?.replace });
  };
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  return useTParams({ strict: false }) as T;
}

export function useLocation() {
  const loc = useTLocation();
  return {
    pathname: loc.pathname,
    search: loc.searchStr ?? "",
    hash: loc.hash ? `#${loc.hash}` : "",
    state: (loc.state as any)?.usr ?? null,
  };
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | Record<string, string>) => void] {
  const loc = useTLocation();
  const navigate = useTNavigate();
  const params = useMemo(() => new URLSearchParams(loc.searchStr ?? ""), [loc.searchStr]);
  const set = (next: URLSearchParams | Record<string, string>) => {
    const sp = next instanceof URLSearchParams ? next : new URLSearchParams(next);
    const qs = sp.toString();
    (navigate as any)({ href: `${loc.pathname}${qs ? `?${qs}` : ""}` });
  };
  return [params, set];
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const navigate = useTNavigate();
  useEffect(() => {
    (navigate as any)({ to, replace });
  }, [navigate, to, replace]);
  return null;
}
