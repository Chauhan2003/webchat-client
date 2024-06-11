import React from 'react'

const FriendSkeleton = () => {
    return (
        <div className='flex flex-col gap-2 w-full py-3 px-4'>
            <div className='flex gap-2 items-center'>
                <div className='skeleton w-12 h-12 rounded-full shrink-0'></div>
                <div className='flex flex-col gap-2'>
                    <div className='skeleton h-3 w-20 rounded-full'></div>
                    <div className='skeleton h-3 w-36 rounded-full'></div>
                </div>
                <div className='skeleton ml-auto w-10 rounded-full h-4 mb-4'></div>
            </div>
        </div>
    )
}

export default FriendSkeleton
