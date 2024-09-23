"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/tailwind/ui/input";
import { Label } from "@/components/tailwind/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tailwind/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/tailwind/ui/card";
import { useSettings } from "@/hooks/use-settings";
import { Store } from "@tauri-apps/plugin-store";
import { Button } from "@/components/tailwind/ui/button";

export default function GeneralPage() {
  const { settings, setSettings } = useSettings();

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-3xl font-bold">General Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Debounce Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="debounce-rate">Debounce Rate (ms):</Label>
          <Input
            id="debounce-rate"
            type="number"
            value={settings.debounceRate}
            onChange={(e) =>
              setSettings("debounceRate", Number(e.target.value))
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="backup-type">Backup Type:</Label>
          <Select
            value={settings.backup.type}
            onValueChange={(value) =>
              setSettings("backup.type", value as "s3" | "nextcloud")
            }
          >
            <SelectTrigger id="backup-type">
              <SelectValue placeholder="Select backup type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="s3">S3</SelectItem>
              <SelectItem value="nextcloud">Nextcloud</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="backup-uri">URI:</Label>
              <Input
                id="backup-uri"
                type="text"
                value={settings.backup.config.uri || ""}
                onChange={(e) =>
                  setSettings(`backup.config.uri`, e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="s3-access-key">
                {settings.backup.type === "s3" ? "Access Key:" : "Username:"}
              </Label>
              <Input
                id="s3-access-key"
                value={settings.backup.config.access.accessKey}
                onChange={(e) =>
                  setSettings(
                    `backup.config.access.accessKey`,
                    e.target.value,
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="s3-secret-key">
                {settings.backup.type === "s3" ? "Secret Key:" : "Password:"}
              </Label>
              <Input
                id="s3-secret-key"
                type="password"
                value={settings.backup.config.access.secretKey}
                onChange={(e) =>
                  setSettings(
                    `backup.config.access.secretKey`,
                    e.target.value,
                  )
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
