"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { openDB } from "idb";

type RecordItem = {
  id: string;
  title: string;
};

function getDB() {
  return openDB("demo2-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("records")) {
        db.createObjectStore("records", {
          keyPath: "id",
        });
      }
    },
  });
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [records, setRecords] = useState<RecordItem[]>([]);

  useEffect(() => {
    getDB()
      .then((db) => db.getAll("records"))
      .then(setRecords)
      .catch(console.error);
  }, []);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) return;

    const record = {
      //id: crypto.randomUUID(),
      id: `${Date.now()}-${Math.random()}`,
      title: title.trim(),
    };

    const db = await getDB();
    await db.put("records", record);

    setRecords((prev) => [...prev, record]);
    setTitle("");
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Demo2 Offline App</h1>

      <form onSubmit={save}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Record name"
          required
        />

        <button type="submit">Save</button>
      </form>

      <h2>Saved Records</h2>

      <ul>
        {records.map((record) => (
          <li key={record.id}>{record.title}</li>
        ))}
      </ul>
    </main>
  );
}
