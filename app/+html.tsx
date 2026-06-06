import { ScrollViewStyleReset } from 'expo-router/html'
import type { PropsWithChildren } from 'react'

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            height: auto !important;
            min-height: 100%;
            overflow-y: auto !important;
          }
          #root {
            height: auto !important;
            min-height: 100vh;
            overflow: visible !important;
          }
          /* Override React Navigation screen containers */
          #root > div,
          #root > div > div {
            position: static !important;
            height: auto !important;
            overflow: visible !important;
          }
        ` }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
