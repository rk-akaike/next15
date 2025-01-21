import { HiUserCircle, HiClipboardList, HiCog } from "react-icons/hi";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-60 h-screen bg-white border-r border-gray-200 shadow-sm">
      <h1 className="text-2xl font-semibold text-center py-6 text-blue-600">
        Akaike
      </h1>
      <nav className="space-y-4 px-4">
        <Link href="/self-evaluation">
          <div className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
            <HiUserCircle className="h-5 w-5 mr-3 text-blue-600" />
            <span className="font-medium text-sm">Self Evaluation</span>
          </div>
        </Link>
        <Link href="/team-evaluation">
          <div className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
            <HiClipboardList className="h-5 w-5 mr-3 text-blue-600" />
            <span className="font-medium text-sm">Team Evaluation</span>
          </div>
        </Link>
        <Link href="/settings">
          <div className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
            <HiCog className="h-5 w-5 mr-3 text-blue-600" />
            <span className="font-medium text-sm">Settings</span>
          </div>
        </Link>
      </nav>
    </div>
  );
}
