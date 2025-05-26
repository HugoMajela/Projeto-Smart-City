import * as puppeteer from 'puppeteer'
import '../../database/conexao.js'
import Produto from '../../models/Produto.js';
import { setTimeout as delay } from "node:timers/promises"


export async function scrapPaisEFilhos() {
    const navegador = await puppeteer.launch({ headless: false })
    const pagina = await navegador.newPage();
    await pagina.goto("https://supermercadopaisefilhos.com.br/")
    await pagina.waitForNetworkIdle();

    await pagina.click("#menu-mobile > ul > li:nth-child(4) > a")
    await pagina.waitForNetworkIdle();
    await pagina.type('#login-form > div:nth-child(2) > div.form-group > input', 'gugue2206@gmail.com', { delay: 100 });
    await pagina.type('#login-form > div:nth-child(3) > div > input', 'pbgJBRZ8EDY', { delay: 100 })

    const botaoLogin = '#login-form > div.form-group.row.mb-0.col-sm-12 > div:nth-child(1) > button';

    await pagina.waitForSelector(botaoLogin, { visible: true });
    await pagina.evaluate((selector) => {
        const btn = document.querySelector(selector);
        if (btn && !btn.disabled) btn.click();
    }, botaoLogin);

    await delay(5000);

    await pagina.click("#main-navbar > div.row.col-sm-12.menu-principal.menu-pading.align-items-center.px-4 > div.col-7.col-sm-4 > a > img")
    await pagina.waitForSelector("div.preco.menor.text-secondary.d-inline-block > strong > b:nth-child(3)")

    const resultado = await pagina.evaluate(() => {
        const produtos = [];
        const titulos = document.querySelectorAll("a > p")
        const precos = document.querySelectorAll("div.preco.menor.text-secondary.d-inline-block > strong > b:nth-child(3)")
        const links = document.querySelectorAll("div > div.card-body > a")

        titulos.forEach((produto, i) => {
            produtos.push({
                titulo: produto.innerText.trim(),
                preco: precos[i] ? precos[i].innerText.trim() : 'Indisponível',
                link: links[i] ? links[i].href : '#',
                mercado: 'Pais e Filhos'
            });
        });
        return produtos;
    });

    console.log(resultado)

    await Produto.deleteMany({ mercado: 'Pais e Filhos' });
    await Produto.insertMany(resultado);
    console.log('Produtos do Pais e Filhos salvos no banco de dados');

    await navegador.close();
}

scrapPaisEFilhos();