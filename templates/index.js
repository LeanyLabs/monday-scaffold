import path from "path";

export function getUrlToTemplates() {
  return path.normalize(__dirname);
}
