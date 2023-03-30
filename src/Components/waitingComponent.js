import React, { Suspense } from 'react'

export default function WaitingComponent(Component) {
  return (props) => (
    <Suspense fallback={<div />}>
      <Component {...props} />
    </Suspense>
  )
}
