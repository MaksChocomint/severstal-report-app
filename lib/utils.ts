export const getInitialDateTimeForInput = (offsetHours: number = 0): string => {
  const date = new Date();
  date.setTime(date.getTime() + offsetHours * 60 * 60 * 1000);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const convertDateTimeLocalToISO = (
    dtLocalString: string | undefined
  ): string | undefined => {
    if (!dtLocalString) return undefined;
    try {
      return new Date(dtLocalString).toISOString();
    } catch (e) {
      console.warn(`Invalid date string for conversion: ${dtLocalString}`, e);
      return dtLocalString;
    }
  };