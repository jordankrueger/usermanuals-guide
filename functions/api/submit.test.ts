import { describe, expect, it, vi, afterEach } from "vitest";
import { onRequestPost } from "./submit";

const env = {
  RESEND_API_KEY: "re_test",
  FORM_TO: "jordan@jordankrueger.com",
  FORM_FROM: "forms@example.com",
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

describe("onRequestPost", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends the submission to Resend and redirects to thanks", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await onRequestPost(
      buildContext({
        name: "Jordan",
        email: "jordan@example.com",
        message: "Hello",
        _site: "Carrd Starter",
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
    });
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/thanks");
  });

  it("returns 400 and does not fetch when email is missing", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await onRequestPost(
      buildContext({
        name: "Jordan",
        message: "Hello",
        _site: "Carrd Starter",
      }),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts to n8n webhook when _n8n is present", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const webhookUrl = "https://n8n.example.com/webhook/form";

    const response = await onRequestPost(
      buildContext({
        name: "Jordan",
        email: "jordan@example.com",
        message: "Hello",
        _site: "Carrd Starter",
        _n8n: webhookUrl,
      }),
    );

    expect(response.status).toBe(303);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      webhookUrl,
      expect.objectContaining({
        method: "POST",
      }),
    );
  });
});
