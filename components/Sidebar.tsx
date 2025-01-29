"use client";
import dynamic from "next/dynamic";
import { HiUserCircle, HiClipboardList, HiCog, HiMenu } from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Image = dynamic(() => import("next/image"), { ssr: false });

export default function Sidebar({ collapsed, toggleSidebar }: { collapsed: boolean, toggleSidebar: () => void }) {
  const pathname = usePathname();
  const isActive = (path: string) =>
    pathname === path ? "bg-gray-200 font-semibold" : "";

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 shadow-sm transition-transform transform ${
        collapsed ? "-translate-x-full" : "translate-x-0"
      } ${collapsed ? "w-20" : "w-60"}`}
    >
      <div className="flex items-center justify-between py-6 px-4">
        <Link href="/">
          <Image src="/akaike-logo.svg" alt="Logo" width={collapsed ? 50 : 150} height={collapsed ? 50 : 150} />
        </Link>
        <button onClick={toggleSidebar} className="focus:outline-none">
          <HiMenu className="h-6 w-6 text-gray-700" />
        </button>
      </div>
      <nav className="space-y-4 px-4">
        <Link href="/self-evaluation">
          <div
            className={`flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer ${isActive(
              "/self-evaluation"
            )}`}
          >
            <HiUserCircle className="h-5 w-5 mr-3 text-blue-600" />
            {!collapsed && <span className="font-medium text-sm">Self Evaluation</span>}
          </div>
        </Link>
        <Link href="/team-evaluation">
          <div
            className={`flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer ${isActive(
              "/team-evaluation"
            )}`}
          >
            <HiClipboardList className="h-5 w-5 mr-3 text-blue-600" />
            {!collapsed && <span className="font-medium text-sm">Team Evaluation</span>}
          </div>
        </Link>
        <Link href="/settings">
          <div
            className={`flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer ${isActive(
              "/settings"
            )}`}
          >
            <HiCog className="h-5 w-5 mr-3 text-blue-600" />
            {!collapsed && <span className="font-medium text-sm">Settings</span>}
          </div>
        </Link>
      </nav>
    </div>
  );
}
