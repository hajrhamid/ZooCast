import { useState } from "react";

import {
  Cloud,
  Leaf
} from "lucide-react";

import {
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  collection,
  getDocs
} from "firebase/firestore";

import {
  auth,
  db
} from "../firebase/firebase";

export function Login() {

  // ==========================================
  // STATES
  // ==========================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  // ==========================================
  // LOGIN FUNCTION
  // ==========================================

  const handleLogin =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        // ==========================================
        // FIREBASE AUTH LOGIN
        // ==========================================

        const userCredential =
          await signInWithEmailAndPassword(

            auth,

            email,

            password

          );

        const firebaseUser =
          userCredential.user;

        // ==========================================
        // GET USERS FROM FIRESTORE
        // ==========================================

        const querySnapshot =
          await getDocs(

            collection(
              db,
              "users"
            )

          );

        let foundUser: any =
          null;

        querySnapshot.forEach(
          (document) => {

            const data =
              document.data();

            // MATCH EMAIL

            if (
              data.email ===
              firebaseUser.email
            ) {

              foundUser =
                data;

            }

          }
        );

        // ==========================================
        // USER NOT FOUND
        // ==========================================

        if (!foundUser) {

          alert(
            "User data not found in Firestore"
          );

          return;

        }

        // ==========================================
        // STAFF ID NOT FOUND
        // ==========================================

        if (
          !foundUser.staffId
        ) {

          alert(
            "This user does not have a staff ID in Firestore"
          );

          return;

        }

        // ==========================================
        // SAVE USER DATA
        // ==========================================

        localStorage.setItem(

          "staffID",

          foundUser.staffId

        );

        localStorage.setItem(

          "userEmail",

          foundUser.email || ""

        );

        localStorage.setItem(

          "isAdmin",

          foundUser.isAdmin
            ? "true"
            : "false"

        );

        console.log(
          "LOGIN SUCCESS"
        );

        console.log(
          "STAFF ID:",
          foundUser.staffId
        );

        // ==========================================
        // REDIRECT
        // ==========================================

        if (
          foundUser.isAdmin
        ) {

          window.location.href =
            "/admin";

        }

        else {

          window.location.href =
            "/dashboard";

        }

      }

      catch (error: any) {

        console.log(error);

        alert(
          "Invalid email or password"
        );

      }

    };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4">

      {/* BACKGROUND ICONS */}

      <div className="absolute inset-0 overflow-hidden opacity-10">

        <div className="absolute top-20 left-20">

          <Leaf className="w-32 h-32 text-orange-600" />

        </div>

        <div className="absolute bottom-20 right-20">

          <Cloud className="w-40 h-40 text-sky-600" />

        </div>

        <div className="absolute top-1/2 left-1/3">

          <Leaf className="w-24 h-24 text-orange-500" />

        </div>

      </div>

      {/* LOGIN CARD */}

      <div className="w-full max-w-md relative z-10">

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">

          {/* HEADER */}

          <div className="text-center mb-8">

            <div className="flex items-center justify-center gap-2 mb-3">

              <div className="bg-orange-600 p-3 rounded-xl">

                <Cloud className="w-8 h-8 text-white" />

              </div>

              <h1 className="text-3xl font-bold text-gray-800">

                ZooCast

              </h1>

            </div>

            <p className="text-orange-700 font-medium">

              Smart Weather Monitoring for Zoo Environments

            </p>

          </div>

          {/* LOGIN FORM */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >

                Email

              </label>

              <input

                id="email"

                type="email"

                value={email}

                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }

                placeholder="staff@zoocast.com"

                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"

                required

              />

            </div>

            {/* PASSWORD */}

            <div>

              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >

                Password

              </label>

              <input

                id="password"

                type="password"

                value={password}

                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }

                placeholder="••••••••"

                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"

                required

              />

            </div>

            {/* BUTTON */}

            <button

              type="submit"

              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-md"

            >

              Login

            </button>

          </form>

          {/* FOOTER */}

          <p className="text-center text-sm text-gray-500 mt-6">

            Authorized zoo staff only.

          </p>

        </div>

      </div>

    </div>

  );

}