import axios from 'axios';

let token: string;

// トークン取得関数
export const initializeToken = async () => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  token = response.data.access_token;
};

// 人気楽曲取得関数
export const getPopularSongs = async () => {
  if (!token) {
    await initializeToken();
  }
  const response = await axios.get(
    'https://api.spotify.com/v1/playlists/37i9dQZF1DX9vYRBO9gjDe/tracks',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// 楽曲検索フォームの関数
export const searchSongs = async (
  keyword: string,
  limit: number,
  offset: number
) => {
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      q: keyword,
      type: 'track',
      limit,
      offset,
    },
  });
  return response.data.tracks;
};
