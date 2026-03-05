import { daysUntilDeadline } from '@/lib/utils';

type DeadlineBadgeProps = {
  deadline: string | null;
};

export function DeadlineBadge({ deadline }: DeadlineBadgeProps) {
  const days = daysUntilDeadline(deadline);

  if (days === null) {
    return (
      <span className="text-sm font-medium text-gray-500">
        Rolling
      </span>
    );
  }

  if (days < 0) {
    return (
      <span className="text-sm font-medium text-slate-400 line-through">
        Expired
      </span>
    );
  }

  if (days <= 3) {
    return (
      <span className="text-sm font-medium text-red-600">
        {days} day{days === 1 ? '' : 's'} left!
      </span>
    );
  }

  if (days <= 7) {
    return (
      <span className="text-sm font-medium text-amber-600">
        {days} days left
      </span>
    );
  }

  return (
    <span className="text-sm font-medium text-emerald-600">
      {days} days left
    </span>
  );
}
