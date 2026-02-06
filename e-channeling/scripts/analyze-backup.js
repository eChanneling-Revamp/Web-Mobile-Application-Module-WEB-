const fs = require("fs");
const path = require("path");

const backupPath = path.join(
    __dirname,
    "../prisma/backup_prisma_2026-02-04T17-28-10.json",
);
const backupData = JSON.parse(fs.readFileSync(backupPath, "utf-8"));

console.log("Tables with data in backup:\n");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

let totalRecords = 0;
Object.keys(backupData.data).forEach((key) => {
    if (
        Array.isArray(backupData.data[key]) &&
        backupData.data[key].length > 0
    ) {
        console.log(
            `  ${key.padEnd(35)} : ${backupData.data[key].length} records`,
        );
        totalRecords += backupData.data[key].length;
    }
});

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`Total: ${totalRecords} records`);
console.log(`Expected: ${backupData.metadata.totalRecords} records`);
