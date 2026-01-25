export const formatDate = (isoDate: string | null): string => {
  if (!isoDate) return "Present";
  try {
    const date = new Date(isoDate);
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  } catch {
    return "Present";
  }
};

export const formatDateRange = (start: string | null, end: string | null): string => {
  if (!start) return "";
  const startFormatted = formatDate(start);
  const endFormatted = formatDate(end);
  return `${startFormatted} - ${endFormatted}`;
};

export const hasContent = (array: any[] | null | undefined): boolean => {
  return array !== null && array !== undefined && array.length > 0;
};

export const sortByOrder = <T extends { sort_order: number }>(items: T[]): T[] => {
  return [...items].sort((a, b) => a.sort_order - b.sort_order);
};

export const formatSkills = (skillCategory: {
  title: string;
  bullets: Array<{ content: string; sort_order: number }>;
}): string => {
  const sortedBullets = sortByOrder(skillCategory.bullets);
  return sortedBullets.map(b => b.content).join(', ');
};
