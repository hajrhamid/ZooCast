import { useEffect, useState } from 'react';

import {
  UserPlus,
  Key,
  XCircle,
  Search
} from 'lucide-react';

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  collection,
  addDoc,
  onSnapshot
} from "firebase/firestore";

import {
  auth,
  db
} from "../../../firebase/firebase";

interface Staff {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export function StaffManagement() {

  const [showAddModal, setShowAddModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const [staffId, setStaffId] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // REALTIME STAFF LIST
  const [staffList, setStaffList] = useState<any[]>([]);

  // FIREBASE REALTIME FETCH
  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "users"),

      (snapshot) => {

        const staffData: any[] = [];

        snapshot.forEach((doc) => {

          staffData.push({
            id: doc.data().staffId,
            name: doc.data().fullName,
            role: doc.data().role,
            status: doc.data().status
          });

        });

        setStaffList(staffData);

      }
    );

    return () => unsubscribe();

  }, []);

  // SEARCH FILTER
  const filteredStaff = staffList.filter((staff) =>
    staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ADD STAFF
  const handleAddStaff = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      // CREATE LOGIN ACCOUNT
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // SAVE TO FIRESTORE
      await addDoc(
        collection(db, "users"),
        {
          staffId,
          fullName,
          role,
          email,
          status: "Active",

          // ADMIN CHECK
          isAdmin: role === "Administrator"
        }
      );

      alert("Staff Added Successfully!");

      setShowAddModal(false);

      setStaffId('');
      setFullName('');
      setRole('');
      setEmail('');
      setPassword('');

    }

    catch (error: any) {

      console.log(error);

      alert(error.message);

    }

  };

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <h2 className="text-2xl text-gray-800">
          Staff Management
        </h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg"
        >

          <UserPlus className="w-4 h-4" />

          <span>Add Staff</span>

        </button>

      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

        <div className="relative">

          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder="Search by name or Staff ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">

        <table className="w-full">

          <thead className="bg-gray-50 border-b border-gray-200">

            <tr>

              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Staff ID
              </th>

              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Name
              </th>

              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Role
              </th>

              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Status
              </th>

              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-200">

            {filteredStaff.map((staff) => (

              <tr
                key={staff.id}
                className="hover:bg-gray-50 transition-colors"
              >

                <td className="px-6 py-4 text-sm text-gray-800">
                  {staff.id}
                </td>

                <td className="px-6 py-4 text-sm text-gray-800">
                  {staff.name}
                </td>

                <td className="px-6 py-4 text-sm text-gray-800">
                  {staff.role}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      staff.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >

                    {staff.status}

                  </span>

                </td>

                <td className="px-6 py-4">

                  <div className="flex items-center space-x-2">

                    <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1">

                      <Key className="w-4 h-4" />

                      <span>Reset</span>

                    </button>

                    <button className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1">

                      <XCircle className="w-4 h-4" />

                      <span>Deactivate</span>

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ADD STAFF MODAL */}
      {showAddModal && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">

            <h3 className="text-xl text-gray-800 mb-4">
              Add New Staff Member
            </h3>

            <form
              onSubmit={handleAddStaff}
              className="space-y-4"
            >

              {/* STAFF ID */}
              <div>

                <label className="block text-sm text-gray-700 mb-2">
                  Staff ID
                </label>

                <input
                  type="text"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="e.g., STF006"
                  required
                />

              </div>

              {/* FULL NAME */}
              <div>

                <label className="block text-sm text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="Enter full name"
                  required
                />

              </div>

              {/* ROLE */}
              <div>

                <label className="block text-sm text-gray-700 mb-2">
                  Role
                </label>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  required
                >

                  <option value="">
                    Select role
                  </option>

                  <option>
                    Administrator
                  </option>

                  <option>
                    Supervisor
                  </option>

                  <option>
                    Zookeeper
                  </option>

                  <option>
                    Veterinarian
                  </option>

                </select>

              </div>

              {/* EMAIL */}
              <div>

                <label className="block text-sm text-gray-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="staff@zoocast.com"
                  required
                />

              </div>

              {/* PASSWORD */}
              <div>

                <label className="block text-sm text-gray-700 mb-2">
                  Initial Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="Set initial password"
                  required
                />

              </div>

              {/* BUTTONS */}
              <div className="flex space-x-3 pt-4">

                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all"
                >
                  Add Staff
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}