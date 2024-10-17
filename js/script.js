document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card:not(.forbid)');
    const names = document.querySelectorAll('.name:not(.zoterodown)');

    fetch('./data/zotero-style-latest-old-release.json')
        .then(response => response.json())
        .then(data => {
            const lastUpdated = document.getElementById('lastUpdated');
            lastUpdated.textContent = `页面最新更新时间:${data.lastUpdated}`;
            console.log(data.lastUpdated); // 移动到这里
        })
        .catch(error => console.error('Error loading data:', error));

    // 遍历每个卡片并加载各自的数据
    cards.forEach(card => {
        const repoName = card.querySelector('.name').textContent;
        const jsonPath = `./data/${repoName}-latest-new-release.json`;
        const jsonPath_OLD = `./data/${repoName}-latest-old-release.json`;
        const jsonPath_meta = `./data/${repoName}-meta.json`;

        fetch(jsonPath)
            .then(response => response.json())
            .then(data => {
                const downloadCount = card.querySelector('.downloadCount');
                const downloadBtn = card.querySelector('.zoteornew');
                const changedate = card.querySelector('.changedate');
                const pluginContent = card.querySelector('.plugin-content');
                pluginContent.textContent = `${data.data[0].name}` || '版本信息不可用';
                downloadCount.textContent = '下载次数：' + (data.data[0].assets.length > 0 ? data.data[0].assets[0].download_count : 'No data');
                downloadBtn.href = (data.data[0].assets.length > 0 ? data.data[0].assets[0].browser_download_url : '#');
                changedate.textContent = "最近更新时间:" + (data.data[0].assets.length > 0 ? data.data[0].published_at.slice(0, 10) : 'No data');
            })
            .catch(error => {
                console.error('Error loading data from', jsonPath, ':', error);
                card.querySelector('.downloadCount').textContent = '下载信息加载失败';
            });


        /*          
fetch(jsonPath_meta)
    .then(response => response.json())
    .then(data => {
       const pluginContent = card.querySelector('.plugin-content');// 确保元素存在
           pluginContent.textContent = `插件介绍：${data.description}`;
            console.log("Repository Description:", description);
    })
    
.catch(error => {
        console.error('Error loading data from', jsonPath_meta, ':', error);
        const pluginContent = card.querySelector('.plugin-content');
        if (pluginContent) {
            pluginContent.textContent = '版本信息加载失败';
        }
        const downloadCount = card.querySelector('.downloadCount');
        if (downloadCount) {
            downloadCount.textContent = '下载信息加载失败';
        }
    });
       */

        fetch(jsonPath_OLD)
            .then(response => response.json())
            .then(data => {
                const downloadBtn_old = card.querySelector('.zoteorold');
                downloadBtn_old.href = (data.data.assets.length > 0 ? data.data.assets[0].browser_download_url : '#');
            })
            .catch(error => {
                console.error('Error loading data from', jsonPath_OLD, ':', error);
                card.querySelector('.plugin-content').textContent = '版本信息加载失败';
                card.querySelector('.downloadCount').textContent = '下载信息加载失败';
            });
    });
    // 设置点击事件监听器为仓库名链接
    names.forEach(name => {
        name.style.cursor = 'pointer'; // 使鼠标悬停时显示为手形
        name.addEventListener('click', function () {
            const repoUrl = `https://github.com/${name.getAttribute('data-repo')}`;
            window.open(repoUrl, '_blank'); // 在新标签页中打开链接
        });
    });
});

function redirectTo(url) {
    window.location.href = url;
}




