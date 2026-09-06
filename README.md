# Sistema de Conferência de Carregamento

Projeto de portfólio inspirado em um problema real observado no processo de expedição de uma indústria.

O objetivo é demonstrar como tecnologia, automação de processos e desenvolvimento de sistemas podem ser aplicados para aumentar a segurança e a rastreabilidade durante a conferência de carregamentos.

> Este repositório é uma versão demonstrativa e sanitizada para portfólio.
> Não contém dados, credenciais, infraestrutura ou informações confidenciais da empresa onde o problema original foi observado.

## O problema

Durante o carregamento de pedidos, é necessário garantir que todas as peças previstas em um romaneio sejam corretamente carregadas.

Entre os possíveis problemas estão:

- peças esquecidas;
- leituras duplicadas;
- peças pertencentes a outro romaneio;
- dificuldade para acompanhar itens pendentes;
- pouca rastreabilidade da conferência;
- oscilações de conexão no ambiente industrial.

## A solução

A proposta é uma aplicação web de conferência de carregamento.

O operador abre um romaneio e realiza a conferência das peças individualmente através do código presente na etiqueta.

O sistema deve identificar situações como:

- peça correta;
- peça já conferida;
- peça pertencente a outro romaneio;
- código inválido;
- peça não encontrada.

Os itens são organizados entre:

- Pendentes
- Conferidos
- Todos

O carregamento só poderá ser finalizado quando não existirem peças pendentes.

## Demonstração

A versão pública utilizará somente dados fictícios.

Exemplo:

Romaneio: `ROM-2026-001`

Peças:

`P000001-001`  
`P000001-002`  
`P000001-003`

Assim será possível testar o fluxo da aplicação sem utilizar qualquer informação real da empresa.

## Tecnologias

Tecnologias previstas para a versão demonstrativa:

- React
- TypeScript
- Vite
- Supabase
- Git
- GitHub

Outros conceitos estudados durante o desenvolvimento:

- APIs
- HTTP
- JSON
- Banco de dados
- Autenticação
- Regras de negócio
- Integração de sistemas
- Funcionamento offline
- Sincronização de dados
- Automação de processos
- Levantamento de requisitos

## Arquitetura planejada

```text
Usuário
   ↓
Aplicação Web
   ↓
API / Backend
   ↓
Banco de Dados
