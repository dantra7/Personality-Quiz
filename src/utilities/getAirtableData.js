import Airtable from "airtable";
import route from '../app/api/airtable/route.js'

const getAirtableData = async (options) => {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.BASE_ID);
    const records = await base('One').select({}).all();
    const processedData = records.map((record) => {
      return {
        id: record.id,
        question: record.fields.question,
        options: [record.fields.One, record.fields.Two],
      };
    });
    console.log('Processed Data:', processedData);
    return processedData;
  }
 
export default getAirtableData;