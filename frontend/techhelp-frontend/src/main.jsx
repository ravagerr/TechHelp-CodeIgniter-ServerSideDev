import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import Profile from './pages/Profile'
import { UserProvider } from './context/UserProvider'
import Browse from './pages/Browse'
import Question from './pages/Question'
import BrowseByTag from './pages/BrowseByTag'
import SearchResults from './pages/SearchResults'
import ProtectedRoute from './components/ProtectedRoute'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout />}>
    <Route index element={<Home />} />
    <Route 
          path="/sign-in" 
          element={
              <ProtectedRoute redirectTo="/">
                  <SignIn />
              </ProtectedRoute>
          } 
      />
      <Route 
          path="/register" 
          element={
              <ProtectedRoute redirectTo="/">
                  <Register />
              </ProtectedRoute>
          } 
      />
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
