import PropTypes from "prop-types"

export function SearchIcon({ color, width, height, className }) {
    return (
        <svg
            className={`fill-current ${color} ${width} ${height} ${className ? className : ""}`}
            viewBox="0 0 20 20"
        >
            <path d="M12.5 11h-.79l-.28-.27A6.471 6.471 0 0013 6.5 6.5 6.5 0 106.5 13c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L17.49 16l-4.99-5zm-6 0C4.01 11 2 8.99 2 6.5S4.01 2 6.5 2 11 4.01 11 6.5 8.99 11 6.5 11z" />
        </svg>
    )
}
SearchIcon.propTypes = {
    color: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string,
}
