const { PrismaClient } = require("@prisma/client")

const database = new PrismaClient();

const main = async () => {
    try {
        await database.category.createMany({
            data: [
                { name: "Software Engineer" },
                { name: "Data Scientist" },
                { name: "DevOps Engineer" },
                { name: "Frontend Developer" },
                { name: "Backend Developer" },
                { name: "Full Stack Developer" },
                { name: "Machine Learning Engineer" },
                { name: "Cloud Engineer" },
                { name: "Mobile App Developer" },
                { name: "UI/UX Designer" },
                { name: "Systems Analyst" },
                { name: "Network Engineer" },
                { name: "Database Administrator" },
                { name: "Cybersecurity Analyst" },
                { name: "Game Developer" },
                { name: "Web Developer" },
                { name: "Technical Support Engineer" },
                { name: "Business Intelligence Analyst" },
                { name: "Quality Assurance Engineer" },
                { name: "Site Reliability Engineer" },
                { name: "Blockchain Developer" },
                { name: "Data Engineer" },
                { name: "SEO Specialist" },
                { name: "IT Project Manager" },
                { name: "Product Manager" },
                { name: "Technical Writer" },
                { name: "Research Scientist" },
                { name: "Augmented Reality Developer" },
                { name: "Virtual Reality Developer" },
                { name: "Robotics Engineer" },
                { name: "Embedded Systems Engineer" },
                { name: "IT Consultant" },
                { name: "Digital Marketing Specialist" },
                { name: "E-commerce Specialist" },
                { name: "Salesforce Developer" },
                { name: "SAP Consultant" },
                { name: "Data Analyst" },
                { name: "IT Security Specialist" },
                { name: "Web Architect" },
                { name: "Technical Account Manager" },
                { name: "Application Support Analyst" },
                { name: "Infrastructure Engineer" },
                { name: "Penetration Tester" },
                { name: "Firmware Engineer" }
            ]
        })
        console.log("Success")
    } catch (error) {
        
    }
}

main();