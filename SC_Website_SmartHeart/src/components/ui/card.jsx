import React from "react";
const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={\`bg-white rounded-2xl shadow-md p-4 border border-gray-200 \${className}\`} {...props}>
      {children}
    </div>
  );
};
export default Card;