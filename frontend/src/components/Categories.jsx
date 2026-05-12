import React from 'react'
import { categories } from '../assets/data'

const Categories = ({ category, setCategory }) => {
  return (
    <section className='max-padd-container py-12 xl:py-16' id='shop'>
      <div className='flex flex-col items-center w-full'>
        <h2 className='bold-32 text-center mb-10 text-gray-800'>Shop by Categories</h2>
        <div className='w-full flex flex-wrap justify-center gap-6'>
          {categories.map((item) => (
            <div 
              onClick={() => setCategory(prev => prev === item.name ? "All" : item.name)}
              className={`
                flex flex-col items-center 
                p-6 rounded-3xl cursor-pointer 
                transition-all duration-200
                border border-gray-100
                w-[160px] 
                ${category === item.name ? 
                  'bg-amber-100 ring-2 ring-amber-300' : 
                  'bg-white hover:bg-gray-10'}
              `}
              id={item.name}
              key={item.name}
            >
              <div className='bg-white p-3 rounded-full mb-3 shadow-sm'>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className='w-8 h-8 object-contain' 
                />
              </div>
              <h4 className='medium-16 text-gray-700 text-center'>{item.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories