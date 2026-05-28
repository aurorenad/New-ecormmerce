interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  itemLabel?: string
  onPageChange: (page: number) => void
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  itemLabel = 'items',
  onPageChange,
}: PaginationProps) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className="um-pagination">
      <span className="um-pagination-info">
        Showing {start}–{end} of {totalItems} {itemLabel}
      </span>
      <div className="um-pagination-controls">
        <button
          type="button"
          className="um-page-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          ‹ Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            className={`um-page-btn ${n === page ? 'um-page-btn--active' : ''}`}
            onClick={() => onPageChange(n)}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          className="um-page-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next ›
        </button>
      </div>
    </div>
  )
}
