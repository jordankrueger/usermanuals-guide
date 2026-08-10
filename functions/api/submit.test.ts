import { describe, expect, it, vi, afterEach } from "vitest";
import { onRequestPost } from "./submit";

const env = {
  RESEND_API_KEY: "re_test",
  FORM_TO: "anthropic@pandemicsoul.com",
  FORM_FROM: "forms@jordankrueger.com",
};

function buildContext(fields: Record<string, string>) {
  return {
    request: new Request("https://x/api/submit", {
      method: "POST",
      body: new URLSearchParams(fields),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    }),
    env,
  };
}

function okFetch() {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(new Response(null, { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("onRequestPost", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends the submission to Resend and redirects to thanks", async () => {
    const fetchMock = okFetch();

    const response = await onRequestPost(
      buildContext({
        name: "Jordan",
        email: "jordan@example.com",
        message: "Hello",
        _site: "usermanuals.guide",
      }),
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer re_test",
          "content-type": "application/json",
        }),
      }),
    );

    const resendBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(resendBody).toMatchObject({
      to: env.FORM_TO,
      from: env.FORM_FROM,
      reply_to: "jordan@example.com",
    });
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/thanks");
  });

  it("returns 400 and does not fetch when email is missing", async () => {
    const fetchMock = okFetch();

    const response = await onRequestPost(
      buildContext({ name: "Jordan", message: "Hello" }),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the email is not a plausible address", async () => {
    const fetchMock = okFetch();

    const response = await onRequestPost(
      buildContext({ email: "not-an-email", message: "Hello" }),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("silently drops honeypot submissions without sending mail", async () => {
    const fetchMock = okFetch();

    const response = await onRequestPost(
      buildContext({
        name: "Bot",
        email: "bot@example.com",
        message: "spam",
        _gotcha: "filled in",
      }),
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/thanks");
  });

  it("surfaces a 502 when Resend rejects the send", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("nope", { status: 422 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await onRequestPost(
      buildContext({ email: "jordan@example.com", message: "Hello" }),
    );

    expect(response.status).toBe(502);
  });

  it("truncates an over-long message instead of forwarding it whole", async () => {
    const fetchMock = okFetch();

    await onRequestPost(
      buildContext({
        email: "jordan@example.com",
        message: "x".repeat(9000),
      }),
    );

    const resendBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(resendBody.text).toContain("x".repeat(5000));
    expect(resendBody.text).not.toContain("x".repeat(5001));
  });
});
