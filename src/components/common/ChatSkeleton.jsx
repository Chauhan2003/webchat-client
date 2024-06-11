import React from 'react'

const ChatSkeleton = () => {
    return (
        <>
            <div className="chat chat-end">
                <div className="chat-bubble skeleton w-36"></div>
            </div>
            <div className="chat chat-start">
                <div className="chat-bubble skeleton w-40"></div>
            </div>
            <div className="chat chat-end">
                <div className="chat-bubble skeleton w-16"></div>
            </div>
            <div className="chat chat-start">
                <div className="chat-bubble skeleton w-20"></div>
            </div>
            <div className="chat chat-end">
                <div className="chat-bubble skeleton w-52"></div>
            </div>
            <div className="chat chat-end">
                <div className="chat-bubble skeleton w-16"></div>
            </div>
            <div className="chat chat-start">
                <div className="chat-bubble skeleton w-36"></div>
            </div>
            <div className="chat chat-end">
                <div className="chat-bubble skeleton w-60"></div>
            </div>
            <div className="chat chat-end">
                <div className="chat-bubble skeleton w-24"></div>
            </div>
            <div className="chat chat-start">
                <div className="chat-bubble skeleton w-28"></div>
            </div>
        </>
    )
}

export default ChatSkeleton
