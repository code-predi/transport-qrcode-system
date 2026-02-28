import { Suspense } from 'react'
import ScanClient from './ScanClient'

// CRITICAL: force dynamic rendering
export const dynamic = 'force-dynamic'

export default function ScanPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScanClient />
    </Suspense>
  )
}