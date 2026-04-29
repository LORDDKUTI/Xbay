// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// const SearchBar = ({ initial = '' }) => {
//   const [query, setQuery] = useState(initial)
//   const [compact, setCompact] = useState(false)
//   const navigate = useNavigate()

//   useEffect(() => {
//     const onScroll = () => setCompact(window.scrollY > 60)
//     window.addEventListener('scroll', onScroll, { passive: true })
//     return () => window.removeEventListener('scroll', onScroll)
//   }, [])

//   const onSubmit = (e) => {
//     e.preventDefault()
//     const q = query.trim()
//     if (!q) return
//     navigate(`/products?search=${encodeURIComponent(q)}`)
//   }

//   return (
//     <header
//       className={`sticky top-0 z-40 bg-white transition-shadow duration-150 ${
//         compact ? 'shadow-md py-2' : 'py-4'
//       }`}
//       aria-label="Top search"
//     >
//       <div className="mx-auto max-w-5xl px-4">
//         <form onSubmit={onSubmit} className="flex items-center gap-3">
//           <div
//             className={`flex w-full items-center rounded-full bg-gray-100 transition-padding duration-150 ${
//               compact ? 'py-2 px-3' : 'py-3 px-4'
//             }`}
//           >
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               className={`w-full bg-transparent text-sm focus:outline-none ${
//                 compact ? 'text-sm' : 'text-base'
//               }`}
//               placeholder="Search for anything"
//               aria-label="Search"
//             />
//             <button
//               type="submit"
//               className="ml-3 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             >
//               Search
//             </button>
//           </div>
//         </form>
//       </div>
//     </header>
//   )
// }

// export default SearchBar



import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ initial = '' }) => {
  const [query, setQuery] = useState(initial)
  const [compact, setCompact] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/products?search=${encodeURIComponent(q)}`)
  }

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-shadow duration-200 ${compact ? 'shadow-md py-1' : 'shadow-none py-3'}`}
      aria-label="Top search"
    >
      <div className={`mx-auto max-w-5xl px-4  ${compact ? 'compact' : 'expanded'}`}>
        <form onSubmit={onSubmit} className="flex items-center w-full gap-3">
          <div className={`flex w-full items-center rounded-full bg-gray-100`}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none px-4 py-2 text-sm md:text-base"
              placeholder="Search for anything"
              aria-label="Search"
            />
            <button
              type="submit"
              className="mr-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </header>
  )
}

export default SearchBar
