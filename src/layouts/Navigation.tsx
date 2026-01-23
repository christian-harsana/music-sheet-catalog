import { useContext, useState } from "react";
import { NavLink } from "react-router";
import { AuthContext } from "../contexts/AuthContext";


export default function Navigation() {

  const {isAuthenticated, logout} = useContext(AuthContext);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState<boolean>(false);
  const mobileNavClass = isMobileNavVisible ? 'left-0' : '-left-9999';


  const handleNavigationToggle = () => {
    setIsMobileNavVisible(!isMobileNavVisible);
  }

  return (
    <nav className="h-full lg:w-full">
      <button type="button" onClick={handleNavigationToggle} className="p-3 rounded-full hover:bg-violet-500 lg:hidden">
          {
            !isMobileNavVisible ? (
              // Menu Icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" className="fill-gray-50">
                  {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                  <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/>
              </svg>
            ) : (
              // Close Icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="15" className="fill-gray-50">
                {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                <path d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/>
              </svg>
            )
          }
      </button>

      <div className={`${mobileNavClass} fixed top-14  w-full h-full z-50 px-4 py-5 bg-gray-950 overflow-hidden lg:relative lg:left-0 lg:top-0 lg:px-5 lg:py-0 lg:w-full`}>
        { 
          isAuthenticated ? 
          (
            <>
              <div className="mb-4">
                <ul>
                  <li className="my-1">
                    <NavLink to="/" className="flex flex-nowrap gap-3 rounded-md px-2.5 py-1 hover:bg-gray-400 [&.active]:bg-violet-500 [&.active:hover]:bg-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15" className="fill-gray-50" aria-hidden={true}>
                        {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                        <path d="M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z"/>
                      </svg>
                      <span>Dashboard</span>
                    </NavLink>
                  </li>
                  <li className="my-1">
                    <NavLink to="/sheets" className="flex flex-nowrap gap-3 rounded-md px-2.5 py-1 hover:bg-gray-400 [&.active]:bg-violet-500 [&.active:hover]:bg-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="15" className="fill-gray-50" aria-hidden={true}>
                        {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                        <path d="M381.9 388.2c-6.4 27.4-27.2 42.8-55.1 48-24.5 4.5-44.9 5.6-64.5-10.2-23.9-20.1-24.2-53.4-2.7-74.4 17-16.2 40.9-19.5 76.8-25.8 6-1.1 11.2-2.5 15.6-7.4 6.4-7.2 4.4-4.1 4.4-163.2 0-11.2-5.5-14.3-17-12.3-8.2 1.4-185.7 34.6-185.7 34.6-10.2 2.2-13.4 5.2-13.4 16.7 0 234.7 1.1 223.9-2.5 239.5-4.2 18.2-15.4 31.9-30.2 39.5-16.8 9.3-47.2 13.4-63.4 10.4-43.2-8.1-58.4-58-29.1-86.6 17-16.2 40.9-19.5 76.8-25.8 6-1.1 11.2-2.5 15.6-7.4 10.1-11.5 1.8-256.6 5.2-270.2 .8-5.2 3-9.6 7.1-12.9 4.2-3.5 11.8-5.5 13.4-5.5 204-38.2 228.9-43.1 232.4-43.1 11.5-.8 18.1 6 18.1 17.6 .2 344.5 1.1 326-1.8 338.5z"/>
                      </svg>
                      <span>Sheets</span>
                    </NavLink>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Settings</h3>
                <ul>
                  <li className="my-1">
                    <NavLink to="/sources" className="flex flex-nowrap gap-3 rounded-md px-2.5 py-1 hover:bg-gray-400 [&.active]:bg-violet-500 [&.active:hover]:bg-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15" className="fill-gray-50" aria-hidden={true}>
                        {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                        <path d="M256 141.3l0 309.3 .5-.2C311.1 427.7 369.7 416 428.8 416l19.2 0 0-320-19.2 0c-42.2 0-84.1 8.4-123.1 24.6-16.8 7-33.4 13.9-49.7 20.7zM230.9 61.5L256 72 281.1 61.5C327.9 42 378.1 32 428.8 32L464 32c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-35.2 0c-50.7 0-100.9 10-147.7 29.5l-12.8 5.3c-7.9 3.3-16.7 3.3-24.6 0l-12.8-5.3C184.1 490 133.9 480 83.2 480L48 480c-26.5 0-48-21.5-48-48L0 80C0 53.5 21.5 32 48 32l35.2 0c50.7 0 100.9 10 147.7 29.5z"/>
                      </svg>
                      <span>Sources</span>
                    </NavLink>
                  </li>
                  <li className="my-1">
                    <NavLink to="/levels" className="flex flex-nowrap gap-3 rounded-md px-2.5 py-1 hover:bg-gray-400 [&.active]:bg-violet-500 [&.active:hover]:bg-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15" className="fill-gray-50" aria-hidden={true}>
                        {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                        <path d="M488 56c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 400c0 13.3 10.7 24 24 24s24-10.7 24-24l0-400zM360 128c-13.3 0-24 10.7-24 24l0 304c0 13.3 10.7 24 24 24s24-10.7 24-24l0-304c0-13.3-10.7-24-24-24zM280 248c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 208c0 13.3 10.7 24 24 24s24-10.7 24-24l0-208zM152 320c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zM48 384c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24s24-10.7 24-24l0-48c0-13.3-10.7-24-24-24z"/>
                      </svg>
                      <span>Levels</span>
                    </NavLink>
                  </li>
                  <li className="my-1">
                    <NavLink to="/genres" className="flex flex-nowrap gap-3 rounded-md px-2.5 py-1 hover:bg-gray-400 [&.active]:bg-violet-500 [&.active:hover]:bg-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="15" className="fill-gray-50" aria-hidden={true}>
                        {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                        <path d="M401.2 39.1L549.4 189.4c27.7 28.1 27.7 73.1 0 101.2L393 448.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L515.3 256.8c9.2-9.3 9.2-24.4 0-33.7L367 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM32.1 229.5L32.1 96c0-35.3 28.7-64 64-64l133.5 0c17 0 33.3 6.7 45.3 18.7l144 144c25 25 25 65.5 0 90.5L285.4 418.7c-25 25-65.5 25-90.5 0l-144-144c-12-12-18.7-28.3-18.7-45.3zm144-85.5a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
                      </svg>
                      <span>Genres</span>
                    </NavLink>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Account</h3>
                <ul>
                  <li className="my-1">
                    <NavLink to="/profile" className="flex flex-nowrap gap-3 rounded-md px-2.5 py-1 hover:bg-gray-400 [&.active]:bg-violet-500 [&.active:hover]:bg-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15" className="fill-gray-50" aria-hidden={true}>
                        {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                        <path d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"/>
                      </svg>
                      <span>Profile</span>
                    </NavLink>
                  </li>
                  <li className="my-1">
                    <button type="button" className="flex flex-nowrap gap-3 rounded-md px-2.5 py-1 w-full hover:bg-gray-400" onClick={logout}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15" className="fill-gray-50" aria-hidden={true}>
                        {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                        <path d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0zM502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/>
                      </svg>
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) :
          (
            <div className="mb-3">
              <ul>
                <li className="my-1">
                  <NavLink to="/login" className="flex flex-nowrap gap-3 rounded-md px-2.5 py-1 hover:bg-gray-400 [&.active]:bg-violet-500 [&.active:hover]:bg-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15" className="fill-gray-50" aria-hidden={true}>
                      {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                      <path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/>
                    </svg>
                    Login
                  </NavLink>
                </li>
                <li className="my-1">
                  <NavLink to="/signup" className="flex flex-nowrap gap-3 rounded-md px-2.5 py-1 hover:bg-gray-400 [&.active]:bg-violet-500 [&.active:hover]:bg-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="15" className="fill-gray-50" aria-hidden={true}>
                      {/* !Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. */}
                      <path d="M136 128a120 120 0 1 1 240 0 120 120 0 1 1 -240 0zM48 482.3C48 383.8 127.8 304 226.3 304l59.4 0c98.5 0 178.3 79.8 178.3 178.3 0 16.4-13.3 29.7-29.7 29.7L77.7 512C61.3 512 48 498.7 48 482.3zM544 96c13.3 0 24 10.7 24 24l0 48 48 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-48 0 0 48c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-48-48 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0 0-48c0-13.3 10.7-24 24-24z"/>
                    </svg>
                    Sign Up
                  </NavLink>
                </li>
              </ul>
            </div>
          )
        }
      </div>
    </nav>
  )
}