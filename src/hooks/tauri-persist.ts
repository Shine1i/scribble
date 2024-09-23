import { Store } from "@tauri-apps/plugin-store";
import { StateCreator, StoreApi, UseBoundStore } from "zustand";
import { PersistOptions, persist, StateStorage } from "zustand/middleware";

type TauriStorage = StateStorage & {
  store: Store;
};

export const tauriPersist = <T extends object>(
  name: string,
  fn: StateCreator<T, [["zustand/persist", unknown]], []>,
): StateCreator<T, [], []> => {
  const store = new Store(`${name}.bin`);

  const tauriStorage: TauriStorage = {
    store,
    getItem: async (key: string): Promise<string | null> => {
      const item = await store.get(key);
      return item as string | null;
    },
    setItem: async (key: string, value: string): Promise<void> => {
      await store.set(key, value);
    },
    removeItem: async (key: string): Promise<void> => {
      await store.delete(key);
    },
  };

  const persistOptions: PersistOptions<T> = {
    name,
    storage: tauriStorage as any,
  };

  return persist(fn, persistOptions) as StateCreator<T, [], []>;
};
