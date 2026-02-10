type PaginationProps = {
    currentPage: number,
    totalPages: number | undefined,
    paginate: (pageNumber: number) => void
}

export default function Pagination({currentPage, totalPages, paginate} : PaginationProps) {

    if (!totalPages) {
        return null;
    }

    const handlePageNumberClick = (e: React.MouseEvent<HTMLButtonElement> , pageNumber: number) => {
        
        e.preventDefault();

        paginate(pageNumber);
    }

    const pageNumbers = [];

    for (let i=1; i<=totalPages; i++) {
        pageNumbers.push(i);
    }
    
    return (
        <ul className="flex flex-nowrap gap-1">
            {
                pageNumbers.map(pageNumber => (
                    <li key={`page-${pageNumber}`}>
                        {
                            (pageNumber === currentPage) ?
                                <div className="flex items-center justify-center box-border size-[30px] rounded-full bg-violet-600 text-sm text-gray-50" role="status" aria-current="page">{pageNumber}</div>
                                :
                                <button type="button" 
                                    onClick={(e) => handlePageNumberClick(e, pageNumber)} 
                                    className="flex items-center justify-center box-border size-[30px] rounded-full text-sm text-gray-900 hover:bg-gray-300">
                                    {pageNumber}
                                </button>
                        }
                    </li>
                ))
            }
        </ul>
    )
}