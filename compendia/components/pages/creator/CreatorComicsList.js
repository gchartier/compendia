import PropTypes from "prop-types"
import { ComicCover } from "@components/pages/comic/ComicCover"
import { Category } from "@components/common/Category"

export function CreatorComicsList({ comics, creatorID }) {
    return (
        <>
            {comics && comics.length > 0 ? (
                <div className="flex flex-wrap">
                    <ul>
                        {comics.map((comic) => (
                            <li key={comic.id}>
                                <ComicCover
                                    comicID={comic.id}
                                    cover={comic.cover}
                                    title={comic.title}
                                    footer={
                                        <ul className="flex flex-wrap justify-center">
                                            {comic.creatorTypes.map((type, index) => (
                                                <li
                                                    key={`${creatorID}-${comic.id}-${type}`}
                                                    className="flex mt-2"
                                                >
                                                    <Category size="SM">{type}</Category>
                                                    {index !== comic.creatorTypes.length - 1 && (
                                                        <span className="text-2xl mx-1 text-blue-primary-200">
                                                            /
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    }
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-center text-xl mt-12 mb-20">No comics...</p>
            )}
        </>
    )
}

CreatorComicsList.propTypes = {
    comics: PropTypes.array.isRequired,
    creatorID: PropTypes.string.isRequired,
}
