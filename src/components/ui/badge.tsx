import type { OpportunityType } from '@/types/opportunity';

type BadgeClasses = {
  bg: string;
  text: string;
  border: string;
};

const TYPE_CLASSES: Record<OpportunityType, BadgeClasses> = {
  scholarship: { bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-200' },
  fellowship:  { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-200' },
  grant:       { bg: 'bg-emerald-100',text: 'text-emerald-800',border: 'border-emerald-200' },
  internship:  { bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-200' },
  conference:  { bg: 'bg-teal-100',   text: 'text-teal-800',   border: 'border-teal-200' },
  competition: { bg: 'bg-rose-100',   text: 'text-rose-800',   border: 'border-rose-200' },
  training:    { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
};

type OpportunityBadgeProps = {
  label: string;
  variant: OpportunityType;
};

export function OpportunityBadge({ label, variant }: OpportunityBadgeProps) {
  const { bg, text, border } = TYPE_CLASSES[variant] ?? TYPE_CLASSES.scholarship;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${bg} ${text} ${border}`}
    >
      {label}
    </span>
  );
}
