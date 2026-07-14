import { Outlet } from 'react-router-dom'
import Sidebar from '../sections/dashboard/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-sf-bg font-sans text-sf-text">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto w-full max-w-6xl px-8 py-10 max-md:px-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
