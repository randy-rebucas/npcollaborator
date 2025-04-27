import Config from "@/models/Config";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  const config = await Config.findOne({});
  
  // Return specific key if requested, otherwise return full config
  if (key) {
    return NextResponse.json({ [key]: config?.[key] });
  }
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  const data = await req.json();
  
  try {
    // Update with all provided data
    const config = await Config.findOneAndUpdate(
      {},
      { $set: data },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true,
        strict: false  // Allow fields not specified in schema
      }
    );
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Config update error:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' }, 
      { status: 500 }
    );
  }
}