import React from 'react'
import VerticalNav from './VerticalNav'
import HorizontalNav from './HorizontalNav'

function HomePage() {
  return (
    <div>
<div className='container_HomeBage' >
    <div  className='left_nave' >
<VerticalNav/>
    </div>
    <div className='right_content' >
     

<HorizontalNav/>
    </div>

</div>

        
        {/* <HorizontalNav/> */}


    </div>
  )
}

export default HomePage