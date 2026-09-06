# API demonstrativa — contrato público

Esta documentação descreve uma API **fictícia** para o projeto de portfólio. Ela existe para demonstrar como o frontend poderia conversar com um backend sem expor qualquer endpoint, tabela, credencial ou infraestrutura real da empresa que inspirou o projeto.

## Fluxo sugerido

```text
Frontend React
    ↓ HTTPS / JSON
API de conferência
    ↓
Banco de dados demonstrativo
```

## 1. Consultar romaneio

`GET /api/manifests/ROM-2026-001`

Resposta de exemplo:

```json
{
  "manifestNumber": "ROM-2026-001",
  "status": "loading",
  "route": "Rota demonstrativa",
  "items": [
    {
      "pieceCode": "P000001-001",
      "orderCode": "PED-DEMO-001",
      "description": "Peça temperada 8 mm",
      "status": "pending"
    }
  ]
}
```

## 2. Iniciar conferência

`POST /api/loading/start`

```json
{
  "manifestNumber": "ROM-2026-001",
  "deviceId": "demo-browser-001"
}
```

Resposta:

```json
{
  "sessionId": "session-demo-123",
  "status": "active"
}
```

## 3. Registrar leitura

`POST /api/scans`

```json
{
  "sessionId": "session-demo-123",
  "pieceCode": "P000001-001",
  "scannedAt": "2026-09-05T23:30:00-03:00",
  "wasOffline": false
}
```

Possíveis respostas de negócio:

```json
{ "result": "accepted", "message": "PECA_CORRETA" }
```

```json
{ "result": "duplicate", "message": "PECA_JA_CONFERIDA" }
```

```json
{ "result": "rejected", "message": "PECA_DE_OUTRO_ROMANEIO" }
```

```json
{ "result": "rejected", "message": "PECA_NAO_ENCONTRADA" }
```

## 4. Finalizar carregamento

`POST /api/loading/finish`

```json
{
  "sessionId": "session-demo-123"
}
```

Se ainda existirem itens pendentes:

```json
{
  "result": "blocked",
  "message": "PECAS_PENDENTES",
  "pendingCount": 3
}
```

Se todas as peças estiverem conferidas:

```json
{
  "result": "finished",
  "message": "CARREGAMENTO_FINALIZADO"
}
```

## Funcionamento offline

Uma implementação real pode gerar um identificador único para cada evento de leitura e armazenar temporariamente eventos no dispositivo quando não houver conexão.

Ao recuperar a rede, os eventos são reenviados. O backend deve tratar o identificador do evento de forma idempotente para impedir registros duplicados causados por novas tentativas de sincronização.

## Segurança

A versão pública deste projeto não utiliza:

- credenciais reais;
- endereços IP internos;
- nomes de bancos internos;
- tabelas de produção;
- chaves privadas;
- dados reais de clientes ou pedidos.

Este documento é exclusivamente educacional e demonstra um contrato de API possível para a solução.
