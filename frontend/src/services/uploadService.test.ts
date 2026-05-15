/**
 * @file uploadService.test.ts
 * @description 회귀 방지를 위한 테스트 파일입니다.
 * @lastModified 2026-05-15
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { uploadToCloudStorage } from "./uploadService";

describe("uploadToCloudStorage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns a simulated remote upload URL after the async delay", async () => {
    const upload = uploadToCloudStorage("data:image/jpeg;base64,test");

    await vi.advanceTimersByTimeAsync(1500);

    await expect(upload).resolves.toMatch(
      /^https:\/\/s3\.ap-northeast-2\.amazonaws\.com\/olfit-assets\/user-uploads\/aura-[a-z0-9]+\.jpg$/,
    );
  });
});

// EOF: uploadService.test.ts
