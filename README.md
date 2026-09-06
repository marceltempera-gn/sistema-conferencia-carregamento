# Sistema de Conferência de Carregamento

Projeto de portfólio inspirado em um problema real observado no processo de expedição industrial.

O objetivo é demonstrar como tecnologia, automação de processos e desenvolvimento de sistemas podem aumentar a segurança e a rastreabilidade durante a conferência de carregamentos.

> **Versão pública e sanitizada.** Este repositório não contém dados, credenciais, infraestrutura, nomes de bancos internos, endereços de rede ou informações confidenciais da empresa onde o problema original foi observado.

## Demo

A aplicação está pronta e com build validado. O link público de hospedagem será adicionado aqui assim que o deploy externo for concluído.

Romaneio fictício utilizado na demonstração: `ROM-2026-001`

Alguns códigos para teste:

- `P000001-001` — peça correta;
- leia `P000001-001` novamente — duplicidade;
- `P000002-001` — peça de outro romaneio;
- `ABC-123` — etiqueta inválida.

A demo também permite simular queda de conexão, armazenamento local de leituras e posterior sincronização.

## Problema observado

Durante o carregamento de pedidos, é necessário garantir que todas as peças previstas em um romaneio sejam corretamente carregadas. Entre os riscos do processo estão:

- peças esquecidas;
- leituras duplicadas;
- peças pertencentes a outro romaneio;
- dificuldade para acompanhar itens pendentes;
- pouca rastreabilidade das conferências;
- oscilações de conexão no ambiente industrial.

## Solução demonstrada

A aplicação permite abrir um romaneio fictício e conferir individualmente cada etiqueta.

A regra de negócio identifica:

- peça correta;
- peça já conferida;
- peça pertencente a outro romaneio;
- código inválido;
- peça não encontrada.

Os itens são organizados entre **Pendentes**, **Lidas** e **Todas**, e o carregamento só pode ser finalizado quando não existem peças pendentes.

A tela também mantém um pequeno histórico de auditoria e possui um modo offline demonstrativo.

## Tecnologias da versão pública

- React
- TypeScript
- Vite
- LocalStorage
- Git
- GitHub
- GitHub Actions

## Conceitos aplicados

- levantamento de requisitos;
- regras de negócio;
- validação de dados;
- estado de aplicação;
- funcionamento offline;
- sincronização;
- idempotência como requisito de API;
- auditoria de eventos;
- responsividade;
- versionamento;
- CI/CD;
- segurança e sanitização de informações.

## API demonstrativa

A versão publicada funciona inteiramente com dados fictícios no navegador para permanecer segura e fácil de testar.

Também foi documentado um contrato de API que representa como um backend poderia atender à solução sem revelar qualquer integração real.

➡️ [Ver documentação da API](docs/api.md)

Exemplo de arquitetura:

```text
Operador
   ↓
Frontend React + TypeScript
   ↓
API / Backend
   ↓
Banco demonstrativo
```

## Relação com o projeto que inspirou a demo

A ideia nasceu do contato com processos reais de produção e expedição em ambiente industrial e da necessidade de melhorar a conferência e a rastreabilidade do carregamento.

Durante a exploração técnica da solução original, também houve contato com conceitos e tecnologias como Supabase, autenticação, C#/.NET, SQL Server, APIs e integração de sistemas. Esses componentes não são expostos neste repositório público quando dependem de infraestrutura ou informações internas.

## Estrutura

```text
.
├── .github/workflows/      # validação automática de build
├── docs/                   # documentação técnica
├── src/                    # aplicação React/TypeScript
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Executar localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Próximas evoluções

- publicar a demo em hospedagem externa;
- adicionar leitura por câmera em navegadores compatíveis;
- separar a camada de Mock API do frontend;
- criar backend demonstrativo independente;
- adicionar autenticação de demonstração;
- criar testes automatizados;
- ampliar a documentação de arquitetura.

## Autor

**Marcel Lourenço**

Projeto desenvolvido como estudo e portfólio durante minha transição para a área de Tecnologia, com interesse em automação de processos, sistemas ERP e Dados/BI.
