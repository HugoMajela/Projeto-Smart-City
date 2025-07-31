import puppeteer from 'puppeteer';
import '../../database/conexao.js';
import Produto from '../../models/Produto.js';

export async function scrapDrogasil() {
    const navegador = await puppeteer.launch({ headless: false });
    const pagina = await navegador.newPage();

    await pagina.goto("https://www.drogasil.com.br/", { waitUntil: 'networkidle2' });


    const resultado = await pagina.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= document.body.scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });

        const produtos = []

        const titulos = document.querySelectorAll("div.sc-27a119d9-4.bARMVf > div.sc-ede5caa-0.fdZnz > h3")
        const precos = document.querySelectorAll("section > div.sc-a4566482-0.iapccN > p")
        const links = document.querySelectorAll("div > div.swiper-slide.swiper-slide-active.custom-slide > a")


        titulos.forEach((produto, i) => {
            produtos.push({
                titulo: produto.innerText,
                preco: precos[i] ? precos[i].innerText : 'Indisponível',
                link: links[i] ? links[i].href : "#",
                empresa: 'Drogasil'
            });
        });
        return produtos;
    });

    console.log(resultado)

    await Produto.deleteMany({ empresa: 'Drogasil' });
    await Produto.insertMany(resultado);
    console.log('Produtos do Drogasil salvos no banco de dados');

    await navegador.close();
}

scrapDrogasil();