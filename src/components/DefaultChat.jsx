import React from 'react'

const DefaultChat = () => {
    return (
        <div className='w-full flex flex-col justify-center items-center gap-3 '>
            <img src={'/chitchatLogo.svg'} alt="logo.svg" className="w-20" />
            <p className="text-4xl text-white font-semibold">ChitChat</p>
        </div>
    )
}

export default DefaultChat
