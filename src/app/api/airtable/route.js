import { NextResponse } from "next/server";
import Airtable from "airtable";

const fetchAirtableData = async () => {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.BASE_ID);
  const records = await base("Questions").select({ view: "MAIN" }).all();
  const fields = records
    .filter((item) => Object.keys(item.fields).length !== 0) // exclude items where fields is empty
    .map((item) => item.fields);

  return {
    airtableData: JSON.parse(JSON.stringify(fields)),
  };
};

export async function GET(request) {
  try {
    const airtableData = await getAirtableData(); // Simplified call
    return NextResponse.json({ result: airtableData });
  } catch (error) {
    console.error("Error fetching Airtable data:", error);
    return NextResponse.error(new Error("Failed to fetch Airtable data"));
  }
}