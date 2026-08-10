export interface Env {
  RESEND_API_KEY: string;
  FORM_TO: string;
  FORM_FROM: string;
}

interface PagesFunctionContext {
  request: Request;
  env: Env;
}

function fieldValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function looksLikeUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const onRequestPost = async (context: PagesFunctionContext) => {
  const formData = await context.request.formData();
  const { env } = context;

  const name = fieldValue(formData, "name");
  const email = fieldValue(formData, "email");
  const message = fieldValue(formData, "message");
  const site = fieldValue(formData, "_site");
  const n8nWebhook = fieldValue(formData, "_n8n");

  if (!email || !message) {
    return new Response("Invalid submission", { status: 400 });
  }

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.FORM_FROM,
      to: env.FORM_TO,
      subject: `New message from ${site || env.FORM_TO}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      reply_to: email,
    }),
  });

  // Observability: a failed send shouldn't lose the visitor's message, but it must be
  // visible in `wrangler pages deployment tail`. Never log the API key or response body wholesale.
  if (!emailResponse.ok) {
    console.error(
      `Resend send failed: ${emailResponse.status} for _site=${site || "(none)"}`,
    );
  }

  if (n8nWebhook && looksLikeUrl(n8nWebhook)) {
    try {
      await fetch(n8nWebhook, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
    } catch {
      // The webhook is best effort; email delivery remains the primary action.
    }
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/thanks",
    },
  });
};
