export interface Env {
  RESEND_API_KEY: string;
  FORM_TO: string;
  FORM_FROM: string;
}

interface PagesFunctionContext {
  request: Request;
  env: Env;
}

const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_MESSAGE = 5000;

function fieldValue(formData: FormData, key: string, max: number): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function seeOtherThanks(): Response {
  return new Response(null, { status: 303, headers: { Location: "/thanks" } });
}

export const onRequestPost = async (context: PagesFunctionContext) => {
  const { env } = context;

  let formData: FormData;
  try {
    formData = await context.request.formData();
  } catch {
    return new Response("Invalid submission", { status: 400 });
  }

  // Honeypot: bots fill every field, humans never see this one. Answer 303 so
  // the bot cannot tell it was rejected.
  if (fieldValue(formData, "_gotcha", 100)) {
    return seeOtherThanks();
  }

  const name = fieldValue(formData, "name", MAX_NAME);
  const email = fieldValue(formData, "email", MAX_EMAIL);
  const message = fieldValue(formData, "message", MAX_MESSAGE);
  const site = fieldValue(formData, "_site", 100);

  if (!looksLikeEmail(email) || !message) {
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
      subject: `New message from ${site || "the contact form"}`,
      text: `Name: ${name || "(not given)"}\nEmail: ${email}\n\n${message}`,
      reply_to: email,
    }),
  });

  // Observability: a failed send shouldn't lose the visitor's message, but it must be
  // visible in `wrangler pages deployment tail`. Never log the API key or response body wholesale.
  if (!emailResponse.ok) {
    console.error(
      `Resend send failed: ${emailResponse.status} for _site=${site || "(none)"}`,
    );
    return new Response("Could not send your message. Please try again.", {
      status: 502,
    });
  }

  return seeOtherThanks();
};
