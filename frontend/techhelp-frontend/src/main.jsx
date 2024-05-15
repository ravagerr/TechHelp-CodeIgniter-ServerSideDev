import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserProvider'
import Browse from './pages/Browse'
import Question from './pages/Question'
import BrowseByTag from './pages/BrowseByTag'
import SearchResults from './pages/SearchResults'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout />}>
    <Route index element={<Home />} />
    <Route path='sign-in' element={<SignIn />} />
    <Route path='register' element={<Register />} />
    <Route path='profile/:id' element={<Profile />} />
    <Route path='browse' element={<Browse />} />
    <Route path='question/:slug' element={<Question />} />
    <Route path="/questions/tag/:tagName" element={<BrowseByTag />} />
    <Route path="/search" element={<SearchResults />} />
  </Route>
))

function App() {
  return (
    <RouterProvider router={router} />
  )
}

// wrap authprovider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <App />
      </UserProvider>
  </React.StrictMode>,
)
