import React from 'react'
type Props = {
  currentUrl: String;
};
const Messages = (props: Props) => {
  return (
    <div>
        <p className="text-2xl font-bold text-left">All messages</p>
          <hr className="mt-3" />
          <div className='flex mt-4'>
            <div>
              <div className='flex'>
              <p className='font-bold text-lg'>Messages</p>

              </div>
            </div>
            <div>

            </div>
          </div>
    </div>
  )
}

export default Messages