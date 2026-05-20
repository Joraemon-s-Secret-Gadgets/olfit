/**
 * @file ImageUploader.test.tsx
 * @description 회귀 방지를 위한 테스트 파일입니다.
 * @lastModified 2026-05-16
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ImageUploader from "./ImageUploader";


const originalImage = globalThis.Image;

class MockImage {
  width = 800;
  height = 600;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  set src(_value: string) {
    queueMicrotask(() => this.onload?.());
  }
}

describe("ImageUploader", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "Image", {
      value: MockImage,
      configurable: true,
    });

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
      "data:image/jpeg;base64,processed",
    );
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "Image", {
      value: originalImage,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it("describes image preparation without claiming an S3 upload", async () => {
    const file = new File(
      [new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00])],
      "style.jpg",
      { type: "image/jpeg" },
    );

    const onImageProcessed = vi.fn();
    const { container } = render(
      <ImageUploader onImageProcessed={onImageProcessed} isAnalyzing={false} />,
    );
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');

    expect(input).not.toBeNull();
    await userEvent.upload(input!, file);

    expect(screen.queryByText(/s3/i)).not.toBeInTheDocument();

    const startButton = await screen.findByRole("button", { name: /분석 시작/i });
    await waitFor(() => expect(startButton).toBeEnabled());
    await userEvent.click(startButton);

    expect(onImageProcessed).toHaveBeenCalledTimes(1);
    expect(onImageProcessed).toHaveBeenCalledWith(
      "data:image/jpeg;base64,processed",
    );
  });
});

// EOF: ImageUploader.test.tsx
