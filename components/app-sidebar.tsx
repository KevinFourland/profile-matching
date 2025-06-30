"use client"

import * as React from "react"
import {
  AudioWaveform,
  // BookOpen,
  // Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  // Settings2,
  // SquareTerminal,
  LayoutDashboard,
  Users,
  BarChart,
  Settings2,
  Swords
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { SidebarLogo } from "@/components/sidebar-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { NavProjects } from "./nav-projects"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      // items: [
      //   {
      //     title: "History",
      //     url: "#",
      //   },
      //   {
      //     title: "Starred",
      //     url: "#",
      //   },
      //   {
      //     title: "Settings",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Players",
      url: "/dashboard/players",
      icon: Users,
      // items: [
      //   {
      //     title: "Genesis",
      //     url: "#",
      //   },
      //   {
      //     title: "Explorer",
      //     url: "#",
      //   },
      //   {
      //     title: "Quantum",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Ranking",
      url: "/dashboard/ranking",
      icon: BarChart,
      // items: [
      //   {
      //     title: "Introduction",
      //     url: "#",
      //   },
      //   {
      //     title: "Get Started",
      //     url: "#",
      //   },
      //   {
      //     title: "Tutorials",
      //     url: "#",
      //   },
      //   {
      //     title: "Changelog",
      //     url: "#",
      //   },
      // ],
    },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    // items: [
    //   {
    //     title: "General",
    //     url: "#",
    //   },
    //   {
    //     title: "Team",
    //     url: "#",
    //   },
    //   {
    //     title: "Billing",
    //     url: "#",
    //   },
    //   {
    //     title: "Limits",
    //     url: "#",
    //   },
    // ],
    // },
  ],
  projects: [
    {
      name: "Profile Matching",
      url: "/dashboard/profile-matching-setting",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "Unknown",
            email: user?.email || "",
            avatar: user?.image || "/avatars/default.jpg", // fallback jika tidak ada
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
