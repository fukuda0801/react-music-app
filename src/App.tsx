import { useEffect, useRef, useState } from 'react';
import SongList from './components/SongList';
import { getPopularSongs, searchSongs } from './lib/spotify';
import Player from './components/Player';
import SearchInput from './components/SearchInput';
import Pagination from './components/Pagination';

const LIMIT = 20;

const App = () => {
  // 楽曲情報をロード中かどうか
  const [isLoading, setIsLoading] = useState(false);
  // 楽曲情報を格納する
  const [popularSongs, setPopularSongs] = useState([]);
  // 楽曲再生
  const [isPlay, setIsPlay] = useState(false);
  // どの楽曲を再生するか
  const [selectedSong, setSelectedSong] = useState();
  // 検索キーワード
  const [keyword, setKeyword] = useState('');
  // 検索結果
  const [searchedSongs, setSearchedSongs] = useState();
  // 検索結果があるかどうか
  const isSearchedResult = searchedSongs != null;
  // 表示しているページ
  const [page, setPage] = useState(0);
  // 前後ページが存在するかどうか
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // audioタグに渡すref
  const audioRef = useRef<HTMLAudioElement>(null);

  // マウント時のみ実行
  useEffect(() => {
    fetchPopularSongs();
  }, []);

  // 人気楽曲取得関数
  const fetchPopularSongs = async () => {
    setIsLoading(true);
    const result = await getPopularSongs();
    const resultPopularSongs = result.items.map((item: any) => {
      return item.track;
    });
    setPopularSongs(resultPopularSongs);
    setIsLoading(false);
  };

  // 楽曲視聴のための関数
  const handleSongSelected = async (song: any) => {
    setSelectedSong(song);
    if (song?.preview_url && audioRef.current) {
      audioRef.current.src = song.preview_url;
      playSong();
    } else {
      pauseSong();
    }
  };

  const playSong = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlay(true);
    }
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlay(false);
    }
  };

  const toggleSong = () => {
    if (isPlay) {
      pauseSong();
    } else {
      playSong();
    }
  };

  // 検索キーワード取得
  const handleInputChange = (e: any) => {
    setKeyword(e.target.value);
  };

  // 検索処理
  const searchSongsResult = async (page: number) => {
    setIsLoading(true);
    const offset = Math.trunc(page) ? (Math.trunc(page) - 1) * LIMIT : 0;
    const result = await searchSongs(keyword, LIMIT, offset);
    setHasNext(result.next != null);
    setHasPrev(result.previous != null);
    setSearchedSongs(result.items);
    setIsLoading(false);
  };

  const moveToNext = async () => {
    const nextPage = page + 1;
    await searchSongsResult(nextPage);
    setPage(nextPage);
  };

  const moveToPrev = async () => {
    const prevPage = page - 1;
    await searchSongsResult(prevPage);
    setPage(prevPage);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <SearchInput
          onInputChange={handleInputChange}
          onSubmit={searchSongsResult}
        />
        <section>
          <h2 className="text-2xl font-semibold mb-5">
            {isSearchedResult ? 'Searched Result' : 'Popular Songs'}
          </h2>
          <SongList
            isLoading={isLoading}
            songs={isSearchedResult ? searchedSongs : popularSongs}
            onSongSelected={handleSongSelected}
          />
          {isSearchedResult && (
            <Pagination
              onPrev={hasPrev ? moveToPrev : null}
              onNext={hasNext ? moveToNext : null}
            />
          )}
        </section>
      </main>
      {selectedSong != null && (
        <Player
          song={selectedSong}
          isPlay={isPlay}
          onButtonClick={toggleSong}
        />
      )}
      <audio ref={audioRef} />
    </div>
  );
};

export default App;
