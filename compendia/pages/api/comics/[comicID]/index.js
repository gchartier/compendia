import { getUserOrRedirect } from "../../../../util/cookie"
const db = require("../../../../database").instance

export default async function handler(req, res) {
    res.setHeader("Content-Type", "application/json")
    const { comicID } = req.query
    const user = getUserOrRedirect(req, res)

    const client = await db.connect()
    try {
        // Get comic by the ID passed in
        const comicQuery = `SELECT comic_id, title, cover, release_date, cover_price, description, age_rating, format, printing, p.publisher_id, p.name as publisher_name, s.series_id, s.name as series_name, i.imprint_id, i.name as imprint_name, versions
                FROM comics as c
                FULL JOIN series as s ON c.series_id = s.series_id
                FULL JOIN publishers as p ON s.publisher_id = p.publisher_id
                FULL JOIN imprints as i ON i.publisher_id = p.publisher_id
                CROSS JOIN (SELECT COUNT(*) as versions FROM comics WHERE version_of = $1) as v
                WHERE comic_id = $1`
        const comicQueryParams = [comicID]
        const comicResult = await client.query(comicQuery, comicQueryParams)

        // Check if the comic is currently in the user's collection
        const isCollectedQuery = `SELECT COUNT(*) FROM collected_comics as cc
                FULL JOIN collections as col ON cc.collection_id = col.collection_id
                WHERE cc.comic_id = $1 AND col.user_id = $2`
        const isCollectedQueryParams = [comicID, user.id]
        const isCollectedResult = await client.query(isCollectedQuery, isCollectedQueryParams)

        if (comicResult.rows.length > 0) {
            const comic = comicResult.rows[0]
            res.status(200).json({
                id: comic.comic_id,
                title: comic.title,
                cover: comic.cover,
                releaseDate: comic.release_date,
                coverPrice: comic.coverPrice,
                description: comic.description,
                ageRating: comic.age_rating,
                format: comic.format,
                printing: comic.printing,
                publisherID: comic.publisher_id,
                publisherName: comic.publisher_name,
                seriesID: comic.series_id,
                seriesName: comic.series_name,
                imprintID: comic.imprint_id,
                imprintName: comic.imprint_name,
                versions: comic.versions,
                isCollected: isCollectedResult.rows.length > 0,
            })
        } else res.status(404).json({ message: `Could not find a comic with ID of ${id}` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    } finally {
        client.release()
    }
}
