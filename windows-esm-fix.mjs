import path from "node:path";

function windowsAbsolutePathToFileUrl(specifier) {
  const normalizedSpecifier = specifier.replaceAll("\\", "/");
  if (normalizedSpecifier.startsWith("//")) {
    const [host, ...segments] = normalizedSpecifier.slice(2).split("/");
    const encodedPath =
      segments.length > 0 ? `/${segments.map((segment) => encodeURIComponent(segment)).join("/")}` : "/";
    return `file://${host}${encodedPath}`;
  }
  const drivePrefix = normalizedSpecifier.slice(0, 2);
  const encodedPath = normalizedSpecifier
    .slice(2)
    .split("/")
    .map((segment, index) => (index === 0 && segment === "" ? "" : encodeURIComponent(segment)))
    .join("/");
  return `file:///${drivePrefix}${encodedPath}`;
}

function toSafeWindowsEsmSpecifier(specifier) {
  if (typeof specifier !== "string" || specifier.startsWith("file://")) {
    return specifier;
  }
  if (!path.win32.isAbsolute(specifier)) {
    return specifier;
  }
  return windowsAbsolutePathToFileUrl(specifier);
}

export async function resolve(specifier, context, nextResolve) {
  return nextResolve(toSafeWindowsEsmSpecifier(specifier), context);
}

export const __testing = {
  toSafeWindowsEsmSpecifier,
};
