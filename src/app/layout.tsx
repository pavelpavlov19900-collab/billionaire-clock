import './globals.css'

export const metadata = {
  title: 'Billionaire Clock',
  description: 'Виж колко бързо милиардерите изкарват твоята заплата.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <body>{children}</body>
    </html>
  )
}
