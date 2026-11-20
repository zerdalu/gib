import app from "@worker/index";
import * as v from "valibot";
import { describe, expect, it } from "vitest";

const HealthResponseSchema = v.object({
  success: v.literal(true),
  data: v.object({
    status: v.string(),
    service: v.string(),
  }),
});

const ErrorResponseSchema = v.object({
  success: v.literal(false),
  error: v.object({
    code: v.string(),
    message: v.string(),
  }),
});

describe("worker API", () => {
  it("returns healthy status on GET /api/health", async (): Promise<void> => {
    const response = await app.request("/api/health");
    expect(response.status).toBe(200);

    const raw: unknown = await response.json();
    const payload = v.parse(HealthResponseSchema, raw);

    expect(payload).toEqual({
      success: true,
      data: {
        status: "healthy",
        service: "Gib",
      },
    });
  });

  it("returns JSON 404 for exact /api", async (): Promise<void> => {
    const response = await app.request("/api");
    expect(response.status).toBe(404);

    const raw: unknown = await response.json();
    const payload = v.parse(ErrorResponseSchema, raw);

    expect(payload).toEqual({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "The requested edge endpoint was not found",
      },
    });
  });

  it("returns JSON 404 for unknown /api routes", async (): Promise<void> => {
    const response = await app.request("/api/does-not-exist");
    expect(response.status).toBe(404);

    const raw: unknown = await response.json();
    const payload = v.parse(ErrorResponseSchema, raw);

    expect(payload).toEqual({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "The requested edge endpoint was not found",
      },
    });
  });
});
