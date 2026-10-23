/** Accept internal URLs only, including when the browser normalizes URL syntax. */
export function safeLoginDestination(value: string | null): string {
  if (!value || !value.startsWith("/") || /[\\\u0000-\u0020\u007f]/.test(value)) return "/crm";
  try {
    const origin = "https://littlemahilam.invalid";
    const url = new URL(value, origin);
    if (url.origin !== origin || url.pathname.startsWith("//") || /^\/login(?:\/|$)/i.test(url.pathname)) return "/crm";
    // Encoded slashes and backslashes are not useful workspace destinations.
    if (/%(?:2f|5c|0[0-9a-f]|1[0-9a-f]|7f)/i.test(url.pathname)) return "/crm";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return "/crm"; }
}
