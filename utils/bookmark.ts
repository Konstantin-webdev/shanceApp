import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = (id: number) => `@bookmark_${id}`;

export const saveBookmark = async (
  professionId: number,
  questionIndex: number,
) => {
  await AsyncStorage.setItem(KEY(professionId), questionIndex.toString());
};

export const loadBookmark = async (
  professionId: number,
): Promise<number | null> => {
  const val = await AsyncStorage.getItem(KEY(professionId));
  return val ? parseInt(val, 10) : null;
};

export const clearBookmark = async (professionId: number) => {
  await AsyncStorage.removeItem(KEY(professionId));
};
