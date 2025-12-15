/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho temos que atualizar o 
contador, adicionar o produto no localStorage e atualizar o html do carrinho
    parte 1 - vamos adicionar +1 no ícone do carrinho
    passo 1 - pegar os botões de adicionar ao carrinho do html
    passo 2 - adicionar uma evento de escuta nesses botões pra quando clicar disparar 
    uma ação
    passo 3 - pega as informações do produto clicado e adicionar no localStorage
    passo 4 - atualizar o contador do carrinho de compras
    passo 5 - renderizar a tabela do carrinho de compras

Objetivo 2 - remover produtos do carrinho
    passo 1  - pegar o botão de deletar do html
    passo 2 - adicionar evento de escuta no botão
    passo 3 - remover o produto do localStorage
    passo 4 - atualizar o html do carrinho retirando o produto
    passo 5 - atualizar o valor

Objetivo 3 - Atualizar os valores do carrinho
    passo 1 - pegar o input de quantidade do carrinho
    passo 2 - adicionar evento de escuta no input
    passo 3 - atualizar o valor total do produto
    passo 4 - atualizar o valor total do carrinho
*/

// Objetivo 1 - quando clicar no botão de adicionar ao carrinho temos que atualizar o contador, adicionar o produto no localStorage e atualizar o html do carrinho
//      parte 1 - vamos adicionar +1 no ícone do carrinho
//          passo 1 - pegar os botões de adicionar ao carrinho do html

const botoesAdicionarAoCarrinho = document.
querySelectorAll(".adicionar-ao-carrinho");

// passo 2 - adicionar uma evento de escuta nesses botões pra quando clicar disparar uma ação
botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener("click", (evento) => {

        // passo 3 - pega as informações do produto clicado e adicionar no localStorage
        const elementoProduto = evento.target.closest(".produto");
        if (!elementoProduto) {
            console.warn('Elemento .produto não encontrado para o botão clicado');
            return;
        }

        const produtoId = elementoProduto.dataset.id || String(Date.now());

        // nome: tenta .nome, senão usa figcaption
        const nomeEl = elementoProduto.querySelector('.nome') || elementoProduto.querySelector('figcaption');
        const produtoNome = nomeEl ? nomeEl.textContent.trim() : 'Produto sem nome';

        // imagem (verifica se existe)
        const imgEl = elementoProduto.querySelector('img');
        const produtoImagem = imgEl ? imgEl.getAttribute('src') : '';

        // preço: tenta extrair número no formato brasileiro e normalizar
        let produtoPreco = 0;
        const precoEl = elementoProduto.querySelector('.preco');
        if (precoEl && precoEl.textContent) {
            const match = precoEl.textContent.match(/[0-9]+[.,]?[0-9]*/);
            if (match) {
                const raw = match[0].replace(/\./g, '').replace(',', '.');
                produtoPreco = parseFloat(raw) || 0;
            } else {
                console.warn('Não foi possível extrair preço de:', precoEl.textContent);
            }
        } else {
            console.warn('Elemento .preco não encontrado para produto', produtoId);
        }

//buscar a lista de produtos do localStorage
const carrinho = obterProdutosDoCarrinho();
//testar se o produto já existe no carrinho
const existeProduto = carrinho.find(produto => produto.id === produtoId);
//se existe produto, incrementar a quantidade
if(existeProduto){
    existeProduto.quantidade += 1;
}else{
    //se não existe, adicionar o produto com quantidade 1
    const produto = {
        id: produtoId,
        nome: produtoNome,
        imagem: produtoImagem,
        preco: produtoPreco,
        quantidade: 1
    };
    carrinho.push(produto);
}

salvarProdutosNoCarrinho(carrinho);
atualizarContadorDoCarrinho();
    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.
stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const carrinhoJSON = localStorage.getItem("carrinho");
    return carrinhoJSON ? JSON.parse(carrinhoJSON) : [];
}

// passo 4 - atualizar o contador do carrinho de compras
function atualizarContadorDoCarrinho() {
    const carrinho = obterProdutosDoCarrinho();
    let total = 0;

    carrinho.forEach(produto => {
        total += produto.quantidade;
    });

    // atualiza o contador no DOM (se o elemento existir)
    const contadorEl = document.getElementById('contador-carrinho');
    if (contadorEl) {
        contadorEl.textContent = total;
    } else {
        // para debug, mantém o console.log se não encontrar o elemento
        console.log('contador do carrinho (total):', total);
    }

}

// garantir sincronização ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarContadorDoCarrinho);

