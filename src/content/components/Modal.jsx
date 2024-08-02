import React from "react";

function Modal({ onClose, children }) {
  return (
    <div className="fixed top-0 left-0 z-[999] w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center">
      <div className="max-auto flex flex-col w-[500px] h-[40%] overflow-y-auto  bg-gray-100 border-2 border-gray-300 rounded-xl p-8">
        <div className="relative flex justify-center items-center text-center">
          <h2 className=" text-2xl text-gray-700 font-bold mb-4">Title</h2>
        </div>
        <div className="flex basis-auto gap-3 flex-wrap">{children}</div>
      </div>
      <div
        className="bg-gray-600/30 absolute top-0 left-0 h-full w-full z-[-1]"
        onClick={onClose}
      />
    </div>
  );
}

export default Modal;
