import { useEffect, useState } from 'react';

import backgroundHeaderDesktop from '../public/images/bg-header-desktop.svg'
import backgroundHeaderMobile from '../public/images/bg-header-mobile.svg'

import iconRemove from '../public/icons/icon-remove.svg'

import datas from './data/data.json'



export default function App() {
  const [tabletsScreen, setTabletsScreen] = useState(false);
  const [filter, setFilter] = useState([]);
  const [filterResult, setFilterResult] = useState([]);

  const tabletScreenSize = 767;

  const handleFilter = (e) => {
    const newFilter = e.target.innerText;

    if (!filter.includes(newFilter)) {
      setFilter([...filter, newFilter]);
      sessionStorage.setItem("filter", JSON.stringify([...filter, newFilter]));
    }

    filterResultHandler();

  }

  const deleteFilters = () => {
    setFilter([]);
    setFilterResult([]);
    sessionStorage.clear("filter");
  }

  const deleteItemFilter = (e) => {
    const newFilter = e.target.parentNode.innerText;

    const updatedFilter = filter.filter(item => item !== newFilter);
    setFilter(updatedFilter);
    sessionStorage.setItem("filter", JSON.stringify(updatedFilter));

    const filteredData = datas.filter(data => {
      return updatedFilter.every(category => data.languages.includes(category) || data.tools.includes(category));
    });
    sessionStorage.setItem("filterResult", JSON.stringify(filteredData));
    setFilterResult(filteredData);
  }

  const filterResultHandler = () => {
    const categoriesFromSessionStorage = JSON.parse(sessionStorage.getItem("filter"));
    if (categoriesFromSessionStorage) {
      const filteredData = datas.filter(data => {
        return categoriesFromSessionStorage.every(category => data.languages.includes(category) || data.tools.includes(category));
      });
      sessionStorage.setItem("filterResult", JSON.stringify(filteredData));
      setFilterResult(filteredData);
    }
  }

  useEffect(() => {
    const items = JSON.parse(sessionStorage.getItem("filter"));
    const itemFilteredData = JSON.parse(sessionStorage.getItem("filterResult"));

    if (itemFilteredData) {
      setFilterResult(itemFilteredData);
    }

    if (items) {
      setFilter(items)
    }

    if (window.innerWidth > tabletScreenSize) {
      setTabletsScreen(true);
    } else {
      setTabletsScreen(false);
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth > tabletScreenSize) {
        setTabletsScreen(true);
      } else {
        setTabletsScreen(false);
      }
    });
  }, []);
  return (
    <>
      <header className='relative bg-desaturated-dark-cyan max-wrapper'>
        {tabletsScreen ? <img src={backgroundHeaderDesktop} alt="background header desktop" /> : <img src={backgroundHeaderMobile} alt="background header mobile" />}
      </header>
      <main className={`space-y-11 pb-8 font-medium bg-light-grayish-cyan-background md:space-y-5 ${filter.length > 0 ? "pt-10 space-y-[3.5rem]" : ""}`}>
        <div className={`${filter.length > 0 ? "relative z-50 flex flex-wrap items-center gap-3 p-[1.2815rem] -mt-20 bg-white rounded-md shadow-filter-box mx-[1.702rem] desktop:max-w-[1105px] desktop:mx-auto animate__animated animate__bounceIn" : "invisible"}`}>
          {filter.length > 0 ?
            filter.map((item, index) => (
              <div key={index} className='flex flex-wrap items-center gap-4'>
                <div className='flex items-center justify-center gap-2'>
                  <p className='flex gap-2 font-bold items-center pl-4 animate__animated animate__fadeIn text-desaturated-dark-cyan bg-[#ebf8f5] rounded-md tracking-wide'>
                    {item}
                    <img onClick={deleteItemFilter} className='p-2 duration-75 ease-in-out cursor-pointer rounded-tr-md rounded-br-md bg-desaturated-dark-cyan hover:bg-black' src={iconRemove} alt="icon delete" />
                  </p>
                </div>
              </div>
            ))
            : ""}

          <button className='block ml-auto font-bold text-dark-grayish-cyan hover:text-desaturated-dark-cyan hover:underline' onClick={deleteFilters}>Clear</button>
        </div>

        {filterResult.length === 0 ? datas.map(data => (
          <section key={data.id} className={`shadow-filter-box space-y-6 relative bg-white py-[2.87rem] pl-6 pr-5 mx-[1.702rem] rounded-md md:flex md:items-center md:justify-between md:space-y-0 md:py-[2.125rem] desktop:max-w-[1105px] desktop:mx-auto ${data.new ? "before:content-[''] before:h-full before:bg-desaturated-dark-cyan before:w-[.3rem] before:absolute before:top-0 before:left-0 before:rounded-xl" : ""}`}>
            <div className='border-b-[1px] border-light-grayish-cyan pb-4 md:flex md:items-center md:gap-4 md:border-b-0 md:pb-0'>
              <div className='absolute -top-7 md:static'>
                <img className='w-14' src={data.logo} alt={`Logo ${data.company} company`} />
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-start gap-2 tracking-wide">
                  <span className='font-bold text-desaturated-dark-cyan'>{data.company}</span>
                  <span className={`${data.new ? "px-3 py-1 text-center text-white rounded-full place-content-center bg-desaturated-dark-cyan" : ""}`}>{data.new ? 'NEW!' : ''}</span>
                  <span className={`${data.featured ? "px-3 py-1 text-center text-white rounded-full place-content-center bg-very-dark-grayish-cyan" : ""}`}>{data.featured ? 'FEATURED' : ''}</span>
                </div>
                <h1 className='mt-4 text-lg font-bold duration-75 ease-in-out cursor-pointer text-very-dark-grayish-cyan md:mt-2 hover:text-desaturated-dark-cyan'>{data.position}</h1>
                <div className='mt-2 space-x-4 text-dark-grayish-cyan md:mt-0'>
                  <span>{data.postedAt}</span>
                  <span>{data.contract}</span>
                  <span>{data.location}</span>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap items-center justify-start gap-4 font-bold text-desaturated-dark-cyan md:text-sm'>
              {data.languages.map((language, index) => (
                <span key={index} onClick={handleFilter} className='bg-[#ebf8f5] px-3 py-2 cursor-pointer rounded-lg hover:text-white hover:bg-desaturated-dark-cyan ease-in-out duration-75'>{language}</span>
              ))}
              {data.tools.map((tool, index) => (
                <span key={index} onClick={handleFilter} className='bg-[#ebf8f5] p-2 cursor-pointer rounded-lg hover:text-white hover:bg-desaturated-dark-cyan ease-in-out duration-75'>{tool}</span>
              ))}
            </div>
          </section>
        )) : filterResult.map(data => (
          <section key={data.id} className={`shadow-filter-box space-y-6 relative bg-white py-[2.87rem] pl-6 pr-5 mx-[1.702rem] rounded-md md:flex md:items-center md:justify-between md:space-y-0 md:py-[2.125rem] desktop:max-w-[1105px] desktop:mx-auto ${data.new ? "before:content-[''] before:h-full before:bg-desaturated-dark-cyan before:w-[.3rem] before:absolute before:top-0 before:left-0 before:rounded-xl" : ""}`}>
            <div className='border-b-[1px] border-light-grayish-cyan pb-4 md:flex md:items-center md:gap-4 md:border-b-0 md:pb-0'>
              <div className='absolute -top-7 md:static'>
                <img className='w-14' src={data.logo} alt={`Logo ${data.company} company`} />
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-start gap-2 tracking-wide">
                  <span className='font-bold text-desaturated-dark-cyan'>{data.company}</span>
                  <span className={`${data.new ? "px-3 py-1 text-center text-white rounded-full place-content-center bg-desaturated-dark-cyan" : ""}`}>{data.new ? 'NEW!' : ''}</span>
                  <span className={`${data.featured ? "px-3 py-1 text-center text-white rounded-full place-content-center bg-very-dark-grayish-cyan" : ""}`}>{data.featured ? 'FEATURED' : ''}</span>
                </div>
                <h1 className='mt-4 text-lg font-bold duration-75 ease-in-out cursor-pointer text-very-dark-grayish-cyan md:mt-2 hover:text-desaturated-dark-cyan'>{data.position}</h1>
                <div className='mt-2 space-x-4 text-dark-grayish-cyan md:mt-0'>
                  <span>{data.postedAt}</span>
                  <span>{data.contract}</span>
                  <span>{data.location}</span>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap items-center justify-start gap-4 font-bold text-desaturated-dark-cyan md:text-sm'>
              {data.languages.map((language, index) => (
                <span key={index} onClick={handleFilter} className='bg-[#ebf8f5] px-3 py-2 cursor-pointer rounded-lg hover:text-white hover:bg-desaturated-dark-cyan ease-in-out duration-75'>{language}</span>
              ))}
              {data.tools.map((tool, index) => (
                <span key={index} onClick={handleFilter} className='bg-[#ebf8f5] p-2 cursor-pointer rounded-lg hover:text-white hover:bg-desaturated-dark-cyan ease-in-out duration-75'>{tool}</span>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  )
}