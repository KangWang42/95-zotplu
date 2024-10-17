import fs from "fs";
import fetch from 'node-fetch';
import cron from 'node-cron';
import {
    writeFileSync
} from 'fs';
import cheerio from 'cheerio';


async function init() {
    // 假设 HTML 文件位于同一目录下
    const htmlPath = './index.html';
    const html = await fs.promises.readFile(htmlPath, 'utf8');

    // 使用 cheerio 加载 HTML
    const $ = cheerio.load(html);
    // 初始化 repos 数组
    const repos = [];
    // 解析所有的 .card 元素
    $('.card .name').each((i, element) => {
        const repoData = $(element).data('repo');
        if (repoData) {
            const [owner, repo] = repoData.split('/');
            repos.push({
                owner,
                repo
            });
        }
    });
    console.log(repos); // 确认已提取的 repos

    // 设置 cron 任务
    cron.schedule('0 */4 * * *', function () {
        console.log('Running fetch tasks every hour');
        repos.forEach(fetchReleaseData);
        repos.forEach(fetchReleaseoldData);
        repos.forEach(fetchReleasemeta);
    });

    console.log('Cron jobs scheduled');
}

init().catch(console.error);

function fetchReleaseData(repo) {
    const apiUrl = `https://api.github.com/repos/${repo.owner}/${repo.repo}/releases`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const now = new Date();
            const formattedDate = now.toLocaleString('zh-CN', {
                timeZone: 'Asia/Shanghai'
            });
            const result = {
                lastUpdated: formattedDate,
                data: data
            };
            const path = `./data/${repo.repo}-latest-new-release.json`;
            writeFileSync(path, JSON.stringify(result, null, 2));
            console.log(`Data saved for ${repo.repo} at ${formattedDate}`);
        })
        .catch(error => console.error(`Error fetching data for ${repo.repo}:`, error));
}

function fetchReleaseoldData(repo) {
    const apiUrl = `https://api.github.com/repos/${repo.owner}/${repo.repo}/releases/latest`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const now = new Date();
            const formattedDate = now.toLocaleString('zh-CN', {
                timeZone: 'Asia/Shanghai'
            });
            const result = {
                lastUpdated: formattedDate,
                data: data
            };
            const path = `./data/${repo.repo}-latest-old-release.json`;
            writeFileSync(path, JSON.stringify(result, null, 2));
            console.log(`Data saved for ${repo.repo} at ${formattedDate}`);
        })
        .catch(error => console.error(`Error fetching data for ${repo.repo}:`, error));
}

function fetchReleasemeta(repo) {
    const apiUrl = `https://api.github.com/repos/${repo.owner}/${repo.repo}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const now = new Date();
            const formattedDate = now.toLocaleString('zh-CN', {
                timeZone: 'Asia/Shanghai'
            });
            const result = {
                lastUpdated: formattedDate,
                data: data
            };
            const path = `./data/${repo.repo}-meta.json`;
            writeFileSync(path, JSON.stringify(result, null, 2));
            console.log(`Data saved for ${repo.repo} at ${formattedDate}`);
        })
        .catch(error => console.error(`Error fetching data for ${repo.repo}:`, error));
}