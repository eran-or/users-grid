import React, { useState } from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

const modalHoc = (WrappedCmponent) => {
  return function (props) {
    const { onClose, onOpen, children, ...rest } = props
    const [isOpen, setIsVisible] = useState(false)
    const [unmount, setUnmount] = useState(true)
    

    const handleClose = () => {
      setIsVisible(false)
      if (onClose) {
        onClose()
      }
    }

    const handleUnmount = () => {
      if(!isOpen){
        setUnmount(true)
      }
    }
    return <>

      <div disabled={isOpen} onClick={() =>{
        if(onOpen){
          onOpen()
        }
        if(unmount){
          setUnmount(false)
        }
        setIsVisible(true)
      }}>
        {children}
      </div>
      
      {!unmount && <Rodal width={400} height={394} {...rest} visible={isOpen} onClose={handleClose} onAnimationEnd={handleUnmount}>
        <WrappedCmponent {...props} onClose={handleClose} />
      </Rodal>}
    </>
  }
}
export default modalHoc

export const ModalTriger = ({ children }) => <> {children} </>
ModalTriger.displayName = "ModalTriger"