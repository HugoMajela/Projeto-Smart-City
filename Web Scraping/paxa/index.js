import puppeteer from 'puppeteer';
import '../../database/conexao.js'
import Produto from '../../models/Produto.js';

export async function scrapPaxa() {
    const navegador = await puppeteer.launch({ headless: "new" })
    const pagina = await navegador.newPage();
    await pagina.goto("https://paxaemcasa.com.br/loja/")
    await pagina.waitForNetworkIdle();

    const resultado = await pagina.evaluate(() => {
        const produtos = []

        const titulos = document.querySelectorAll("div.caption > a > span")
        const precos = document.querySelectorAll("div.col-12.container-preco.padding0 > div > div > strong")
        const links = document.querySelectorAll("div > div.caption > a")

        titulos.forEach((produto, i) => {
            produtos.push({
                titulo: produto.innerText,
                preco: precos[i] ? precos[i].innerText : 'Indisponível',
                link: links[i] ? links[i].href : '#',
                empresa: 'Paxá'
            });
        });
        return produtos;
    });

    console.log(resultado)

    await Produto.deleteMany({ empresa: 'Paxá' });
    await Produto.insertMany(resultado);
    console.log('Produtos do Paxá salvos no banco de dados');

    await navegador.close();
}

scrapPaxa()