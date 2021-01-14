import PropTypes from "prop-types"

import ReleasesIcon from "../utils/icons/Releases"
import PullListIcon from "../utils/icons/PullList"

const ReleasesTypeTabs = ({ activeTab, onTabClick }) => (
    <div className="bg-gray-200 text-xl text-gray-500 leading-none rounded-full inline-flex">
        <button
            className={`inline-flex items-center outline-none rounded-l-full px-4 py-2  ${
                activeTab === "pull list" && "bg-blue-primary-200 text-white"
            }`}
            onClick={() => onTabClick("pull list")}
        >
            <PullListIcon isActive={activeTab === "pull list"} />
            <span>Pull List</span>
        </button>
        <button
            className={`inline-flex items-center outline-none rounded-r-full px-4 py-2  ${
                activeTab === "all releases" && "bg-blue-primary-200 text-white"
            }`}
            onClick={() => onTabClick("all releases")}
        >
            <ReleasesIcon isActive={activeTab === "all releases"} />
            <span>All Releases</span>
        </button>
    </div>
)

ReleasesTypeTabs.propTypes = {
    activeTab: PropTypes.oneOf(["all releases", "pull list"]).isRequired,
    onTabClick: PropTypes.func.isRequired,
}

export default ReleasesTypeTabs