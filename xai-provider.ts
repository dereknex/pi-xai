import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { resolveXaiConfig } from "./xai-config.ts";
import { loginXai, refreshXaiToken, getXaiApiKeyFromCredentials } from "./xai-oauth.ts";

export function registerXaiProvider(api: ExtensionAPI) {
  const config = resolveXaiConfig();

  // xAI (Grok Build) provider for Coding Plan users — Responses API + native OAuth.
  // Models kept in sync with official Coding Plan (no fast/mini variants).
  api.registerProvider("grok-build", {
    baseUrl: config.xai.baseUrl,
    api: "openai-responses",
    authHeader: true,

    oauth: {
      name: "xAI (Grok Build)",
      // Enable PKCE callback server + manual redirect URL paste fallback in Pi core UI.
      // (usesCallbackServer is part of the full OAuthProviderInterface in @mariozechner/pi-ai;
      // cast to satisfy the ProviderConfig inline type in pi-coding-agent while still
      // allowing the core's interactive-mode to read it for showing onManualCodeInput.)
      usesCallbackServer: true,
      login: loginXai,
      refreshToken: refreshXaiToken,
      getApiKey: getXaiApiKeyFromCredentials,
    } as any,

    // Exact model list from Hermes PR #25941 for the Coding Plan.
    // No fast/mini variants — only what the Coding Plan officially exposes.
    models: [
      {
        id: "grok-build",
        name: "Grok Build (Coding Plan)",
        // grok-build is a special alias for Coding Plan users.
        // It does heavy reasoning internally but does NOT accept the public "reasoningEffort" parameter.
        // Declare reasoning: false so the core + our tools don't send it.
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 3.0, output: 15.0, cacheRead: 0.3, cacheWrite: 3.75 },
        contextWindow: 131072,
        maxTokens: 32768,
      },
      {
        id: "grok-4.3",
        name: "Grok 4.3 (Build)",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 3.0, output: 15.0, cacheRead: 0.3, cacheWrite: 3.75 },
        contextWindow: 131072,
        maxTokens: 32768,
      },
      {
        id: "grok-4.3-latest",
        name: "Grok 4.3 Latest (Build)",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 3.0, output: 15.0, cacheRead: 0.3, cacheWrite: 3.75 },
        contextWindow: 131072,
        maxTokens: 32768,
      },
    ],
  });
}
