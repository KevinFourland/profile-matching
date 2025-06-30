'use client'

import { Swords } from 'lucide-react'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import Link from 'next/link'

export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          {/* as a menu button, shadcn will hide everything but the icon when collapsed */}
          <Link href="/" className="flex items-center space-x-2 py-3">
            <Swords className="h-6 w-6 text-sidebar-foreground" />
            <span className="text-lg font-semibold text-sidebar-foreground">
              PlayerMatch
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
