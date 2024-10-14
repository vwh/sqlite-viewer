import { formatDistanceToNow, format, isValid, parseISO } from "date-fns";

type DateFormatter = (dateValue: string) => string;

const createDateFormatter =
  (formatString: string): DateFormatter =>
  (dateValue: string) => {
    const date = parseISO(dateValue);
    return isValid(date) ? format(date, formatString) : dateValue;
  };

const formatDateRelative: DateFormatter = (dateValue: string) => {
  const date = parseISO(dateValue);
  return isValid(date)
    ? formatDistanceToNow(date, { addSuffix: true })
    : dateValue;
};

export const dateFormats: Record<
  string,
  { label: string; func: DateFormatter }
> = {
  formatDateRelative: {
    label: "Over 56 years ago",
    func: formatDateRelative
  },
  formatDateFormatted: {
    label: "January 9th, 1968",
    func: createDateFormatter("MMMM do, yyyy")
  },
  formatDateLong: {
    label: "1968/09/01",
    func: createDateFormatter("yyyy/MM/dd")
  },
  formatDateShort: {
    label: "01/09/1968",
    func: createDateFormatter("MM/dd/yyyy")
  }
};
