'use client'

import { useRouter } from 'next/navigation'

type LogoutButtonProps = {
  collapsed?: boolean
}

export default function LogoutButton({ collapsed }: LogoutButtonProps) {

  const router = useRouter()

  const logout = async () => {

    await fetch('/api/auth/logout', {
      method: 'POST'
    })

    router.push('/login')

  }

  return (

    <div
      onClick={logout}
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "white",
        padding: "10px 0"
      }}
    >

      <span>🚪</span>

      {!collapsed && <span>Logout</span>}

    </div>

  )

}