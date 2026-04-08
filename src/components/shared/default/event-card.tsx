import { formatDateTime } from "@/lib/utils";

const EventCard = ({
  date,
  title,
  description,
}: {
  date: string;
  title: string;
  description: string;
}) => {
  return (
    <article>
      <time className="flex items-center text-sm font-semibold leading-6 text-chart-2">
        <span className="mx-4 h-3 w-3 bg-chart-2 rounded-full"></span>
        {formatDateTime(date, "PPP")}
        <div className="lg:block hidden -ml-2 h-px w-screen -translate-x-full border-t border-neutral-black/50 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"></div>
      </time>
      <div className="ml-4">
        <h1 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-sm font-normal leading-7 text-muted-foreground">
          {description}
        </p>
      </div>
    </article>
  );
};

export default EventCard;
