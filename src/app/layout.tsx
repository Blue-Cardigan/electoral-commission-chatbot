import { Analytics } from "@vercel/analytics/react"
import { Sidebar } from '@/components/Sidebar'
import LoadingModal from '@/components/Popover'
import '@/styles/globals.css'

export const metadata = {
  title: 'Your App Name',
  description: 'Your app description'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex bg-slate-200 w-full">
          <Sidebar />
          <div className="flex-grow lg:ml-64">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
              <div className="mx-auto py-8">
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