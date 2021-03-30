import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);









// http://localhost:3333/users
// http://localhost:3333/contacts

// Métodos
// GET: Buscar ou listar uma informação
// POST: Criar alguma nova informação
// PUT: Atalizar uma informação existente
// DELETE: Deletar uma informação existente

// Parametros
// Corpo (Request body): Dados para criação ou atualiaçãp de um registro
// Route Params: Para indentificar qual recurso que eu quero atualizar ou deletar
// Query Params: Paginação, filtros, ordenação e etc

//app.get('/', (request, response) => {
    //return response.send('Hello word');
    //console.log(request.body);


    //const users = [
        //{name: 'Diego', age: 25},
        //{name: 'Maicon', age: 25},
    //]

    //return response.json({ message: 'Hello Word' });
//});


app.listen(3333);
