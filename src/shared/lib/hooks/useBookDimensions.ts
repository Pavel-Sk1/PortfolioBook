// import { useState, useEffect } from 'react';


// function debounce(func: Function, ms: number) {
//   let timer: NodeJS.Timeout;
//   return function (...args: any[]) {
//     clearTimeout(timer);
//     timer = setTimeout(() => func.apply(this, args), ms);
//   };
// }

// const getBaseBookSizes = () => {
//   const screenWidth = window.innerWidth;
//   const screenHeight = window.innerHeight;
  
//   const pageWidth = Math.floor(screenWidth * 0.4);
//   const pageHeight = Math.floor(screenHeight * 0.8);
  
//   return {
//     pageWidth,
//     pageHeight,
//     bookWidth: pageWidth * 2,
//     bookHeight: pageHeight
//   };
// };

// export const useBookDimensions = () => {
//   const [dimensions, setDimensions] = useState(getBaseBookSizes());

//   useEffect(() => {
//     const debouncedHandleResize = debounce(() => {
//       setDimensions(getBaseBookSizes());
//     }, 150); // Обновление не чаще, чем раз в 150мс

//     const handleResize = () => debouncedHandleResize();
    
//     window.addEventListener('resize', handleResize);
//     // Первоначальный расчет
//     handleResize();
    
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       // Отменить запланированное обновление при размонтировании
//       debouncedHandleResize.cancel?.();
//     };
//   }, []);

//   return dimensions;
// };