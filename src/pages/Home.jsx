import React from 'react'
import banner from '../assets/banner.png'
import bannerMobile from '../assets/mobile banner.png'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import printImage from '../assets/instant printout.png'
import giftPackImage from '../assets/gift pack.png'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id,cat)=>{
      // console.log(id,cat)
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })

        return filterData ? true : null
      })
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

      navigate(url)
      // console.log(url)
  }


  return (
    
   <section className='bg-white'>
  
      <div className='container mx-auto'>
          <div className={`w-full p-2 bg-blue-100 rounded ${!banner && "animate-pulse my-2" } `}>
              <Link to={'/Fruits---Vegetables-68fb307fcbb7b14d7ee50d7b/Certified-Organic-68fb8ab45b6d5102c1a49be6'}>
              <img
                src={banner}
                className='w-full h-60 hidden lg:block rounded-md'
                alt='banner' 
              />
              
              <img
                src={bannerMobile}
                className='w-full h-full lg:hidden mt-2 rounded-md'
                alt='banner' 
              />
            </Link>
          </div>
      </div>

     

    {/* 🔵 SERVICES SECTION */}
<div className="container mx-auto mt-4 px-2">

  <h2 className="text-2xl font-semibold mb-4">Special Services</h2>

  <div className="flex flex-wrap gap-4 justify-center">

    {/* 🖨️ Printout Suvidha Card */}
    <div className="w-full sm:w-[48%] lg:w-[45%] bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow hover:shadow-md transition">
  <h2 className="text-xl font-semibold mb-2">🖨️ Printout Suvidha</h2>

  <p className="text-gray-600 mb-4">
    PDF ya image upload karein – hum aapka print nikal kar turant deliver kar denge.
  </p>

  {/* Responsive Image */}
  <img
    src={printImage}
    alt="print service"
    className="
      w-full 
      h-32 
      sm:h-40 
      lg:h-48 
      object-contain 
      mb-4
    "
  />

  <Link to="/printout-service">
    <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
      Printout Upload Kare
    </button>
  </Link>
</div>


    {/* 🎁 Gift Pack Service Card */}
    <div className="w-full sm:w-[48%] lg:w-[45%] bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl shadow hover:shadow-md transition">
      <h2 className="text-xl font-semibold mb-2">🎁 Gift Pack Service</h2>
      <p className="text-slate-950 mb-4">
        Birthday, Anniversary ya kisi special occasion ke liye beautiful gift packs available.
      </p>
      {/* Responsive Image */}
  <img
    src={giftPackImage}
    alt="print service"
    className="
      w-full 
      h-32 
      sm:h-40 
      lg:h-48 
      object-contain 
      mb-4
    "
  />

      <div className="flex gap-3">
        <Link to="/gift-pack">
          <button className="bg-pink-600 text-white px-5 py-2 rounded-lg hover:bg-pink-700">
            Gift Pack Dekhein
          </button>
        </Link>

        <Link to="/gift-customize">
          <button className="border border-pink-600 text-pink-700 px-5 py-2 rounded-lg hover:bg-pink-600 hover:text-white">
            Customize Kare
          </button>
        </Link>
      </div>
    </div>

  </div>
</div>

      
      <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10  gap-2'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((c,index)=>{
                return(
                  <div key={index+"loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                    <div className='bg-blue-100 min-h-24 rounded'></div>
                    <div className='bg-blue-100 h-8 rounded'></div>
                  </div>
                )
              })
            ) : (
              categoryData.map((cat,index)=>{
                return(
                  <div key={cat._id+"displayCategory"} className='w-full h-full' onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}>
                    <div>
                        <img 
                          src={cat.image}
                          className='w-full h-full object-scale-down'
                        />
                    </div>
                  </div>
                )
              })
              
            )
          }
      </div>

      {/***display category product */}
      {
        categoryData?.map((c,index)=>{
          return(
            <CategoryWiseProductDisplay 
              key={c?._id+"CategorywiseProduct"} 
              id={c?._id} 
              name={c?.name}
            />
          )
        })
      }



   </section>
  )
}

export default Home
