import store from '@/store';
import type { MusicItemType } from '@/hooks/useFormatSong';

/**
 * @description 播放上一首歌曲
 * @param { number } modeType - 播放模式类型
 */
export async function playPrevSong(modeType: number): Promise<void> {
  const playSongItem = store.getters['music/playSongItem'];
  const songPlaylist = store.getters['music/songPlaylist'];

  if (songPlaylist.length === 0) {
    return;
  }

  const index: number = songPlaylist.findIndex?.(
    (item: MusicItemType) => item.id === playSongItem.id
  );

  if (index === -1 || index === 0) {
    store.commit('music/setPlaySongItem', songPlaylist.at(-1));
    return;
  }

  // 随机播放
  if (modeType === 2) {
    const index = Math.floor(Math.random() * songPlaylist.length);
    store.commit('music/setPlaySongItem', songPlaylist[index]);
    return;
  }

  store.commit('music/setPlaySongItem', songPlaylist[index - 1]);
}

/**
 * @description 播放下一首歌曲
 * @param { number } modeType - 播放模式类型
 */
export async function playNextSong(modeType: number): Promise<void> {
  const playSongItem = store.getters['music/playSongItem'];
  const songPlaylist = store.getters['music/songPlaylist'];

  if (songPlaylist.length === 0) {
    return;
  }

  const index: number = songPlaylist.findIndex?.(
    (item: MusicItemType) => item.id === playSongItem.id
  );

  if (index === -1 || index === songPlaylist.length - 1) {
    store.commit('music/setPlaySongItem', songPlaylist[0]);
    return;
  }

  // 随机播放
  if (modeType === 2) {
    const index = Math.floor(Math.random() * songPlaylist.length);
    store.commit('music/setPlaySongItem', songPlaylist[index]);
    return;
  }

  store.commit('music/setPlaySongItem', songPlaylist[index + 1]);
}
