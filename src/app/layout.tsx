import './globals.css'
import Script from 'next/script' // 👈 Внасяме Script компонента

export const metadata = {
  title: 'Billionaire Clock',
  description: 'Виж колко бързо милиардерите изкарват твоята заплата.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
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
        <link rel="icon" href="/favicon.png" />
        
        {/* 🚀 TRAVELPAYOUTS VERIFICATION SCRIPT */}
        <Script id="travelpayouts-verification" strategy="afterInteractive">
          {`
            (function () {
                var script = document.createElement("script");
                script.async = 1;
                script.src = 'https://emrldco.com/NTE3NTk0.js?t=517594';
                document.head.appendChild(script);
            })();
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
