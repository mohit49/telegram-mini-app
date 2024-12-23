import SpinWheelWithBetting from '@/components/spinthewheel'
import React from 'react'
import dynamic from 'next/dynamic';
const ClientOnlyComponent = dynamic(() => import('../components/spinthewheel'), {
  ssr: false,
});
function plinko2() {
  return (
    <ClientOnlyComponent/>
  )
}

export default plinko2