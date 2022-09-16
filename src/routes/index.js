import { lazy, Suspense } from 'react'
import { Navigate, useLocation, useRoutes } from 'react-router-dom'
// layouts
import DashboardLayout from '../layouts/dashboard'
import LogoOnlyLayout from '../layouts/LogoOnlyLayout'
// guards
import AuthGuard from '../guards/AuthGuard'
import GuestGuard from '../guards/GuestGuard'
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config'
// components
import LoadingScreen from '../components/LoadingScreen'

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation()

  return (
    <Suspense
      fallback={
        <LoadingScreen isDashboard={pathname.includes('/dashboard')} />
      }>
      <Component {...props} />
    </Suspense>
  )
}

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        // {
        //   path: 'register',
        //   element: (
        //     <GuestGuard>
        //       <Register />
        //     </GuestGuard>
        //   ),
        // },
        // { path: 'login-unprotected', element: <Login /> },
        // { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'new-password', element: <NewPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'user',
          children: [
            {
              element: <Navigate to="/dashboard/user/all" replace />,
              index: true,
            },
            { path: 'all', element: <UserAll /> },
          ],
        },
        {
          path: 'book',
          children: [
            {
              element: <Navigate to="/dashboard/book/all" replace />,
              index: true,
            },
            { path: 'all', element: <BookAll /> },
            { path: 'new', element: <BookCreate /> },
            { path: ':code/edit', element: <BookCreate /> },
          ],
        },
        {
          path: 'borrow',
          children: [
            {
              element: <Navigate to="/dashboard/borrow/all" replace />,
              index: true,
            },
            { path: 'all', element: <BorrowAll /> },
            { path: 'new', element: <BorrowCreate /> },
            { path: ':_id/edit', element: <BorrowCreate /> },
          ],
        },
        { path: 'permission-denied', element: <PermissionDenied /> },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'pricing', element: <Pricing /> },
        { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      // element: <MainLayout />,
      // children: [
      //   { element: <HomePage />, index: true },
      //   { path: 'about-us', element: <About /> },
      //   { path: 'contact-us', element: <Contact /> },
      //   { path: 'faqs', element: <Faqs /> },
      // ],
      element: <Navigate to="/auth/login" replace />,
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ])
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')))
// const Register = Loadable(lazy(() => import('../pages/auth/Register')))
const ResetPassword = Loadable(
  lazy(() => import('../pages/auth/ResetPassword'))
)
const NewPassword = Loadable(lazy(() => import('../pages/auth/NewPassword')))
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')))

// DASHBOARD
// BOOK
const BookAll = Loadable(lazy(() => import('../pages/dashboard/BookAll')))
const BookCreate = Loadable(lazy(() => import('../pages/dashboard/BookCreate')))

// BORROW
const BorrowAll = Loadable(lazy(() => import('../pages/dashboard/BorrowAll')))
const BorrowCreate = Loadable(
  lazy(() => import('../pages/dashboard/BorrowCreate'))
)

// USER
const UserAll = Loadable(lazy(() => import('../pages/dashboard/UserAll')))

// TEST RENDER PAGE BY ROLE
const PermissionDenied = Loadable(
  lazy(() => import('../pages/dashboard/PermissionDenied'))
)

// MAIN
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')))
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')))
const Pricing = Loadable(lazy(() => import('../pages/Pricing')))
const Payment = Loadable(lazy(() => import('../pages/Payment')))
const Page500 = Loadable(lazy(() => import('../pages/Page500')))
const Page403 = Loadable(lazy(() => import('../pages/Page403')))
const Page404 = Loadable(lazy(() => import('../pages/Page404')))
