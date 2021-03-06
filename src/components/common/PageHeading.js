import PropTypes from "prop-types"

const textStyles = "text-center text-blue-primary-200 font-bold"

export function PageHeading({
    heading,
    subHeading,
    controls,
    paddingTop = "",
    marginBottom = "mb-4 sm:mb-6",
    isSubHeadingFirst = false,
    justifyControls = "justify-center",
}) {
    return (
        <div
            className={`flex flex-col justify-around align-center pb-4 border-b-4 border-blue-primary-200 border-solid ${paddingTop} ${marginBottom} sm:pb-6`}
        >
            <div className="flex flex-col">
                <h2
                    className={`text-4xl ${textStyles} ${
                        isSubHeadingFirst ? "order-2" : "order-1"
                    }`}
                >
                    {heading}
                </h2>

                {subHeading ? (
                    <h2
                        className={`text-2xl ${textStyles} ${
                            isSubHeadingFirst ? "order-1" : "order-2"
                        }`}
                    >
                        {subHeading}
                    </h2>
                ) : null}
            </div>

            {controls ? <div className={`flex ${justifyControls}`}>{controls}</div> : null}
        </div>
    )
}
PageHeading.propTypes = {
    heading: PropTypes.string.isRequired,
    subHeading: PropTypes.string,
    controls: PropTypes.element,
    paddingTop: PropTypes.string,
    marginBottom: PropTypes.string,
    isSubHeadingFirst: PropTypes.bool,
    justifyControls: PropTypes.string,
}
