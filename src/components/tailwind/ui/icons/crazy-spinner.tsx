const CrazySpinner = () => {
  return (
    <div className="flex items-center justify-center gap-0.5">
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[hsl(var(--primary))] [animation-delay:-0.3s]" />
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[hsl(var(--primary))] [animation-delay:-0.15s]" />
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[hsl(var(--primary))]" />
    </div>
  );
};

export default CrazySpinner;
