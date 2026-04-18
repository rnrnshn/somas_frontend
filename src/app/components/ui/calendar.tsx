"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const currentYear = new Date().getFullYear();
  const fromYear = props.fromYear ?? currentYear;
  const toYear = props.toYear ?? currentYear + 5;
  const [uncontrolledMonth, setUncontrolledMonth] = React.useState<Date>(props.month ?? new Date());
  const month = props.month ?? uncontrolledMonth;

  const handleMonthChange = (nextMonth: Date) => {
    if (props.month === undefined) {
      setUncontrolledMonth(nextMonth);
    }
    props.onMonthChange?.(nextMonth);
  };

  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(2020, index, 1);
    return {
      value: String(index),
      label: date.toLocaleString(undefined, { month: "long" }),
    };
  });

  const yearOptions = Array.from({ length: toYear - fromYear + 1 }, (_, index) => {
    const year = fromYear + index;
    return { value: String(year), label: String(year) };
  });

  const handleSelectMonth = (value: string) => {
    const next = new Date(month);
    next.setMonth(Number(value));
    handleMonthChange(next);
  };

  const handleSelectYear = (value: string) => {
    const next = new Date(month);
    next.setFullYear(Number(value));
    handleMonthChange(next);
  };

  return (
    <div className={cn("space-y-2 pt-2", className)}>
      <div className="flex items-center justify-center gap-2">
        <Select value={String(month.getMonth())} onValueChange={handleSelectMonth}>
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={String(month.getFullYear())} onValueChange={handleSelectYear}>
          <SelectTrigger className="h-8 w-[96px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DayPicker
        showOutsideDays={showOutsideDays}
        month={month}
        onMonthChange={handleMonthChange}
        fromYear={fromYear}
        toYear={toYear}
        className={cn("p-3 pt-2", classNames?.root)}
        classNames={{
          months: "flex flex-col sm:flex-row gap-2",
          month: "flex flex-col gap-4",
          caption: "hidden",
          caption_label: "hidden",
          nav: "hidden",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-x-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_start:
            "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
          day_range_end:
            "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "day-outside text-muted-foreground aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ className, ...props }) => (
            <ChevronLeft className={cn("size-4", className)} {...props} />
          ),
          IconRight: ({ className, ...props }) => (
            <ChevronRight className={cn("size-4", className)} {...props} />
          ),
        }}
        {...props}
      />
    </div>
  );
}

export { Calendar };
