
// This layout ensures that the lock screen page inherits the root layout's styles
// such as background colors, fonts, and theme settings, fixing the black screen issue.

export default function LockLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
