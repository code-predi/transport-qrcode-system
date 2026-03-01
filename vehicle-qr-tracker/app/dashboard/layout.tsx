import Sidebar from '@/components/Sidebar'
import DashboardHeader from '@/components/DashboardHeader'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (

    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{
        flex: 1,
        background: "#f7f3eb",
        minHeight: "100vh"
      }}>

        <DashboardHeader />

        <div>
          {children}
        </div>

      </div>

    </div>

  )

}