import axios from "axios"
import { useQuery } from "react-query"

export function useCollectedComic(id) {
    return useQuery(
        ["collected-comic-detail", id],
        async () => {
            const { data } = await axios.get(`/api/collection/comics/${id}`)
            return data
        },
        { staleTime: Infinity }
    )
}

export function useCollectedComics() {
    return useQuery(
        ["collected-comics"],
        async () => {
            const { data } = await axios.get(`/api/collection/comics`)
            return data
        },
        { staleTime: 600000 }
    )
}

export function useSubscribedSeries() {
    return useQuery(
        ["subscribed-series"],
        async () => {
            const { data } = await axios.get(`/api/collection/pull-list/series`)
            return data
        },
        { staleTime: 600000 }
    )
}

export function useLists() {
    return useQuery(
        ["lists"],
        async () => {
            const { data } = await axios.get(`/api/collection/lists`)
            return data
        },
        { staleTime: 600000 }
    )
}

export const useListDetail = (listID) =>
    useQuery(
        ["list-detail", listID],
        async () => {
            const { data } = await axios.get(`/api/collection/lists/${listID}`)
            return data
        },
        { enabled: false, staleTime: Infinity }
    )

export const useListComics = (listID) =>
    useQuery(
        ["list-comics", listID],
        async () => {
            const { data } = await axios.get(`/api/collection/lists/${listID}/comics`)
            return data
        },
        { enabled: false, staleTime: Infinity }
    )
