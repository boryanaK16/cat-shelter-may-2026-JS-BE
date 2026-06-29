import http from 'http'
import fs from 'fs/promises'
import cats from './cats.js'
import breeds from './breeds.js'
import { addCat, readCats } from './catsService.js'
import { addBreed, readBreads } from './breedService.js'

const server = http.createServer(async (req, res) => {
    console.log(readBreads());

    if (req.method === 'POST' && req.url === '/cats/add-breed') {
        const bodyFormData = await readBodyFormData(req);
        addBreed(bodyFormData.get('breed'));

        // let body = '';

        // req.on('data', (chunk) => {
        //     body += chunk
        // });

        // req.on('end', async () => {
        //     const formData = new URLSearchParams(body);
        //     const breedName = formData.get('breed');
        //     addBreed(breedName);
        // })

        //  return res.end();

        //Redirect to new page after adding the breed
        return res.writeHead(302, { Location: '/' }).end();
    }

    if (req.method === 'POST' && req.url === '/cats/add-cat') {
        const bodyFormData = await readBodyFormData(req);

        const newCat = {
            name: bodyFormData.get('name'),
            desccription: bodyFormData.get('description'),
            imgUrl: bodyFormData.get('imageUrl'),
            breed: bodyFormData.get('breed')
        }

        // cats.push(newCat);
        addCat(newCat)
        return res.writeHead(302, { Location: '/' }).end();

    }

    //Get Requests
    if (req.url === '/styles/site.css') {
        const cssContent = await fs.readFile('./src/styles/site.css', 'utf-8');

        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.write(cssContent);

        return res.end();
    }

    if (req.url === '/js/script.js') {
        const jsContent = await fs.readFile('./src/js/script.js', 'utf-8');

        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(jsContent);

        return res.end();
    }

    let htmlContent = '';
    res.writeHead(200, { 'Content-Type': 'text/html' })

    switch (req.url) {
        case '/':
            htmlContent = await renderHomePage();//await fs.readFile('./src/views/home/index.html', 'utf-8');
            break;
        case '/cats/add-breed':
            htmlContent = await fs.readFile('./src/views/addBreed.html', 'utf-8')
            break;
        case '/cats/add-cat':
            htmlContent = await renderAddCatPage();//fs.readFile('./src/views/addCat.html', 'utf-8')
            break;
        default:
            htmlContent = await fs.readFile('./src/views/notFound.html', 'utf-8');
            break;
    }

    res.write(htmlContent);
    res.end();
})

async function renderHomePage() {
    let htmlContent = await fs.readFile('./src/views/home/index.html', 'utf-8');

    const catTemplete = (cat) => `<ul> 
                 <li>
                    <img src="${cat.imageUrl}" alt="${cat.name}">
                    <h3>${cat.name}</h3>
                    <p><span>Breed: </span>${cat.breed}}</p>
                    <p><span>Description: </span>${cat.description}</p>
                    <ul class="buttons">
                        <li class="btn edit"><a href="">Change Info</a></li>
                        <li class="btn delete"><a href="">New Home</a></li>
                    </ul>
                </li>
                </ul>`;

    const catsContent = `<ul>${cats.map(cat => catTemplete(cat)).join('\n')}</ul>`
    const result = htmlContent.replace('{{cats}}', catsContent)

    return result;
}

async function renderAddCatPage(params) {
    let htmlContent = await fs.readFile('./src/views/addCat.html', 'utf-8')
    const breedOptions = readBreads().map(breed => `<option value="${breed.id}">${breed.name}</option>`).join('\n')
    const result = htmlContent.replace('{{breedOptions}}', breedOptions);
    return result;
}

function readBodyFormData(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk
        });

        req.on('end', () => {
            const formData = new URLSearchParams(body);
            resolve(formData);
        })
    })
}

server.listen(5000, () => console.log('Server is listening on port http://localhost:5000'));
