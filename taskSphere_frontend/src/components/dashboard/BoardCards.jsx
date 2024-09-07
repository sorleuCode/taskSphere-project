import React from "react";

const BoardCards = ({ title, description, type }) => {
  return (
    <div  className="flex min-w-28 min-h-24 items-center justify-between p-4 bg-white shadow-md shadow-blue-100 rounded-md mb-4">
      <div>
        <h3 className="text-md w-full text-center font-small">{title}</h3>
        <p className="text-[12px] text-gray-500">
          {description.length > 10 ? description.substring(0, 10) + "..." : description}
        </p>
        {type && <p className="text-xs text-blue-400 text-center w-full mt-1">{type}</p>}
      </div>
      
    </div>
  );
};

export default BoardCards;