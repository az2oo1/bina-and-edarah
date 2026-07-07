import { prisma } from "./db.js";

export interface TechHubProject {
  id: string;
  nameAr: string;
  nameEn: string;
  units: TechHubUnit[];
}

export interface TechHubUnit {
  unitNumber: string;
  price: number;
}

export interface TechHubContract {
  contractNumber: string;
  renterName: string;
  renterPhone?: string | null;
  buildingName: string;
  unitNumber: string;
  contractEndDate: string;
  rentAmount: number;
  installments: {
    dueDate: string;
    paidDate?: string | null;
    amount: string;
  }[];
}

/**
 * Fetches real or simulated properties/projects from Saudi NHC TechHub.
 */
export async function fetchTechHubProperties(settings: {
  techhubEnabled: boolean;
  techhubClientId?: string | null;
  techhubClientSecret?: string | null;
  techhubApiKey?: string | null;
  techhubSandboxMode: boolean;
}): Promise<TechHubProject[]> {
  if (settings.techhubSandboxMode) {
    // Return mock properties in sandbox mode
    return [
      {
        id: "proj-1",
        nameAr: "مجمع النرجس السكني",
        nameEn: "Al-Narjis Residential Complex",
        units: [
          { unitNumber: "101", price: 45000 },
          { unitNumber: "102", price: 45000 },
          { unitNumber: "103", price: 48000 },
          { unitNumber: "104", price: 50000 }
        ]
      },
      {
        id: "proj-2",
        nameAr: "برج الياسمين العقاري",
        nameEn: "Al-Yasmin Tower",
        units: [
          { unitNumber: "A01", price: 65000 },
          { unitNumber: "A02", price: 70000 },
          { unitNumber: "A03", price: 68000 }
        ]
      }
    ];
  }

  // Live Integration Code using OAuth2 token
  const token = await getAccessToken(settings);
  if (!token) throw new Error("Authentication failed with TechHub.");

  // Request actual properties/units from NHC TechHub endpoint
  const response = await fetch("https://techhub.nhci.sa/api/v1/properties", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "X-API-Key": settings.techhubApiKey || "",
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch properties from TechHub: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches real or simulated lease contracts (Customers) from Saudi NHC TechHub.
 */
export async function fetchTechHubContracts(settings: {
  techhubEnabled: boolean;
  techhubClientId?: string | null;
  techhubClientSecret?: string | null;
  techhubApiKey?: string | null;
  techhubSandboxMode: boolean;
}): Promise<TechHubContract[]> {
  if (settings.techhubSandboxMode) {
    const today = new Date();
    const formatOffsetDate = (offsetMonths: number, day = 1) => {
      const d = new Date(today.getFullYear(), today.getMonth() + offsetMonths, day);
      return d.toISOString().split("T")[0];
    };

    // Return mock active contracts, including some with missing phone numbers
    return [
      {
        contractNumber: "CON-78901",
        renterName: "خالد عبد الرحمن السديري",
        renterPhone: "966551122334", // Has valid phone
        buildingName: "مجمع النرجس السكني",
        unitNumber: "101",
        contractEndDate: formatOffsetDate(12),
        rentAmount: 45000,
        installments: [
          { dueDate: formatOffsetDate(-6), paidDate: formatOffsetDate(-6), amount: "22500" },
          { dueDate: formatOffsetDate(0), paidDate: "", amount: "22500" } // Due today
        ]
      },
      {
        contractNumber: "CON-78902",
        renterName: "ياسر بن صالح الحربي",
        renterPhone: null, // NO PHONE NUMBER PROVIDED (Edge case!)
        buildingName: "مجمع النرجس السكني",
        unitNumber: "102",
        contractEndDate: formatOffsetDate(6),
        rentAmount: 45000,
        installments: [
          { dueDate: formatOffsetDate(-2), paidDate: formatOffsetDate(-2), amount: "22500" },
          { dueDate: formatOffsetDate(4), paidDate: "", amount: "22500" }
        ]
      },
      {
        contractNumber: "CON-78903",
        renterName: "عبدالله بن محمد العتيبي",
        renterPhone: "0504433221", // Has phone starting with 05
        buildingName: "مجمع النرجس السكني",
        unitNumber: "103",
        contractEndDate: formatOffsetDate(3),
        rentAmount: 48000,
        installments: [
          { dueDate: formatOffsetDate(-3), paidDate: formatOffsetDate(-3), amount: "24000" },
          { dueDate: formatOffsetDate(3), paidDate: "", amount: "24000" }
        ]
      },
      {
        contractNumber: "CON-78904",
        renterName: "فهد بن سليمان الجاسر",
        renterPhone: "", // EMPTY PHONE NUMBER (Edge case!)
        buildingName: "برج الياسمين العقاري",
        unitNumber: "A01",
        contractEndDate: formatOffsetDate(18),
        rentAmount: 65000,
        installments: [
          { dueDate: formatOffsetDate(-1), paidDate: formatOffsetDate(-1), amount: "32500" },
          { dueDate: formatOffsetDate(5), paidDate: "", amount: "32500" }
        ]
      }
    ];
  }

  // Live Integration Code using OAuth2 token
  const token = await getAccessToken(settings);
  if (!token) throw new Error("Authentication failed with TechHub.");

  // Request actual contracts from NHC TechHub endpoint
  const response = await fetch("https://techhub.nhci.sa/api/v1/contracts", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "X-API-Key": settings.techhubApiKey || "",
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch contracts from TechHub: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Handles OAuth2 Client Credentials flow for NHC TechHub API.
 */
async function getAccessToken(settings: {
  techhubClientId?: string | null;
  techhubClientSecret?: string | null;
}): Promise<string | null> {
  if (!settings.techhubClientId || !settings.techhubClientSecret) {
    throw new Error("Missing Client ID or Client Secret for TechHub API connection.");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", settings.techhubClientId);
  params.append("client_secret", settings.techhubClientSecret);

  const response = await fetch("https://techhub.nhci.sa/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  if (!response.ok) {
    throw new Error(`TechHub Authentication failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token || null;
}
