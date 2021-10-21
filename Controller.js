const express = require('express');
const cors = require('cors');

const {Sequelize} = require('./models');

const models=require('./models');
// const { json } = require('sequelize/types');

const app=express();
app.use(cors());
app.use(express.json());

let cliente=models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let itemcompra = models.ItemCompra;
let produto = models.Produto;

app.get('/', function(req, res){
    res.send('Olá mundo')
});

app.get('/clientes',function(req,res){
    res.send('Seja bem vindo(a) a ServicesTI')
});
app.get('/servicos',function(req,res){
    res.send('Serviços com excelente qualidade')
});
app.get('/pedidos',function(req,res){
    res.send('Qual serviço gostaria de realizar')
});

app.post('/servicos', async(req,res) =>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar"
        })
    });
});

app.post('/clientes', async(req,res) =>{
    await cliente.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Cliente criado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível inserir o cliente"
        });
    });
});

app.post('/pedidos', async(req,res) =>{
    await pedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Pedido criado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar"
        })
    });
});

app.post('/itenspedido', async(req,res) =>{
    await itempedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Item criado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar"
        })
    });
});

app.get('/listaservicos', async(req,res)=>{
    await servico.findAll({
        // raw: true
        order: [['nome', 'ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});

app.get('/listapedidos', async(req,res)=>{
    await pedido.findAll({
        // raw: true
        order: [['data', 'ASC']]
    }).then(function(pedidos){
        res.json({pedidos})
    });
});

app.get('/listaclientes', async(req,res)=>{
    await cliente.findAll({
        raw: true
    }).then(function(clientes){
        res.json({clientes})
    });
});

app.get('/ofertaservicos', async(req, res)=>{
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
});

app.get('/servico/:id', async(req, res)=>{
    await servico.findByPk(req.params.id)
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message:"Erro: Não foi possível conectar"
        });
    });
});

app.put('/atualizaservico', async(req, res)=>{
    await servico.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message:"Serviço alterado com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error:true,
            message: "Erro na alteração do serviço"
        });
    });

});

app.get('/pedidos/:id', async(req, res)=>{
    await pedido.findByPk(req.params.id,{include:[{all:true}]})
    .then(ped=>{
        return res.json({ped});
    });
});

app.put('/pedidos/:id/editaritem', async(req,res)=>{
    const item={
        quantidade: req.body.quantidade,
        velor: req.body.valor
    };
    if (!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Pedido não foi encontrado'
        });
    };
    if (!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true,
            messagem: 'Serviço não encontrado'
        });
    };

    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId},
            {PedidoId:req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message:"Pedido alterado com sucesso",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message:"Erro: não foi possivel alterar"
        });
    });
});

app.get('/excluircliente/:id', async(req, res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(erro){
        return res.json({
            error: false,
            message: "Cliente foi excluido com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o cliente"
        });
    });
});

app.get('/excluircliente/:id',async(req,res)=>{
    await cliente.destroy({
        where: {id:req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente excluido com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            messagem:"Erro ao excluir cliente"
        });
    });
});




app.post('/produtos', async(req, res)=>{
    await produto.create(
        req.body        
    ).then(function(){
        return res.json({
            error: false,
            message: "Produto criado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível obter conexão"
        });
    });
    
});

app.get('/listaprodutos', async(req, res)=>{
    await produto.findAll({
        // raw: true
        order:[['nome', 'ASC']]
    }).then(function(produtos){
        res.json({produtos})
    });
});

app.get('/ofertaprodutos', async(req, res)=>{
    await produto.count('id').then(function(produtos){
        res.json({produtos});
    });
});

app.get('/produto/:id', async(req, res)=>{
    await produto.findByPk(req.params.id)
    .then(prod =>{
        return res.json({
            error: false,
            prod
        });
        
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: produto não localizado"
        });
    });
});

// app.get('/atualizaproduto', async(req,res)=>{
//     await produto.findByPk(1)
//     .then(prod =>{
//         prod.nome = 'Curso de Inglês e Libanês';
//         prod.descricao = 'Tradução e Interpretação em inglês e Libanês';
//         prod.save();
//         return res.json({prod});
//     });
// });

app.put('/atualizaproduto', async(req,res)=>{
    await produto.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error:false,
            message:"Produto alterado com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message:"Erro na alteração do produto"
        });
    });
});

app.get('/excluirproduto/:id',async(req,res)=>{
    await produto.destroy({
        where: {id:req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Produto excluido com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            messagem:"Erro ao excluir Produto"
        });
    });
});



app.get('/compras/:id', async(req, res)=>{
    await compra.findByPk(req.params.id,{include:[{all:true}]})
    .then(com=>{
        return res.json({com});
    });
});


app.put('/compras/:id/editaritem', async(req,res)=>{
    const topico={
        quantidade: req.body.quantidade,
        velor: req.body.valor
    };
    if (!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Pedido não foi encontrado'
        });
    };
    if (!await produto.findByPk(req.body.ProdutoId)){
        return res.status(400).json({
            error: true,
            messagem: 'Serviço não encontrado'
        });
    };

    await itemcompra.update(topico, {
        where: Sequelize.and({ProdutoId: req.body.ProdutoId},
            {CompraId:req.params.id})
    }).then(function(topicos){
        return res.json({
            error: false,
            message:"Pedido alterado com sucesso",
            topicos
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message:"Erro: não foi possivel alterar"
        });
    });
});


// app.get('/clientes', async(req,res)=>{
//     await cliente.create({
//         nome: "Mariana Zanin",
//         endereco: "R. Sofia Ratcov",
//         cidade: "Maringá",
//         nascimento: '1997-08-07',
//         clienteDesde: '2021-05-16'
//     });
//     res.send('Cliente criado com sucesso');
// });

// app.get('/compras', async(req,res)=>{
//     await compra.create({
//         data:'2021-09-23'
//     });
//     res.send('Compra criada com sucesso')
// });

// app.get('/itenscompra', async(req,res)=>{
//     await itemcompra.create({
//         CompraId: 1,
//         ProdutoId:2,
//         quantidade:3,
//         valor:100.0
//     });
//     res.send('Item criado com sucesso')
// });


app.post('/clientes/:id/compras', async(req,res)=>{
    const com ={
        data: req.body.data,
        ClienteId: req.params.id
    };
    if (!await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Cliente não existe'
        });
    };

    await compra.create(com)
    .then(order=>{
        return res.json({
            error: false,
            message: "Compra inserida com sucesso",
            order
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Não foi possível inserir  a compra"
        });
    });

});

app.post('/itenscompra', async(req,res) =>{
    await itemcompra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Item  compra criado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível inserir o item compra"
        });
    });
});

app.get('/excluircompra/:id',async(req,res)=>{
    await compra.destroy({
        where: {id:req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Compra excluido com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            messagem:"Erro ao excluir compra"
        });
    });
});
app.get('/listacompras', async(req,res)=>{
    await compra.findAll({
        // raw: true
        order: [['data', 'ASC']]
    }).then(function(produtos){
        res.json({produtos})
    });
});


let port=process.env.PORT || 3001;

app.listen(port,(req,res)=>{
    console.log('Servidor ativo: http://localhost:3001');
})
