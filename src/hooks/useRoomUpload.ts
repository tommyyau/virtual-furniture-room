import { useCallback } from 'react';
import { useRoomStore } from '../store';
import type { RoomImage } from '../types';

export function useRoomUpload() {
  const { roomImage, setRoomImage } = useRoomStore();

  const uploadRoom = useCallback(
    (file: File): Promise<RoomImage> => {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
          const roomImage: RoomImage = {
            id: crypto.randomUUID(),
            url,
            file,
            width: img.naturalWidth,
            height: img.naturalHeight,
          };
          setRoomImage(roomImage);
          resolve(roomImage);
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load image'));
        };

        img.src = url;
      });
    },
    [setRoomImage]
  );

  const clearRoom = useCallback(() => {
    if (roomImage?.url.startsWith('blob:')) {
      URL.revokeObjectURL(roomImage.url);
    }
    setRoomImage(null);
  }, [roomImage, setRoomImage]);

  return {
    roomImage,
    uploadRoom,
    clearRoom,
    hasRoom: !!roomImage,
  };
}
