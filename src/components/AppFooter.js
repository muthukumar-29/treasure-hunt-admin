import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy; {new Date().getFullYear()} QMAZE 2K25</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
