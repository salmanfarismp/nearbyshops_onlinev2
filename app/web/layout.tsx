export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Centre a phone-width column; the outer bg shows on tablets/small desktops
    // that slip past the middleware (e.g. developer previews).
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-[430px] bg-white min-h-screen relative overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
