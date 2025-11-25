import Home from '../pages/Home.tsx';
import Settings from '../pages/Settings.tsx';
import Login from '../pages/Login.tsx';
import SignUp from '../pages/SignUp.tsx';
import Error from '../pages/Error.tsx';

const routes = [
    {
        path: "/",
        element: <Home />,
        errorElement: <Error />,
    },
    {
        path: "settings",
        protected: true,
        element: <Settings />,
    },
    {
        path: "login",
        element: <Login />,
    },
    {
        path: "signUp",
        element: <SignUp />,
    }
];

export default routes;