const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL environment variable is not set!");
    console.error(
        "\nPlease create a .env file in the e-channeling directory with:",
    );
    console.error('DATABASE_URL="your-postgresql-connection-string"\n');
    console.error("Example:");
    console.error(
        'DATABASE_URL="postgresql://user:password@localhost:5432/dbname"\n',
    );
    process.exit(1);
}

// Use the same Prisma setup as your project
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: ["query", "error"],
});

async function restoreBackup() {
    try {
        console.log("🔄 Starting database restoration...\n");

        // Read the backup file
        const backupPath = path.join(
            __dirname,
            "../prisma/backup_prisma_2026-02-04T17-28-10.json",
        );
        const backupData = JSON.parse(fs.readFileSync(backupPath, "utf-8"));

        console.log(`📦 Backup Information:`);
        console.log(`   Timestamp: ${backupData.metadata.timestamp}`);
        console.log(`   Database: ${backupData.metadata.database}`);
        console.log(`   Total Records: ${backupData.metadata.totalRecords}`);
        console.log(`   Tables: ${backupData.metadata.tables}\n`);

        let totalInserted = 0;

        // 1. Packages (independent)
        if (backupData.data.packages?.length > 0) {
            console.log(
                `📌 Inserting packages... (${backupData.data.packages.length} records)`,
            );
            for (const pkg of backupData.data.packages) {
                await prisma.packages.create({ data: pkg });
            }
            totalInserted += backupData.data.packages.length;
            console.log("   ✅ Done\n");
        }

        // 2. Corporate Employees (independent)
        if (backupData.data.corporate_employees?.length > 0) {
            console.log(
                `📌 Inserting corporate_employees... (${backupData.data.corporate_employees.length} records)`,
            );
            for (const emp of backupData.data.corporate_employees) {
                await prisma.corporate_employees.create({ data: emp });
            }
            totalInserted += backupData.data.corporate_employees.length;
            console.log("   ✅ Done\n");
        }

        // 3. Users (depends on packages & corporate_employees)
        if (backupData.data.user?.length > 0) {
            console.log(
                `📌 Inserting users... (${backupData.data.user.length} records)`,
            );
            for (const user of backupData.data.user) {
                await prisma.user.create({ data: user });
            }
            totalInserted += backupData.data.user.length;
            console.log("   ✅ Done\n");
        }

        // 4. Agents (depends on users)
        if (backupData.data.agent?.length > 0) {
            console.log(
                `📌 Inserting agents... (${backupData.data.agent.length} records)`,
            );
            for (const agent of backupData.data.agent) {
                await prisma.agent.create({ data: agent });
            }
            totalInserted += backupData.data.agent.length;
            console.log("   ✅ Done\n");
        }

        // 5. Hospitals (independent)
        if (backupData.data.hospital?.length > 0) {
            console.log(
                `📌 Inserting hospitals... (${backupData.data.hospital.length} records)`,
            );
            for (const hospital of backupData.data.hospital) {
                await prisma.hospital.create({ data: hospital });
            }
            totalInserted += backupData.data.hospital.length;
            console.log("   ✅ Done\n");
        }

        // 6. Doctors (independent)
        if (backupData.data.doctor?.length > 0) {
            console.log(
                `📌 Inserting doctors... (${backupData.data.doctor.length} records)`,
            );
            for (const doctor of backupData.data.doctor) {
                await prisma.doctor.create({ data: doctor });
            }
            totalInserted += backupData.data.doctor.length;
            console.log("   ✅ Done\n");
        }

        // 7. Nurse Details (depends on hospitals)
        if (backupData.data.nurse_Detail?.length > 0) {
            console.log(
                `📌 Inserting nurse_details... (${backupData.data.nurse_Detail.length} records)`,
            );
            for (const nurse of backupData.data.nurse_Detail) {
                await prisma.nurse_Detail.create({ data: nurse });
            }
            totalInserted += backupData.data.nurse_Detail.length;
            console.log("   ✅ Done\n");
        }

        // 8. Nurses (depends on hospitals)
        if (backupData.data.nurse?.length > 0) {
            console.log(
                `📌 Inserting nurses... (${backupData.data.nurse.length} records)`,
            );
            for (const nurse of backupData.data.nurse) {
                await prisma.nurse.create({ data: nurse });
            }
            totalInserted += backupData.data.nurse.length;
            console.log("   ✅ Done\n");
        }

        // 9. Doctor Hospitals (junction table - depends on doctors and hospitals)
        if (backupData.data.doctorHospital?.length > 0) {
            console.log(
                `📌 Inserting doctor_hospitals... (${backupData.data.doctorHospital.length} records)`,
            );
            for (const dh of backupData.data.doctorHospital) {
                await prisma.doctorHospital.create({ data: dh });
            }
            totalInserted += backupData.data.doctorHospital.length;
            console.log("   ✅ Done\n");
        }

        // 10. Sessions (depends on doctors, hospitals, nurses)
        if (backupData.data.session?.length > 0) {
            console.log(
                `📌 Inserting sessions... (${backupData.data.session.length} records)`,
            );
            for (const session of backupData.data.session) {
                await prisma.session.create({ data: session });
            }
            totalInserted += backupData.data.session.length;
            console.log("   ✅ Done\n");
        }

        // 11. Patients (depends on sessions)
        if (backupData.data.patients?.length > 0) {
            console.log(
                `📌 Inserting patients... (${backupData.data.patients.length} records)`,
            );
            for (const patient of backupData.data.patients) {
                await prisma.patients.create({ data: patient });
            }
            totalInserted += backupData.data.patients.length;
            console.log("   ✅ Done\n");
        }

        // 12. Agent Payments (depends on agents)
        if (backupData.data.agentPayment?.length > 0) {
            console.log(
                `📌 Inserting agent_payments... (${backupData.data.agentPayment.length} records)`,
            );
            for (const payment of backupData.data.agentPayment) {
                await prisma.agentPayment.create({ data: payment });
            }
            totalInserted += backupData.data.agentPayment.length;
            console.log("   ✅ Done\n");
        }

        // 13. Agent Appointments (depends on agents, doctors, payments)
        if (backupData.data.agentAppointment?.length > 0) {
            console.log(
                `📌 Inserting agent_appointments... (${backupData.data.agentAppointment.length} records)`,
            );
            for (const appt of backupData.data.agentAppointment) {
                await prisma.agentAppointment.create({ data: appt });
            }
            totalInserted += backupData.data.agentAppointment.length;
            console.log("   ✅ Done\n");
        }

        // 14. Agent Reports (depends on agents)
        if (backupData.data.agentReport?.length > 0) {
            console.log(
                `📌 Inserting agent_reports... (${backupData.data.agentReport.length} records)`,
            );
            for (const report of backupData.data.agentReport) {
                await prisma.agentReport.create({ data: report });
            }
            totalInserted += backupData.data.agentReport.length;
            console.log("   ✅ Done\n");
        }

        // 15. Agent Integrations (depends on agents)
        if (backupData.data.agentIntegration?.length > 0) {
            console.log(
                `📌 Inserting agent_integrations... (${backupData.data.agentIntegration.length} records)`,
            );
            for (const integration of backupData.data.agentIntegration) {
                await prisma.agentIntegration.create({ data: integration });
            }
            totalInserted += backupData.data.agentIntegration.length;
            console.log("   ✅ Done\n");
        }

        // 16. Refresh Tokens
        if (backupData.data.refreshToken?.length > 0) {
            console.log(
                `📌 Inserting refresh_tokens... (${backupData.data.refreshToken.length} records)`,
            );
            for (const token of backupData.data.refreshToken) {
                await prisma.refreshToken.create({ data: token });
            }
            totalInserted += backupData.data.refreshToken.length;
            console.log("   ✅ Done\n");
        }

        // 17. Notifications (depends on users)
        if (backupData.data.notifications?.length > 0) {
            console.log(
                `📌 Inserting notifications... (${backupData.data.notifications.length} records)`,
            );
            for (const notification of backupData.data.notifications) {
                await prisma.notifications.create({ data: notification });
            }
            totalInserted += backupData.data.notifications.length;
            console.log("   ✅ Done\n");
        }

        // 18. Activity Logs
        if (backupData.data.activity_logs?.length > 0) {
            console.log(
                `📌 Inserting activity_logs... (${backupData.data.activity_logs.length} records)`,
            );
            for (const log of backupData.data.activity_logs) {
                await prisma.activity_logs.create({ data: log });
            }
            totalInserted += backupData.data.activity_logs.length;
            console.log("   ✅ Done\n");
        }

        // 19. Audit Logs
        if (backupData.data.audit_logs?.length > 0) {
            console.log(
                `📌 Inserting audit_logs... (${backupData.data.audit_logs.length} records)`,
            );
            for (const log of backupData.data.audit_logs) {
                await prisma.audit_logs.create({ data: log });
            }
            totalInserted += backupData.data.audit_logs.length;
            console.log("   ✅ Done\n");
        }

        // 20. Customers
        if (backupData.data.customers?.length > 0) {
            console.log(
                `📌 Inserting customers... (${backupData.data.customers.length} records)`,
            );
            for (const customer of backupData.data.customers) {
                await prisma.customers.create({ data: customer });
            }
            totalInserted += backupData.data.customers.length;
            console.log("   ✅ Done\n");
        }

        // 21. Appointments (depends on users, sessions, agents)
        if (backupData.data.appointment?.length > 0) {
            console.log(
                `📌 Inserting appointments... (${backupData.data.appointment.length} records)`,
            );
            for (const appointment of backupData.data.appointment) {
                await prisma.appointment.create({ data: appointment });
            }
            totalInserted += backupData.data.appointment.length;
            console.log("   ✅ Done\n");
        }

        // 22. Prescriptions (depends on appointments, doctors)
        if (backupData.data.prescriptions?.length > 0) {
            console.log(
                `📌 Inserting prescriptions... (${backupData.data.prescriptions.length} records)`,
            );
            for (const prescription of backupData.data.prescriptions) {
                await prisma.prescription.create({ data: prescription });
            }
            totalInserted += backupData.data.prescriptions.length;
            console.log("   ✅ Done\n");
        }

        // 23. Payments (depends on appointments)
        if (backupData.data.payments?.length > 0) {
            console.log(
                `📌 Inserting payments... (${backupData.data.payments.length} records)`,
            );
            for (const payment of backupData.data.payments) {
                await prisma.payments.create({ data: payment });
            }
            totalInserted += backupData.data.payments.length;
            console.log("   ✅ Done\n");
        }

        // 24. Time Slots
        if (backupData.data.time_slots?.length > 0) {
            console.log(
                `📌 Inserting time_slots... (${backupData.data.time_slots.length} records)`,
            );
            for (const slot of backupData.data.time_slots) {
                await prisma.time_slots.create({ data: slot });
            }
            totalInserted += backupData.data.time_slots.length;
            console.log("   ✅ Done\n");
        }

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`✨ Restoration Complete!`);
        console.log(`   Total records inserted: ${totalInserted}`);
        console.log(`   Expected records: ${backupData.metadata.totalRecords}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    } catch (error) {
        console.error("\n❌ Error during restoration:", error);
        console.error("\nPlease check:");
        console.error("  1. Database connection is active");
        console.error(
            "  2. Database is empty (run: npx prisma db push --force-reset)",
        );
        console.error("  3. Backup file path is correct");
        throw error;
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

// Run the restoration
restoreBackup()
    .then(() => {
        console.log("🎉 Database restoration completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("💥 Fatal error:", error);
        process.exit(1);
    });
