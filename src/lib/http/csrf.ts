export function getCookieValue(name: string) {
  if (typeof document === "undefined") return "";

  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] ?? ""
  );
}

export function getCsrfToken() {
  return decodeURIComponent(
    getCookieValue("csrf_token") || getCookieValue("XSRF-TOKEN") || "1",
  );
}
