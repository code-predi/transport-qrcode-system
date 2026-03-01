'use client'

import Link from 'next/link'
import { useState } from 'react'
import LogoutButton from './LogoutButton'

export default function Sidebar() {

  const [collapsed, setCollapsed] = useState(false)

  return (

    <div style={{
      width: collapsed ? 70 : 240,
      background: "#0B1F3A",
      color: "white",
      height: "100vh",
      transition: "0.2s",
      paddingTop: 20,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRight: "2px solid #C6A052"
    }}>

      {/* TOP SECTION */}
      <div>

        {/* Collapse Button */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          style={{
            padding: 15,
            cursor: "pointer",
            borderBottom: "1px solid #1e3a5f",
            fontSize: 18,
            fontWeight: "bold"
          }}
        >
          ☰
        </div>


        {/* MAIN DASHBOARD */}
        <NavItem
          href="/dashboard"
          label="Dashboard"
          collapsed={collapsed}
          icon="🏠"
        />


        {/* SCANNER */}
        <NavItem
          href="/dashboard/scan"
          label="Scan QR"
          collapsed={collapsed}
          icon="📷"
        />


        {/* ACTIVE VEHICLES */}
        <NavItem
          href="/dashboard/active"
          label="Active Vehicles"
          collapsed={collapsed}
          icon="🚗"
        />


        {/* TRIP HISTORY */}
        <NavItem
          href="/dashboard/history"
          label="Trip History"
          collapsed={collapsed}
          icon="📊"
        />


        {/* SHIFT CONTROL */}
        <NavItem
          href="/dashboard/shifts"
          label="Shift Control"
          collapsed={collapsed}
          icon="🕌"
        />


        {/* VEHICLE MANAGEMENT */}
        <NavItem
          href="/dashboard/vehicles"
          label="Vehicle Management"
          collapsed={collapsed}
          icon="🚙"
        />


        {/* CREATE VEHICLE */}
        <NavItem
          href="/dashboard/vehicles/new"
          label="Create Vehicle"
          collapsed={collapsed}
          icon="➕"
        />

      </div>


      {/* BOTTOM SECTION */}
      <div style={{
        padding: 15,
        borderTop: "1px solid #1e3a5f"
      }}>

        <LogoutButton collapsed={collapsed} />

      </div>

    </div>

  )

}


function NavItem({
  href,
  label,
  collapsed,
  icon
}: {
  href: string
  label: string
  collapsed: boolean
  icon: string
}) {

  return (

    <Link href={href} style={{ textDecoration: "none", color: "white" }}>

      <div style={{
        padding: 15,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 15,
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>

        <span style={{ fontSize: 18 }}>
          {icon}
        </span>

        {!collapsed && (
          <span>
            {label}
          </span>
        )}

      </div>

    </Link>

  )

}