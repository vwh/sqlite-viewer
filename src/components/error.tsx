export default function ErrorMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-center text-red-400 font-semibold md:text-2xl p-10 border rounded mb-2">
      {children}
    </div>
  );
}
