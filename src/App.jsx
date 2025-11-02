import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import fetchUserDetails from './utils/fetchUserDetails'
import { setUserDetails } from './store/userSlice'
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice'
import { useDispatch } from 'react-redux'
import Axios from './utils/Axios'
import SummaryApi from './common/SummaryApi'
import GlobalProvider from './provider/GlobalProvider'
import CartMobileLink from './components/CartMobile'
import Loader from './components/Loader'

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const userData = await fetchUserDetails()
      if (userData && userData.data) {
        dispatch(setUserDetails(userData.data))
      } else {
        console.log("User not logged in or unauthorized")
      }
    } catch (error) {
      console.log("Error fetching user details:", error)
    }
  }

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({ ...SummaryApi.getCategory })
      const responseData = response?.data
      if (responseData?.success) {
        dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
      }
    } catch (error) {
      console.log("Error fetching categories:", error)
    } finally {
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getSubCategory })
      const responseData = response?.data
      if (responseData?.success) {
        dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
      }
    } catch (error) {
      console.log("Error fetching subcategories:", error)
    }
  }

  useEffect(() => {
    const initApp = async () => {
      await Promise.all([fetchUser(), fetchCategory(), fetchSubCategory()])
      setLoading(false) 
    }
    initApp()
  }, [])

  if (loading) return <Loader />

  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {location.pathname !== '/checkout' && <CartMobileLink />}
    </GlobalProvider>
  )
}

export default App
