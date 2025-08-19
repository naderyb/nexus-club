import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// 🚀 Database connection setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Update the interface
interface NewbieRequest {
  nom: string;
  prenom: string;
  email: string; // 🚀 Add email
  classe: string;
  hobbies?: string | null;
  motivation: string;
  additional_notes?: string | null;
}

export async function POST(request: NextRequest) {
  let client;

  try {
    console.log("🚀 API Route called - /api/newbies");

    // Get database client
    client = await pool.connect();
    console.log("🔗 Database connected successfully");

    // Parse the request body
    const body: NewbieRequest = await request.json();
    console.log("📝 Received data:", body);

    // Basic validation
    if (
      !body.nom ||
      !body.prenom ||
      !body.email ||
      !body.classe ||
      !body.motivation
    ) {
      console.log("❌ Validation failed - missing required fields");
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    // Add email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      console.log("❌ Invalid email format:", body.email);
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Clean data
    const cleanData = {
      nom: body.nom.trim(),
      prenom: body.prenom.trim(),
      email: body.email.trim().toLowerCase(), // 🚀 Add email (lowercase)
      classe: body.classe,
      hobbies: body.hobbies?.trim() || null,
      motivation: body.motivation.trim(),
      additional_notes: body.additional_notes?.trim() || null,
    };

    // Validate classe
    const validClasses = ["1CP", "2CP", "1CS", "2CS", "3CS"];
    if (!validClasses.includes(cleanData.classe)) {
      console.log("❌ Invalid classe:", cleanData.classe);
      return NextResponse.json({ error: "Classe non valide" }, { status: 400 });
    }

    console.log("✅ Data validation passed:", cleanData);

    // 🚀 Insert into database
    const insertQuery = `
      INSERT INTO newbies (
        nom, 
        prenom, 
        email, 
        classe, 
        hobbies, 
        motivation, 
        additional_notes, 
        created_at, 
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), 'pending')
      RETURNING id, nom, prenom, email, classe, created_at, status
    `;

    const values = [
      cleanData.nom,
      cleanData.prenom,
      cleanData.email, // 🚀 Add email value
      cleanData.classe,
      cleanData.hobbies,
      cleanData.motivation,
      cleanData.additional_notes,
    ];

    console.log("🔄 Executing database query...");
    const result = await client.query(insertQuery, values);
    const newNewbie = result.rows[0];

    console.log("✅ Newbie inserted successfully:", newNewbie);

    return NextResponse.json(
      {
        message: "Votre inscription a été enregistrée avec succès !",
        data: {
          id: newNewbie.id,
          nom: newNewbie.nom,
          prenom: newNewbie.prenom,
          email: newNewbie.email,
          classe: newNewbie.classe,
          status: newNewbie.status,
          created_at: newNewbie.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Full error details:", error);

    // Handle specific database errors
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return NextResponse.json(
          { error: "Cette inscription existe déjà" },
          { status: 409 }
        );
      }

      if (error.code === "42P01") {
        // Table doesn't exist
        console.error("❌ Table 'newbies' doesn't exist in database");
        return NextResponse.json(
          { error: "Erreur de configuration de base de données" },
          { status: 500 }
        );
      }

      if (error.code === "42703") {
        // Column doesn't exist
        console.error("❌ Column doesn't exist in table");
        return NextResponse.json(
          { error: "Erreur de structure de base de données" },
          { status: 500 }
        );
      }
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Format de données invalide" },
        { status: 400 }
      );
    }

    // Connection errors
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string" &&
      error.message.includes("connect")
    ) {
      console.error("❌ Database connection failed");
      return NextResponse.json(
        { error: "Erreur de connexion à la base de données" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur. Veuillez réessayer." },
      { status: 500 }
    );
  } finally {
    // Always release the client
    if (client) {
      client.release();
      console.log("🔌 Database client released");
    }
  }
}

// Test database connection
export async function GET() {
  let client;

  try {
    client = await pool.connect();

    // Test query
    const result = await client.query("SELECT NOW() as current_time");

    return NextResponse.json({
      message: "Database connection successful!",
      time: result.rows[0].current_time,
      database_url: process.env.DATABASE_URL ? "Set" : "Not set",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        database_url: process.env.DATABASE_URL ? "Set" : "Not set",
      },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}

// Handle other HTTP methods
export async function PUT() {
  return NextResponse.json(
    { error: "Méthode PUT non autorisée" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Méthode DELETE non autorisée" },
    { status: 405 }
  );
}
