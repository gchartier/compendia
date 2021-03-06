import _ from "lodash"
import PropTypes from "prop-types"
import { ArrowIcon } from "@icons/Arrow"
import { DisappearedLoading } from "react-loadingg"
import { useEffect, useState, useReducer } from "react"
import { Button } from "@components/common/buttons/Button"
import useDeepCompareEffect from "use-deep-compare-effect"
import { usePullListSeries } from "@hooks/queries/pull-list"
import { Options } from "@components/common/buttons/OptionsButton"
import { useUpdatePullListDetails } from "@hooks/mutations/pull-list"

const variants = [
    {
        key: "includeSubPrintings",
        label: "Subsequent Printings",
    },
    {
        key: "includeReprints",
        label: "Reprints",
    },
    {
        key: "includeCoverVariants",
        label: "Cover Variants",
    },
]

const formats = [
    {
        key: "includeSingleIssues",
        label: "Single Issues",
    },
    {
        key: "includeTPBs",
        label: "Trade Paperbacks",
    },
    {
        key: "includeHardcovers",
        label: "Hardcovers",
    },
    {
        key: "includeOmnibuses",
        label: "Omnibuses",
    },
    {
        key: "includeCompendia",
        label: "Compendia",
    },
    {
        key: "includeAll",
        label: "All",
    },
]

function getOptionsFromData(data) {
    return [...formats, ...variants].reduce((options, { key }) => {
        options[key] = data[key]
        return options
    }, {})
}

function isNotLastFormatChecked(options) {
    const numChecked = formats.reduce((count, { key }) => {
        if (options[key] && key !== "includeAll") count += 1
        return count
    }, 0)
    return numChecked > 1
}

function subscribeOptionsReducer(state, { type, key, data }) {
    if (type === "include" && key === "includeAll") {
        return Object.keys(state).reduce((obj, k) => {
            obj[k] = true
            return obj
        }, {})
    } else if (type === "include") {
        return { ...state, [key]: true }
    } else if (type === "exclude" && key === "includeSingleIssues") {
        if (isNotLastFormatChecked(state)) {
            return Object.keys(variants).reduce(
                (obj, k) => {
                    obj[k] = false
                    return obj
                },
                { ...state, includeSingleIssues: false }
            )
        } else return { ...state }
    } else if (type === "exclude") {
        if (
            (isNotLastFormatChecked(state) && formats.some((f) => f.key === key)) ||
            variants.some((v) => v.key === key)
        )
            return { ...state, [key]: false }
        else return { ...state }
    } else if (type === "reset") {
        return getOptionsFromData(data)
    }
}

function SubscribeOptionsItem({
    label,
    value,
    disabled,
    onChange,
    subOptions,
    className,
    isOptionsVisible,
}) {
    const [showSubOptions, setShowSubOptions] = useState(false)

    useEffect(() => {
        if (!isOptionsVisible) setShowSubOptions(false)
    }, [isOptionsVisible])

    return (
        <div className="flex flex-col">
            <label className={`flex items-center mb-4 ml-4 mr-4 whitespace-nowrap ${className}`}>
                <input
                    type="checkbox"
                    className={`form-checkbox h-5 w-5 mr-1 text-blue-primary-200 ${
                        disabled ? "opacity-30" : "cursor-pointer"
                    }`}
                    checked={value}
                    disabled={disabled}
                    onChange={onChange}
                />
                {label}
                {subOptions ? (
                    <button
                        className={`flex relative w-8 ml-2 cursor-pointer focus:outline-none`}
                        onClick={() => {
                            setShowSubOptions(!showSubOptions)
                        }}
                    >
                        <ArrowIcon
                            direction={showSubOptions ? "up" : "down"}
                            color="text-white"
                            height="h-2"
                        />
                    </button>
                ) : null}
            </label>
            <Options
                options={subOptions}
                showOptions={showSubOptions}
                setShowOptions={setShowSubOptions}
                bypassOutsideClick={true}
                isSubOptions={true}
            />
        </div>
    )
}
SubscribeOptionsItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    subOptions: PropTypes.element,
    className: PropTypes.string,
    isOptionsVisible: PropTypes.bool,
}

function VariantList({ options, dispatch }) {
    return (
        <ul>
            {variants.map(({ key, label }) => (
                <li key={key}>
                    <SubscribeOptionsItem
                        className="ml-6"
                        label={label}
                        value={options[key]}
                        disabled={options.includeAll || !options.includeSingleIssues}
                        onChange={(e) =>
                            dispatch({
                                type: e.target.checked ? "include" : "exclude",
                                key: key,
                            })
                        }
                    />
                </li>
            ))}
        </ul>
    )
}
VariantList.propTypes = {
    options: PropTypes.object,
    dispatch: PropTypes.func,
}

function FormatList({ options, dispatch, isOptionsVisible }) {
    return (
        <ul>
            {formats.map(({ key, label }) => (
                <li key={key}>
                    <SubscribeOptionsItem
                        label={label}
                        value={options[key]}
                        disabled={key === "includeAll" ? false : options.includeAll}
                        subOptions={
                            key === "includeSingleIssues" ? (
                                <VariantList options={options} dispatch={dispatch} />
                            ) : null
                        }
                        isOptionsVisible={isOptionsVisible}
                        onChange={(e) =>
                            dispatch({
                                type: e.target.checked ? "include" : "exclude",
                                key: key,
                            })
                        }
                    />
                </li>
            ))}
        </ul>
    )
}
FormatList.propTypes = {
    options: PropTypes.object,
    dispatch: PropTypes.func,
    isOptionsVisible: PropTypes.bool,
}

export function SubscribeOptions({ seriesID, isOptionsVisible }) {
    const { isLoading, isError, error, data } = usePullListSeries(seriesID)
    const pullListMutation = useUpdatePullListDetails(seriesID)
    const [showUpdateButton, setShowUpdateButton] = useState(false)
    const [subscribeOptions, dispatch] = useReducer(
        subscribeOptionsReducer,
        getOptionsFromData(data)
    )

    useEffect(() => {
        if (isOptionsVisible === false) dispatch({ type: "reset", data: data })
    }, [isOptionsVisible, data])

    useDeepCompareEffect(() => {
        _.isEqual(subscribeOptions, getOptionsFromData(data))
            ? setShowUpdateButton(false)
            : setShowUpdateButton(true)
    }, [subscribeOptions])

    if (isLoading) return <DisappearedLoading />
    else if (isError) return <div>Error: {error.message}</div>
    else if (!data) return <></>
    else
        return (
            <div className="flex flex-col">
                <h3 className="font-semibold text-gray-50 m-2 mb-1 mt-3 border-b-2 border-gray-300">
                    Formats to Include
                </h3>

                <FormatList
                    options={subscribeOptions}
                    dispatch={dispatch}
                    isOptionsVisible={isOptionsVisible}
                />

                {showUpdateButton && (
                    <Button
                        roundedClass="rounded-lg"
                        className="m-3 ml-auto self-end"
                        onClick={() => {
                            pullListMutation.mutate(subscribeOptions)
                            setShowUpdateButton(false)
                        }}
                    >
                        Update
                    </Button>
                )}
            </div>
        )
}
SubscribeOptions.propTypes = {
    seriesID: PropTypes.number.isRequired,
    isOptionsVisible: PropTypes.bool.isRequired,
}
