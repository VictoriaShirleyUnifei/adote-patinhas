import Header from "@/components/Header/Header";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="container mx-auto py-6 px-4">
        {children}
      </div>
    </>
  );
}