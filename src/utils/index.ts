export const createPageUrl = (pageName?: string | null): string => {
  if (!pageName) return "#"; // fallback so <Link> doesn’t break
  return `/${pageName.toLowerCase()}`;
};
