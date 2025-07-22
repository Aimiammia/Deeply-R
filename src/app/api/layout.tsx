// This layout isolates the API routes from the main app's RTL layout.
export default function ApiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
