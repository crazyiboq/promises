async function getAllUsers() {
    try {

        const response = await fetch('https://jsonplaceholder.typicode.com/users');


        const users = await response.json();


        users.forEach(user => {
            console.log(`Ad: ${user.name}`);
            console.log(`Istifadeci Adi:${user.username}`)
            console.log(`Email: ${user.email}`);
            console.log(`??h?r: ${user.address.city}`);
            console.log('--------------------------');
        });
    } catch (error) {
        console.error('X?ta ba? verdi:', error.message);
    }
}

getAllUsers();

// 2

function getUserPosts() {
    fetch('https://jsonplaceholder.typicode.com/users/1')
        .then(response => response.json())
        .then(user => {
            console.log('?stifad??i:', user.name);
            return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
        })
        .then(response => response.json())
        .then(posts => {
            console.log('Yaz? ba?l?qlar?:');
            posts.forEach(post => {
                console.log(post.title);
            });
        })
        .catch(error => {
            console.error('X?ta:', error);
        });
}

getUserPosts();

// 3

async function compareCountries() {
    try {
        const countries = ['azerbaijan', 'turkey', 'georgia'];

        const results = await Promise.all(
            countries.map(country =>
                fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
                    .then(res => res.json())
                    .then(data => data[0])
            )
        );

        let mostPopulous = null;

        console.log("?lk?l?r m?qayis?si:");
        results.forEach(country => {
            const name = country.name.common;
            const capital = country.capital[0];
            const population = country.population;

            console.log(`${name} - Paytaxt: ${capital}, ?hali: ${population.toLocaleString('az-Latn-AZ')}`);

            if (!mostPopulous || population > mostPopulous.population) {
                mostPopulous = { name, population };
            }
        });

        console.log(`\n?n b?y?k ?hali: ${mostPopulous.name} (${mostPopulous.population.toLocaleString('az-Latn-AZ')})`);

    } catch (error) {
        console.error('X?ta:', error);
    }
}

compareCountries();


// 4

// Fetch with retry logic
async function fetchWithRetry(url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.log(`C?hd ${attempt} u?ursuz: ${error.message}`);
            if (attempt === maxRetries) {
                throw error;
            }
            // Wait 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// Fetch multiple users by IDs with retry on failure
async function fetchMultipleUsers() {
    const userIds = [1, 2, 999, 3, 888, 4]; // Some IDs don't exist

    for (const id of userIds) {
        try {
            const user = await fetchWithRetry(`https://jsonplaceholder.typicode.com/users/${id}`);
            console.log(`? ?stifad??i ${id}: ${user.name}`);
        } catch (error) {
            console.log(`? ?stifad??i ${id}: Tap?lmad?`);
        }
    }
}

fetchMultipleUsers();


// 5

class CryptoMonitor {
    constructor() {
        this.previousPrices = {};
        this.intervalId = null;
    }

    async getCryptoPrices() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd');
            return await response.json();
        } catch (error) {
            console.error('Qiym?t al?nark?n x?ta:', error);
            return null;
        }
    }

    displayPrices(prices) {
        console.log('\n?? Kriptovalyuta Qiym?tl?ri:');
        console.log('========================');

        for (const [coin, data] of Object.entries(prices)) {
            const currentPrice = data.usd;
            const previousPrice = this.previousPrices[coin];

            let changeIndicator = '';
            if (previousPrice !== undefined) {
                if (currentPrice > previousPrice) {
                    changeIndicator = '?? ??';
                } else if (currentPrice < previousPrice) {
                    changeIndicator = '?? ??';
                } else {
                    changeIndicator = '?? =';
                }
            }

            console.log(`${coin.toUpperCase()}: $${currentPrice} ${changeIndicator}`);
            this.previousPrices[coin] = currentPrice;
        }
    }

    async start() {
        console.log('?? Kriptovalyuta monitoru ba?lad?...');


        const initialPrices = await this.getCryptoPrices();
        if (initialPrices) {
            this.displayPrices(initialPrices);
        }


        this.intervalId = setInterval(async () => {
            const prices = await this.getCryptoPrices();
            if (prices) {
                this.displayPrices(prices);
            }
        }, 10000);

        setTimeout(() => {
            this.stop();
        }, 60000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            console.log('\n?? Monitoring dayand?r?ld?');
        }
    }
}

// ?stifad?
const monitor = new CryptoMonitor();
monitor.start();

// bu isliyir axi?

// 6

class UserReporter {
    constructor(userId) {
        this.userId = userId;
    }

    async fetchUserData() {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${this.userId}`);
        return await res.json();
    }

    async fetchUserPosts() {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${this.userId}`);
        return await res.json();
    }

    async fetchPostComments(postId) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        return await res.json();
    }

    async fetchUserAlbums() {
        const res = await fetch(`https://jsonplaceholder.typicode.com/albums?userId=${this.userId}`);
        return await res.json();
    }

    async fetchAlbumPhotos(albumId) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`);
        return await res.json();
    }

    async generateReport() {
        try {
            console.log('?? ?stifad??i profil hesabat? haz?rlan?r...\n');

            const [user, posts, albums] = await Promise.all([
                this.fetchUserData(),
                this.fetchUserPosts(),
                this.fetchUserAlbums()
            ]);

            console.log('?? ?stifad??i m?lumatlar?:');
            console.log(`Ad: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`??h?r: ${user.address.city}`);
            console.log(`Website: ${user.website}\n`);

            let totalComments = 0;
            for (const post of posts) {
                const comments = await this.fetchPostComments(post.id);
                totalComments += comments.length;
            }

            let totalPhotos = 0;
            for (const album of albums) {
                const photos = await this.fetchAlbumPhotos(album.id);
                totalPhotos += photos.length;
            }

            console.log('?? Statistika:');
            console.log(`Yaz?lar: ${posts.length}`);
            console.log(`??rhl?r: ${totalComments}`);
            console.log(`Albomlar: ${albums.length}`);
            console.log(`??kill?r: ${totalPhotos}`);
            console.log(`Orta ??rh/yaz?: ${(totalComments / posts.length).toFixed(1)}`);
            console.log(`Orta ??kil/albom: ${(totalPhotos / albums.length).toFixed(1)}`);

        } catch (error) {
            console.error('Hesabat haz?rlanark?n x?ta:', error);
        }
    }
}

const reporter = new UserReporter(1);
reporter.generateReport();


const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Press Enter to exit...', () => {
    rl.close();
});