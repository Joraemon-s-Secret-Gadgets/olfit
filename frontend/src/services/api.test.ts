/**
 * @file api.test.ts
 * @description API service regression tests.
 * @lastModified 2026-05-19
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

type RequestConfig = { headers: Record<string, string> };

const mocks = vi.hoisted(() => ({
  post: vi.fn(),
  requestInterceptor: undefined as
    | ((config: RequestConfig) => RequestConfig)
    | undefined,
}));

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      post: mocks.post,
      interceptors: {
        request: {
          use: vi.fn((handler) => {
            mocks.requestInterceptor = handler;
          }),
        },
        response: {
          use: vi.fn(),
        },
      },
    })),
    isAxiosError: vi.fn(() => false),
  },
}));

describe("api request headers", () => {
  beforeEach(async () => {
    vi.resetModules();
    mocks.requestInterceptor = undefined;
    mocks.post.mockReset();
    localStorage.clear();
    sessionStorage.clear();

    await import("./api");
  });

  it("reads the anonymous session id from sessionStorage", () => {
    localStorage.setItem("olfit_session_id", "local-session");
    sessionStorage.setItem("olfit_session_id", "session-id");

    const config = mocks.requestInterceptor?.({ headers: {} });

    expect(config?.headers["X-Session-ID"]).toBe("session-id");
  });
});

// EOF: api.test.ts
