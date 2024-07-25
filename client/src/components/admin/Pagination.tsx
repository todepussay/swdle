import React, { useEffect } from 'react';
import '@styles/admin/Pagination.css';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Button from '@components/Button';


type PaginationProps = {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalPage: number;
}

function Pagination({ search, setSearch, page, setPage, totalPage }: PaginationProps){

    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPage(parseInt(e.target.value));
    }

    return (
        <div className="Pagination">
            <div className="search-field">
                <input type="text" name="search" id='search' placeholder="Rechercher" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="pagination">
                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    <FaArrowLeft />
                </Button>
                <select onChange={handleChangeSelect} value={page}>
                    {
                        Array.from({ length: totalPage }, (_, i) => (
                            <option key={i} value={i + 1}>{i + 1}</option>
                        ))
                    }
                </select>
                <Button onClick={() => setPage(page + 1)} disabled={page === totalPage}>
                    <FaArrowRight />
                </Button>
            </div>
        </div>
    )
}

export default Pagination;