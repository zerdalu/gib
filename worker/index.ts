import type { ApiResponse } from "@shared/types/api-response";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono<{ Bindings: CloudflareBindings }>();

function resolveHttpErrorCode(status: number): string {
  switch (status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    case 422:
      return "UNPROCESSABLE_ENTITY";
    case 429:
      return "TOO_MANY_REQUESTS";
    default:
      return status >= 500 ? "INTERNAL_ERROR" : "HTTP_ERROR";
  }
}

app.get("/api/health", (c): Response => {
  const successResponse: ApiResponse<{
    readonly status: string;
    readonly service: string;
  }> = {
    success: true,
    data: {
      status: "healthy",
      service: "Gib",
    },
  };
  return c.json(successResponse, 200);
});

app.notFound((c): Response => {
  const notFoundResponse: ApiResponse<never> = {
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "The requested edge endpoint was not found",
    },
  };
  return c.json(notFoundResponse, 404);
});

app.onError((err, c): Response => {
  if (err instanceof HTTPException) {
    if (err.res) {
      return err.getResponse();
    }

    const isServerError = err.status >= 500;
    if (isServerError) {
      console.error("Worker HTTP error:", err);
    }

    const httpErrorResponse: ApiResponse<never> = {
      success: false,
      error: {
        code: resolveHttpErrorCode(err.status),
        message: isServerError ? "An internal server error occurred" : err.message || "Request failed",
      },
    };
    return c.json(httpErrorResponse, err.status);
  }

  console.error("Worker error:", err);
  const errorResponse: ApiResponse<never> = {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An internal server error occurred",
    },
  };
  return c.json(errorResponse, 500);
});

export default app;
