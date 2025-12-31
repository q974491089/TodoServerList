import { cn } from '../../utils/cn';

interface BackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function Background({ children, className }: BackgroundProps) {
  return (
    <div className={cn('app-background relative w-full', className)}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
