const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");

let nome
let data
let pessoas
let horas
let cardapio


const flowPresupuesto = addKeyword(['Quero fazer um orçamento','Quero fazer o orçamento de novo'])
.addAnswer('Certo, vou precisar de algumas informações para encaminhar a fazer seu orçamento')
.addAnswer(['Por favor escreva para mim a *data* do evento no formato DD/MM/AAAA',
'Por exemplo 12/09/2027'],
{capture:true},
async(ctx,{fallBack,flowDynamic})=>{
    if(ctx.body.length !==10) return fallBack()
    data=ctx.body
    return flowDynamic(`Data informada: ${data}`)
})
.addAnswer('Agora a *quantidade de pessoas/convidados*',
{capture:true},
async(ctx,{fallBack,flowDynamic})=>{
    if(isNaN(ctx.body)) return fallBack()
    pessoas=ctx.body
    return flowDynamic(`Quantidade de pessoas/convidados informados: ${pessoas}`)
})
.addAnswer(['Beleza, vamos agora com a quantidade de horas de serviço',
'No caso não faça ideia ou não tenha essa informação pode escrever "0" para que podamos fazer uma sugestão'],
{capture:true},
async(ctx,{flowDynamic,fallBack})=>{
    if(isNaN(ctx.body)) return fallBack()
    if(ctx.body === '0') horas = 'Sugestão'
    horas=ctx.body
    return flowDynamic(`Horas informadas: ${horas}`)
})
.addAnswer(['Ok! Já quase finalizamos... preciso saber quais drinks você gostaria ter no cardápio',
'De novo, no caso não consiga informar direito pode escrever "Sugestão"',
'Ou também, dizer quais bebidas são da sua preferência (Vodka, Gin, Rum, etc)'],
{capture:true},
async(ctx, {fallBack,flowDynamic})=>{
    if(ctx.body.length <= 2) return fallBack()
    cardapio=ctx.body
    return flowDynamic(`Foi informado: ${cardapio}`)
})
.addAnswer(['Ótimo, para finalizar vou mostrar aqui todos os dados informados para conseguir confirmar'],
async({flowDynamic})=>{
    return flowDynamic(
    `*NOME*: ${nome}`,
    `*DATA*: ${data}`,
    `*PESSOAS/CONVIDADOS*: ${pessoas}`,
    `*CARDÁPIO*: ${cardapio}`
    )}
,
{buttons: [
        {body:'Confirmar'},
        {body:'Quero fazer o orçamento de novo'}
    ]})

const flowPrincipal = addKeyword([
  "oi",
  "oie",
  "olá",
  "bom dia",
  "boa tarde",
  "boa noite",
  "inicio"
])
  .addAnswer(
    "Olá, meu nome é StarBot, o Bartender Robô da *Bartender Stars: Serviço de Bar e consultorías* e vou ajudar você com seu atendimento"
  )
  .addAnswer(
    'Me informa por gentileza seu nome',
    {capture: true},
    async(ctx , {fallBack, flowDynamic})=>{
        if(ctx.body.length <= 2) return fallBack()
        nome=ctx.body
        return flowDynamic(`Prazer ${nome}🤝!`)
    }
  )
  .addAnswer(` Como posso lhe ajudar?`,{
    buttons: [
        {body:'Quero fazer um orçamento'},
        {body:'Preciso de consultoria para minha empresa'},
        {body:'Quero falar com alguém'}
    ]},
    null, [flowPresupuesto]
  )

 

// const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

// const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
//     [
//         '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
//         'https://bot-whatsapp.netlify.app/',
//         '\n*2* Para siguiente paso.',
//     ],
//     null,
//     null,
//     [flowSecundario]
// )

// const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
//     [
//         '🙌 Aquí encontras un ejemplo rapido',
//         'https://bot-whatsapp.netlify.app/docs/example/',
//         '\n*2* Para siguiente paso.',
//     ],
//     null,
//     null,
//     [flowSecundario]
// )

// const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
//     [
//         '🚀 Puedes aportar tu granito de arena a este proyecto',
//         '[*opencollective*] https://opencollective.com/bot-whatsapp',
//         '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
//         '[*patreon*] https://www.patreon.com/leifermendez',
//         '\n*2* Para siguiente paso.',
//     ],
//     null,
//     null,
//     [flowSecundario]
// )

// const flowDiscord = addKeyword(['discord']).addAnswer(
//     ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
//     null,
//     null,
//     [flowSecundario]
// )

// const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
//     .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
//     .addAnswer(
//         [
//             'te comparto los siguientes links de interes sobre el proyecto',
//             '👉 *doc* para ver la documentación',
//             '👉 *gracias*  para ver la lista de videos',
//             '👉 *discord* unirte al discord',
//         ],
//         null,
//         null,
//         [flowDocs, flowGracias, flowTuto, flowDiscord]
//     )

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
