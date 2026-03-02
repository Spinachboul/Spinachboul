const { Octokit } = require("@octokit/rest");
const fs = require("fs");

const octokit = new Octokit({ auth: process.env.GHT });

async function run() {
    try {
        const { data: user } = await octokit.users.getByUsername({
            username: 'Spinachboul'
        });

        let template = fs.readFileSync("./template.svg", "utf8");

        const stats = {
            "{{USER}}": user.login,
            "{{REPOS}}": user.public_repos.toString().padStart(2, '0'), // Adds a leading zero for style
            "{{FOLLOWERS}}": user.followers.toString().padStart(2, '0'),
            "{{GISTS}}": user.public_gists.toString().padStart(2, '0'),
            "{{DATE}}": new Date().toLocaleDateString()
        };

        Object.keys(stats).forEach(key => {
            template = template.replaceAll(key, stats[key]);
        });

        fs.writeFileSync("./template.svg", template);
        console.log("Terminal stats generated!");

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

run();
