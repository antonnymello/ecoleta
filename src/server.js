const express = require('express');
const server = express();

//pegar o banco de dados
const db = require('./database/db.js');

//Configurar pasta publica
server.use(express.static('public'));

//habilitar o uso do req.body na aplicação
server.use(express.urlencoded({ extended: true }));

//utilizando template engine
const nunjucks = require('nunjucks');
nunjucks.configure('src/views', {
  express: server,
  noCache: true,
});

// configurar caminhos da aplicação

//página inicial
//req: requisição
//res: resposta
server.get('/', (req, res) => {
  return res.render('index.html', { title: 'Um titulo' });
});

server.get('/create-point', (req, res) => {
  //req.query: Query Strings da URL
  // console.log(req.query);

  return res.render('create-point.html');
});

server.post('/savepoint', (req, res) => {
  //req.body: o corpo do nosso formulário
  // console.log(req.body);

  //inserir dados no db
  const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);
  `;
  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items,
  ];

  function afterInsertData(err) {
    if (err) {
      return console.log(err);
    }
    console.log('Cadastrado com sucesso!');
    console.log(this); //quando tem .this não é pra usar arrow function

    return res.render('create-point.html', { saved: true });
  }
  db.run(query, values, afterInsertData);
});

server.get('/search', (req, res) => {
  //Pegar os dados do DB
  db.all(`SELECT * FROM places`, function (err, rows) {
    if (err) {
      console.log(err);
      return res.send('Erro no cadastro!');
    }

    const total = rows.length;
    console.log(rows);

    //mostrar a página html com os dados do BD.
    return res.render('search-results.html', { places: rows, total: total });
  });
});

// ligar o servidor.
server.listen(3000);
