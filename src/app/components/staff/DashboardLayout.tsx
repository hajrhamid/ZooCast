import { 
  Outlet, 
  NavLink, 
  useNavigate 
} from 'react-router-dom';

import { 
  LayoutDashboard, 
  Clock, 
  Bell, 
  FileText, 
  LogOut, 
  User, 
  Cloud,
  ChevronDown
} from 'lucide-react';

import {
  useState,
  useEffect,
  useRef
} from 'react';

import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

import {
  getAuth
} from 'firebase/auth';

import { db } from '../../firebase/firebase';

export function DashboardLayout() {

  const navigate = useNavigate();

  const auth = getAuth();

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const [showProfile, setShowProfile] =
    useState(false);

  const [userData, setUserData] =
    useState<any>(null);

  const currentDate = new Date().toLocaleDateString(

    'en-US',

    {

      weekday: 'long',

      year: 'numeric',

      month: 'long',

      day: 'numeric'

    }

  );

  const currentTime = new Date().toLocaleTimeString(

    'en-US',

    {

      hour: '2-digit',

      minute: '2-digit'

    }

  );

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const currentUser =
          auth.currentUser;

        if (!currentUser) return;

        // ==========================================
        // SEARCH USER BY EMAIL
        // ==========================================

        const usersRef =
          collection(
            db,
            "users"
          );

        const q = query(

          usersRef,

          where(

            "email",

            "==",

            currentUser.email

          )

        );

        const querySnapshot =
          await getDocs(q);

        if (
          !querySnapshot.empty
        ) {

          const userDoc =
            querySnapshot.docs[0];

          setUserData(
            userDoc.data()
          );

        }

      }

      catch (error) {

        console.log(error);

      }

    };

    fetchUser();

  }, []);

  // ==========================================
  // CLOSE POPUP WHEN CLICK OUTSIDE
  // ==========================================

  useEffect(() => {

    const handleClickOutside = (
      event: MouseEvent
    ) => {

      if (

        dropdownRef.current &&

        !dropdownRef.current.contains(
          event.target as Node
        )

      ) {

        setShowProfile(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    navigate('/');

  };

  // ==========================================
  // NAVIGATION
  // ==========================================

  const navItems = [

    {

      to: '/dashboard',

      icon: LayoutDashboard,

      label: 'Dashboard',

      end: true

    },

    {

      to: '/dashboard/historical',

      icon: Clock,

      label: 'Historical Data'

    },

    {

      to: '/dashboard/alerts',

      icon: Bell,

      label: 'Alerts & Notifications'

    },

    {

      to: '/dashboard/reports',

      icon: FileText,

      label: 'Weather Reports'

    },

  ];

  return (

    <div className="min-h-screen bg-gray-50 flex">

      {/* SIDEBAR */}

      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">

        <div className="p-6 border-b border-gray-200">

          <div className="flex items-center gap-2">

            <div className="bg-orange-600 p-2 rounded-lg">

              <Cloud className="w-6 h-6 text-white" />

            </div>

            <h1 className="text-xl font-bold text-gray-800">

              ZooCast

            </h1>

          </div>

        </div>

        {/* MENU */}

        <nav className="flex-1 p-4 space-y-1">

          {navItems.map((item) => (

            <NavLink

              key={item.to}

              to={item.to}

              end={item.end}

              className={({ isActive }) =>

                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${

                  isActive

                    ? 'bg-orange-50 text-orange-700 font-medium'

                    : 'text-gray-600 hover:bg-gray-50'

                }`

              }

            >

              <item.icon className="w-5 h-5" />

              <span>{item.label}</span>

            </NavLink>

          ))}

        </nav>

        {/* LOGOUT */}

        <div className="p-4 border-t border-gray-200">

          <button

            onClick={handleLogout}

            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"

          >

            <LogOut className="w-5 h-5" />

            <span>Logout</span>

          </button>

        </div>

      </aside>

      {/* MAIN */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        <header className="bg-white border-b border-gray-200 px-8 py-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">

                {currentDate}

              </p>

              <p className="text-sm text-gray-500">

                {currentTime}

              </p>

            </div>

            {/* USER PROFILE */}

            <div
              className="relative"
              ref={dropdownRef}
            >

              <button

                onClick={() =>
                  setShowProfile(
                    !showProfile
                  )
                }

                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"

              >

                <User className="w-5 h-5 text-gray-600" />

                <span className="text-sm font-medium text-gray-700">

                  {userData?.staffId || "STF000"}

                </span>

                <ChevronDown className="w-4 h-4 text-gray-500" />

              </button>

              {/* POPUP */}

              {showProfile && (

                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-5 z-50">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">

                      <User className="w-6 h-6 text-orange-600" />

                    </div>

                    <div>

                      <h3 className="font-bold text-gray-800">

                        {userData?.fullName || "Unknown User"}

                      </h3>

                      <p className="text-sm text-gray-500">

                        {userData?.role || "No Role"}

                      </p>

                    </div>

                  </div>

                  <div className="space-y-3 text-sm">

                    <div className="flex justify-between">

                      <span className="text-gray-500">

                        Staff ID

                      </span>

                      <span className="font-medium text-gray-800">

                        {userData?.staffId || "-"}

                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-gray-500">

                        Email

                      </span>

                      <span className="font-medium text-gray-800 break-all">

                        {userData?.email || "-"}

                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-gray-500">

                        Status

                      </span>

                      <span className="font-medium text-green-600">

                        {userData?.status || "Inactive"}

                      </span>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <main className="flex-1 p-8 overflow-auto">

          <Outlet />

        </main>

      </div>

    </div>

  );

}