"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

export function DisplayCard({
  className,
  icon = <Sparkles className="size-5 text-gold" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  titleClassName = "text-gold",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-56 w-[28rem] md:w-[32rem] lg:w-[40rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border border-white/10 bg-black/95 backdrop-blur-xl px-8 py-6 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[32rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-gold/30 hover:bg-black [&>*]:flex [&>*]:items-center [&>*]:gap-3",
        className
      )}
    >
      <div>
        <span className="relative flex items-center justify-center rounded-xl bg-gold/10 p-3 shadow-lg border border-gold/20">
          {icon}
        </span>
        <p className={cn("text-2xl font-bold ml-2", titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-normal text-lg md:text-xl text-gray-300 pr-12 leading-relaxed">{description}</p>
      <div className="absolute top-6 right-6 text-sm text-muted-foreground opacity-50">{date}</div>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700 min-h-[500px] lg:min-h-[600px] w-full pt-20 pb-40">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
