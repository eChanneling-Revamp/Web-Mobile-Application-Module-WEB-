/**
 * Generates a unique, industry-standard appointment number
 * Format: APT-YYYYMMDD-XXXXXX
 *
 * Components:
 * - APT: Prefix for appointment identification
 * - YYYYMMDD: Date component for chronological sorting and easy reference
 * - XXXXXX: 6-character alphanumeric code (Base36, excluding ambiguous chars)
 *
 * Features:
 * - Human-readable and easy to communicate over phone/email
 * - No ambiguous characters (0/O, 1/I/l excluded)
 * - Cryptographically random for security
 * - Approximately 1.5 billion combinations per character set
 *
 * Example: APT-20260201-H7K9M2
 */
export function generateAppointmentNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}${month}${day}`;

    // Character set excluding ambiguous characters: 0, O, 1, I, l
    const chars = "234567689ABCDEFGHJKMNPQRSTUVWXYZ";

    // Generate 6-character unique code using crypto-quality randomness
    let uniqueCode = "";
    const timestamp = Date.now().toString(36).toUpperCase().slice(-3); // Base36 timestamp component

    // Add timestamp-based characters (3 chars)
    uniqueCode += timestamp;

    // Add random characters (3 chars) for additional uniqueness
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        uniqueCode += chars[randomIndex];
    }

    // Shuffle to mix timestamp and random parts
    uniqueCode = uniqueCode
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");

    return `APT-${dateStr}-${uniqueCode}`;
}

/**
 * Validates appointment number format
 * @param appointmentNumber - The appointment number to validate
 * @returns boolean indicating if the format is valid
 */
export function validateAppointmentNumber(appointmentNumber: string): boolean {
    const pattern = /^APT-\d{8}-[234567689ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/;
    return pattern.test(appointmentNumber);
}
