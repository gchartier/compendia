import PropTypes from "prop-types"
import { AllReleasesIcon } from "@icons/AllReleases"
import { PullListIcon } from "@icons/PullList"

export function ReleasesTypeTabs({ activeTab, onTabClick }) {
    return (
        <div className="bg-gray-200 text-xl text-gray-500 leading-none rounded-full inline-flex">
            <button
                className={`inline-flex items-center outline-none rounded-l-full px-4 py-2  ${
                    activeTab === "pull list" && "bg-blue-primary-200 text-white"
                }`}
                onClick={() => onTabClick("pull list")}
            >
                <PullListIcon
                    color={activeTab === "pull list" ? "text-white" : "text-gray-300"}
                    width="w-6"
                    height="h-6"
                    className="mr-2"
                />
                <span>Pull List</span>
            </button>
            <button
                className={`inline-flex items-center outline-none rounded-r-full px-4 py-2  ${
                    activeTab === "all releases" && "bg-blue-primary-200 text-white"
                }`}
                onClick={() => onTabClick("all releases")}
            >
                <AllReleasesIcon isActive={activeTab === "all releases"} />
                <span>All Releases</span>
            </button>
        </div>
    )
}
ReleasesTypeTabs.propTypes = {
    activeTab: PropTypes.oneOf(["all releases", "pull list"]).isRequired,
    onTabClick: PropTypes.func.isRequired,
}
