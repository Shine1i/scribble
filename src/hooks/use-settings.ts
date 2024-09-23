import { create } from "zustand";
import { tauriPersist } from "./tauri-persist";

interface SettingsStore {
  settings: {
    debounceRate: number;
    backup: {
      enabled: boolean;
      type: "s3" | "nextcloud";
      config: {
        uri: string;
        access: {
          [key: string]: string;
        };
      };
    };
  };
  setSettings: (path: string, value: any) => void;
}

export const useSettings = create(
  tauriPersist<SettingsStore>("settings", (set, get) => ({
    settings: {
      debounceRate: 2000,
      backup: {
        enabled: false,
        type: "s3",
        config: {
          uri: "",
          access: {

					},
        },
      },
    },
    setSettings: (path: string, value: any) => {
			const state = get()
      const newSettings = structuredClone(state.settings)
      const keys = path.split(".");
      let current = newSettings;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i] as keyof typeof current] = {} as any;
        }
        current = current[keys[i] as keyof typeof current] as any;
      }

      current[keys[keys.length - 1] as keyof typeof current] = value;
			set({ settings: newSettings })
      return { settings: newSettings };
    },
  })),
);
