import Dexie from "dexie";

export const db = new Dexie("talentflowDB");

db.version(1).stores({
  jobs: "++id, title, slug, status, tags, order",
  candidates: "++id, name, email, stage",
  assessments: "id" 
});
