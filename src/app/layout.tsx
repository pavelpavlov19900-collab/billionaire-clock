import './globals.css'

export const metadata = {
  title: 'Billionaire Clock',
  description: 'Виж колко бързо милиардерите изкарват твоята заплата.',
  // 👇 ТОВА ДОБАВЯМЕ:
  icons: {
    icon: '/favicon.png', // Пътят към твоята нова прозрачна икона в папката /public
    apple: '/favicon.png', // За иконата на началния екран на iPhone
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <head>
        {/* Добавяме и този ред за всеки случай, за да сме 100% сигурни */}
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
