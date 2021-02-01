import { useQueryClient } from "react-query"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Page } from "@components/common/Page"
import { PageHeading } from "@components/common/PageHeading"
import { CreatorComicsList } from "@components/pages/creator/CreatorComicsList"
import { FilterOptions } from "@components/pages/creator/FilterOptions"
import { FilterIcon } from "@icons/Filter"
import { SVGOptionsButton } from "@components/common/buttons/OptionsButton"
import { useCreatorComics, useCreatorDetail } from "@hooks/queries/creator"

export default function CreatorDetail() {
    const queryClient = useQueryClient()
    const router = useRouter()
    const { creatorID } = router.query

    const [filterTypes, setFilterTypes] = useState(["W", "A", "CA"])
    const [showFilterOptions, setShowFilterOptions] = useState(false)

    const {
        isLoading: creatorIsLoading,
        isError: creatorIsError,
        error: creatorError,
        data: creator,
    } = useCreatorDetail(parseInt(creatorID))

    const {
        isLoading: comicsIsLoading,
        isError: comicsIsError,
        error: comicsError,
        data: comicsData,
    } = useCreatorComics(parseInt(creatorID), filterTypes)

    const comics = comicsData && comicsData.comics ? comicsData.comics : []

    useEffect(() => {
        if (creatorID) {
            queryClient.refetchQueries(["creator-detail", parseInt(creatorID)])
            queryClient.refetchQueries(["creator-comics", parseInt(creatorID)])
        }
    }, [creatorID])

    useEffect(() => {
        queryClient.refetchQueries(["creator-comics", parseInt(creatorID), filterTypes.join("/")])
    }, [filterTypes])

    if (creatorIsLoading || comicsIsLoading) return <div>Loading...</div>
    else if (creatorIsError || comicsIsError)
        return (
            <div>
                Error:{" "}
                {`${comicsError && comicsError.message} ${creatorError && creatorError.message}`}
            </div>
        )
    else if (!creatorID || creator === undefined || comics === undefined) return <></>
    else {
        return (
            <Page title={`Creator - ${creator.name}`}>
                <PageHeading>
                    <div className="flex flex-col">
                        <span className="text-2xl">Comics by</span>
                        {creator.name}
                    </div>
                </PageHeading>

                <div className="flex justify-end mb-8 -mt-3">
                    <SVGOptionsButton
                        options={
                            <FilterOptions
                                creatorID={creatorID}
                                filterTypes={filterTypes}
                                setFilterTypes={setFilterTypes}
                                setShowFilterOptions={setShowFilterOptions}
                            />
                        }
                        showOptions={showFilterOptions}
                        setShowOptions={setShowFilterOptions}
                    >
                        <FilterIcon />
                    </SVGOptionsButton>
                </div>

                <CreatorComicsList comics={comics} creatorID={creatorID} />
            </Page>
        )
    }
}
