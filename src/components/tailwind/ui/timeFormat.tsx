import { useEffect, useState } from "react";

export const TimeFormat = ({
  date,
  className,
  options: { relative = false, locale = "en-US" },
  dateTimeOptions,
}: {
  date: Date;
  className?: string;
  options: {
    relative?: boolean;
    locale?: string;
  };
  dateTimeOptions?: Intl.DateTimeFormatOptions;
}) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (relative) {
      const id = setInterval(() => {
        setText(getRelativeTimeString(date));
      }, 1000);

      return () => clearInterval(id);
    } else {
      setText(date.toLocaleString(locale, dateTimeOptions));
    }
  }, [date]);
  
  return <time className={className} dateTime={date.toISOString()}>{text}</time>;
};

// Credit: https://www.builder.io/blog/relative-time
export function getRelativeTimeString(
  date: Date | number,
  lang = navigator.language
): string {
  const timeMs = typeof date === "number" ? date : date.getTime();

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  // Array reprsenting one minute, hour, day, week, month, etc in seconds
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

  // Array equivalent to the above but in the string representation of the units
  const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour", "day", "week", "month", "year"];

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}