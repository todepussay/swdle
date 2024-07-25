import { useEffect, useState } from "react";

let timeoutId: NodeJS.Timeout;

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState<string>(value);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    useEffect(() => {
        if(timeoutId){
            setIsSearching(true);
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            setIsSearching(false);
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
        }
    }, [value, delay]);

    return [debouncedValue, isSearching];
}

export default useDebounce;