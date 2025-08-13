// Format specific date
export const formatDate = (date: string): string => {
  const dateFormatted = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));

  return dateFormatted;
};
