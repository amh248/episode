"use client";

import { cn } from "@/lib/utils";

type Props = {
  value?: number | null;
  onChange?: (value: number | null) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
};

const sizes = { sm: "text-base", md: "text-xl", lg: "text-3xl" };

export function StarRating({ value, onChange, size = "md", readonly }: Props) {
  const stars = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  return (
    <div className={cn("inline-flex gap-0.5", sizes[size])} role="group" aria-label="Rating">
      {stars.map((star) => {
        const filled = value != null && star <= value;
        const half = value != null && star - 0.5 === value;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly || !onChange}
            onClick={() => onChange?.(value === star ? null : star)}
            className={cn(
              "leading-none transition-colors disabled:cursor-default",
              filled || half ? "text-lbd-orange" : "text-lbd-border hover:text-lbd-orange/60",
              !readonly && onChange && "cursor-pointer",
            )}
            aria-label={`${star} stars`}
          >
            {half ? "★" : filled ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}
