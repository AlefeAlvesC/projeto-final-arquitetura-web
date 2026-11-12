require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Imagens provisórias (placehold.co) nas cores da marca.
// Depois você pode trocar por URLs reais das imagens dos produtos.
const img = (text, bg = '090129', fg = '8FFF24') =>
  `https://placehold.co/600x600/${bg}/${fg}/png?text=${encodeURIComponent(text)}`;

const products = [
  // Roupas
  {
    name: 'Camiseta Capy',
    description:
      'Camiseta de algodão com a capivara mais tranquila do universo dev. Perfeita para dias de deploy na sexta.',
    price: 28,
    category: 'Roupas',
    stock: 25,
    imageUrl: img('Camiseta\nCapy', '430091', 'FFFFFF'),
  },
  {
    name: 'Camiseta Estágios do Programador',
    description:
      'Do "funciona na minha máquina" ao "quem mexeu no código?". Estampa frontal em algodão macio.',
    price: 35,
    category: 'Roupas',
    stock: 18,
    imageUrl: img('Camiseta\nEstágios', '090129', 'FF55DF'),
  },
  {
    name: 'Moletom Hello World',
    description:
      'Moletom com capuz e bolso canguru, estampa "Hello, World!" no peito. Ideal para madrugadas de código.',
    price: 89.9,
    category: 'Roupas',
    stock: 3,
    imageUrl: img('Moletom\nHello World', '780BF7', 'FFFFFF'),
  },
  {
    name: 'Boné 404',
    description:
      'Boné preto com bordado "404 Not Found". Aba curva e ajuste traseiro.',
    price: 25,
    category: 'Roupas',
    stock: 30,
    imageUrl: img('Boné 404', '444444', '8FFF24'),
  },

  // Canecas
  {
    name: 'Caneca Bug',
    description:
      'Caneca de cerâmica 325 ml com a frase "Enquanto houver código, haverá bug". Vai bem no micro-ondas e na lava-louças.',
    price: 28,
    category: 'Canecas',
    stock: 40,
    imageUrl: img('Caneca\nBug', '090129', '8FFF24'),
  },
  {
    name: 'Copo Vida de Dev',
    description:
      'Copo térmico de aço inox que mantém o café quente por horas, porque o deploy não tem hora para acabar.',
    price: 28,
    category: 'Canecas',
    stock: 22,
    imageUrl: img('Copo\nVida de Dev', '430091', 'FF55DF'),
  },
  {
    name: 'Caneca Café em <código/>',
    description:
      'Caneca verde neon com a frase "Transformando café em código". Capacidade de 350 ml.',
    price: 32,
    category: 'Canecas',
    stock: 15,
    imageUrl: img('Caneca\nCafé em Código', '8FFF24', '090129'),
  },

  // Acessórios
  {
    name: 'Mousepad Café',
    description:
      'Mousepad com base antiderrapante e superfície lisa para precisão. Tamanho 22 x 18 cm.',
    price: 18,
    category: 'Acessórios',
    stock: 50,
    imageUrl: img('Mousepad\nCafé', '090129', 'FFFFFF'),
  },
  {
    name: 'Abridor de garrafa UseDev',
    description:
      'Abridor de garrafa em metal com chaveiro. Para abrir a garrafa e, quem sabe, uma issue.',
    price: 12,
    category: 'Acessórios',
    stock: 60,
    imageUrl: img('Abridor\nde garrafa', '780BF7', '8FFF24'),
  },
  {
    name: 'Teclado Mecânico RGB',
    description:
      'Teclado mecânico compacto com switches azuis e iluminação RGB personalizável. Layout ABNT2.',
    price: 249.9,
    category: 'Acessórios',
    stock: 0,
    imageUrl: img('Teclado\nRGB', '090129', 'FF55DF'),
  },

  // Decoração
  {
    name: 'Quadro While',
    description:
      'Quadro com moldura preta e o loop da vida do programador: eat, sleep, code, repeat. Tamanho 30 x 40 cm.',
    price: 22,
    category: 'Decoração',
    stock: 12,
    imageUrl: img('Quadro\nWhile', '444444', '8FFF24'),
  },
  {
    name: 'Luminária Pixel',
    description:
      'Luminária de mesa em formato de pixel art, com luz LED e alimentação USB. Decora e ilumina o setup.',
    price: 59.9,
    category: 'Decoração',
    stock: 8,
    imageUrl: img('Luminária\nPixel', '430091', '8FFF24'),
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // --reset apaga todos os produtos antes de inserir
  if (process.argv.includes('--reset')) {
    const { deletedCount } = await Product.deleteMany({});
    console.log(`Produtos removidos: ${deletedCount}`);
  }

  // Upsert pelo nome: rodar de novo não duplica nem apaga produtos cadastrados pelo admin
  for (const product of products) {
    await Product.findOneAndUpdate({ name: product.name }, product, {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });
  }

  console.log(`Produtos prontos: ${products.length}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Erro no seed de produtos:', err.message);
  process.exit(1);
});