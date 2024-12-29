import { Analytics } from "@vercel/analytics/react"
import { Sidebar } from '@/components/Sidebar'
import LoadingModal from '@/components/Popover'
import '@/styles/globals.css'

export const metadata = {
  title: 'The Electoral Commission Assistant',
  description: 'The Electoral Commission Assistant is an AI-powered tool that helps you understand the rules and regulations of the UK Electoral Commission.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-slate-200">
          <Sidebar />
          <div className="flex-1 lg:ml-64">
            <main className="h-full overflow-x-hidden overflow-y-auto bg-white pt-[52px] lg:pt-0">
              <div className="mx-auto py-8 px-4">
                {children}
              </div>
            </main>
          </div>
          <LoadingModal />
        </div>
        <Analytics />
      </body>
    </html>
  )
}