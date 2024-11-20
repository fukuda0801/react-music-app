import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SongList = ({
  songs,
  isLoading,
  onSongSelected,
}: {
  songs: any;
  isLoading: boolean;
  onSongSelected: any;
}) => {
  if (isLoading) {
    return (
      <div className="inset-0 flex justify-center items-center">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
      {songs.map((song: any) => {
        return (
          <div
            onClick={() => onSongSelected(song)}
            key={song.id}
            className="flex-none cursor-pointer"
          >
            <img
              src={song.album.images[0].url}
              alt="thumbnail"
              className="mb-2 rounded"
            />
            <h3 className="text-lg font-semibold">{song.name}</h3>
            <p className="text-gray-400">{song.artists[0].name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default SongList;
