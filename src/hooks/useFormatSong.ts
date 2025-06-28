export type SongType = {
  id: number;
  name: string;
  album?: {
    picUrl: string;
  };
  al?: {
    picUrl: string;
  };
  radio?: {
    picUrl: string;
  };
  picUrl?: string;
  img80x80?: string;
  dt?: number;
  duration?: number;
  mv?: number;
  artists?: {
    id: number;
    name: string;
  }[];
  ar?: {
    id: number;
    name: string;
  }[];
};

export type MusicItemType = {
  id: number | undefined;
  name: string;
  picUrl: string;
  duration: number;
  mv: number;
  artists: {
    id: string | number;
    name: string;
  }[];
};

/**
 * @description 歌曲数据处理成播放器所需数据
 * @param { Object } song - 歌曲数据
 */
function useFormatSong(song: SongType): MusicItemType {
  const musicItem: MusicItemType = {
    id: undefined,
    name: '',
    picUrl: '',
    duration: 0,
    mv: 0,
    artists: []
  };

  musicItem.id = song.id;
  musicItem.name = song.name ?? '';
  musicItem.picUrl =
    song.album?.picUrl ??
    song.al?.picUrl ??
    song.radio?.picUrl ??
    song.img80x80 ??
    song.picUrl ??
    '';
  musicItem.duration = song.dt ?? song.duration ?? 0;
  musicItem.mv = song.mv ?? 0;

  const artists = song.artists ?? song.ar ?? [];
  artists.forEach?.((item: { id: number; name: string }) => {
    musicItem.artists.push({ id: item.id, name: item.name });
  });

  return musicItem;
}

export default useFormatSong;
