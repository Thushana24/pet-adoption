// app/register/page.tsx

import { RegisterForm } from "./RegisterForm";
import { MdPets } from "react-icons/md";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <main className="relative flex h-dvh w-full overflow-hidden  ">
      {/* Left side: image */}
      <div className="hidden flex-1 flex-col overflow-hidden  md:flex">
        <div className="relative flex flex-1 rounded-2xl overflow-hidden m-2">
          <Image
            src="https://images.pexels.com/photos/27497325/pexels-photo-27497325.jpeg"
            alt="Beautiful scenery"
            fill
            className="rounded-lg"
            priority
          />
        </div>
      </div>

      {/* Right side: register form with sticky header/footer */}
      <div className="flex w-full flex-1 flex-col items-center justify-center overflow-hidden md:w-1/2">
        <div className="flex h-full w-full flex-col @md:w-[45%]">
          {/* Sticky Header */}
          <header className="sticky top-0 z-10 flex flex-col sm:flex-row w-full sm:items-center sm:justify-between p-2">
            {/* logo and name */}
            <div className="flex sm:items-center sm:justify-center gap-2">
              <div className="w-min rounded-tl-xl rounded-br-xl bg-violet-700 stroke-white p-1 text-white">
                <div className="flex items-center justify-center relative size-10 rounded-tl-xl rounded-br-xl bg-white/40">
                  <MdPets className="size-6 w-full overflow-hidden object-cover" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-medium text-gray-800 dark:text-white">
                  AdoptNet
                </h2>
                <p className="text-[0.65rem] text-gray-600 dark:text-white/60">
                  Launch a life, Rescue a heart.
                </p>
              </div>
            </div>

            {/* right side */}
            <p className="text-xs font-medium text-gray-800 dark:text-white/60 mt-2 sm:mt-0">
              Already have an account?{" "}
              <a className="text-violet-900 hover:underline" href="/login">
                Login
              </a>
            </p>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5">
            <RegisterForm />
          </div>

          {/* Sticky Footer */}
          <footer className="sticky bottom-0 z-10 bg-white px-5 py-5 pt-0 dark:bg-[#03071e]">
            <div className="mx-auto w-full max-w-60 text-center text-[0.6rem] text-gray-500 dark:text-white/60">
              By clicking Continue you confirm that you agree{" "}
              <a
                target="_blank"
                className="text-primary-purple dark:text-secondary-purple hover:underline"
                href="#"
              >
                Privacy Policy
              </a>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
