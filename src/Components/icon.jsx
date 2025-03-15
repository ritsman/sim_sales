import { useState } from 'react';
import { RiMenuLine } from "react-icons/ri"; // Example using Remix Icon
import React from 'react';

function ThreeBars({onClick}) {
    
    const iconColor = "#F2EFE7"; // Change this to your desired color

    return (
        <RiMenuLine
            style={{ color: iconColor, fontSize: '2rem', cursor: 'pointer' }} // Adjust size as needed
            onClick={onClick}
        />
    );
}

export default ThreeBars;
