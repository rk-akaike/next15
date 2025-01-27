"use client";
import { HiUserCircle, HiClipboardList, HiCog } from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) =>
    pathname === path ? "bg-gray-200 font-semibold" : "";

  return (
    <div className="w-60 h-screen bg-white border-r border-gray-200 shadow-sm">
      <div className="flex items-center justify-center py-6">
        <Link href="/">
          <Image src="/akaike-logo.svg" alt="Logo" width={150} height={150} />
        </Link>
      </div>
      <nav className="space-y-4 px-4">
        <Link href="/self-evaluation">
          <div
            className={`flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer ${isActive(
              "/self-evaluation"
            )}`}
          >
            <HiUserCircle className="h-5 w-5 mr-3 text-blue-600" />
            <span className="font-medium text-sm">Self Evaluation</span>
          </div>
        </Link>
        <Link href="/team-evaluation">
          <div
            className={`flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer ${isActive(
              "/team-evaluation"
            )}`}
          >
            <HiClipboardList className="h-5 w-5 mr-3 text-blue-600" />
            <span className="font-medium text-sm">Team Evaluation</span>
          </div>
        </Link>
        <Link href="/settings">
          <div
            className={`flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer ${isActive(
              "/settings"
            )}`}
          >
            <HiCog className="h-5 w-5 mr-3 text-blue-600" />
            <span className="font-medium text-sm">Settings</span>
          </div>
        </Link>
      </nav>
    </div>
  );
}
