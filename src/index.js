import http from 'http'

const server = http.createServer((req, res) => {
    res.write('Hello')
    res.end()
})

server.listen(5000, () => console.log('Server is listening on port http://localhost:5000'));

