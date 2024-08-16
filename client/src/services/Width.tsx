// Service for getting the width of the window
import { useState, useEffect } from 'react';

function Width() {
    const [width, setWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
        function handleResize(){
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return width;
}

export default Width;