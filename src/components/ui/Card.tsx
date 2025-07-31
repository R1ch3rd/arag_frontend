interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};