# LicitMind API - Documentação

## Visão Geral

A API RESTful do LicitMind permite integração completa com sistemas externos para gerenciamento de licitações, contratos, fornecedores e muito mais.

**Base URL**: `https://api.licitmind.com/v1`

## Autenticação

Todas as requisições requerem um token de API válido no header:

```http
Authorization: Bearer lict_your_api_token_here
```

### Obter Token

1. Acesse **Configurações > API** no painel
2. Clique em "Novo Token"
3. Copie e guarde o token em local seguro

## Endpoints

### Editais

#### Listar Editais
```http
GET /api/v1/editals
```

**Parâmetros de Query:**
- `status` (string, opcional): Filtrar por status (`aberto`, `em_andamento`, `concluido`)
- `limit` (number, opcional): Limite de resultados (padrão: 50)
- `offset` (number, opcional): Paginação

**Resposta:**
```json
{
  "data": [
    {
      "id": "uuid",
      "numero_edital": "001/2024",
      "orgao_entidade": "Prefeitura Municipal",
      "objeto": "Aquisição de materiais",
      "modalidade": "pregao_eletronico",
      "valor_estimado": 50000.00,
      "status": "aberto",
      "data_publicacao": "2024-10-01",
      "data_limite_proposta": "2024-11-01"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0
  }
}
```

#### Criar Edital
```http
POST /api/v1/editals
```

**Body:**
```json
{
  "numero_edital": "002/2024",
  "orgao_entidade": "Prefeitura Municipal",
  "objeto": "Serviços de TI",
  "modalidade": "pregao_eletronico",
  "valor_estimado": 100000.00,
  "data_publicacao": "2024-11-01",
  "data_limite_proposta": "2024-12-01"
}
```

#### Obter Edital Específico
```http
GET /api/v1/editals/{id}
```

#### Atualizar Edital
```http
PUT /api/v1/editals/{id}
```

#### Deletar Edital
```http
DELETE /api/v1/editals/{id}
```

---

### Contratos

#### Listar Contratos
```http
GET /api/v1/contracts
```

**Parâmetros de Query:**
- `status` (string, opcional): `ativo`, `vencido`, `rescindido`
- `limit`, `offset`

**Resposta:**
```json
{
  "data": [
    {
      "id": "uuid",
      "numero_contrato": "CONT-001/2024",
      "contratante": "Prefeitura Municipal",
      "objeto": "Fornecimento de materiais",
      "valor_total": 80000.00,
      "data_inicio_vigencia": "2024-01-01",
      "data_fim_vigencia": "2024-12-31",
      "status": "ativo"
    }
  ]
}
```

#### Criar Contrato
```http
POST /api/v1/contracts
```

---

### Entregas (AFs/Empenhos)

#### Listar Entregas
```http
GET /api/v1/deliveries
```

**Parâmetros:**
- `status`: `pendente`, `em_andamento`, `entregue`, `atrasado`
- `contract_id`: Filtrar por contrato

#### Criar Entrega
```http
POST /api/v1/deliveries
```

**Body:**
```json
{
  "numero_af": "AF-001/2024",
  "numero_empenho": "EMP-001",
  "contract_id": "uuid",
  "descricao": "Primeira entrega",
  "valor": 10000.00,
  "data_emissao": "2024-10-01",
  "data_entrega_prevista": "2024-11-01",
  "tipo": "af",
  "status": "pendente"
}
```

---

### Fornecedores

#### Listar Fornecedores
```http
GET /api/v1/suppliers
```

#### Criar Fornecedor
```http
POST /api/v1/suppliers
```

**Body:**
```json
{
  "nome": "Empresa ABC Ltda",
  "cnpj": "12345678000190",
  "categoria": "Materiais de Escritório",
  "email": "contato@empresa.com",
  "telefone": "(11) 99999-9999",
  "endereco": "Rua Exemplo, 123",
  "cidade": "São Paulo",
  "uf": "SP"
}
```

---

### Cotações

#### Listar Cotações
```http
GET /api/v1/quotations
```

#### Criar Cotação
```http
POST /api/v1/quotations
```

---

### Protocolos Administrativos

#### Listar Protocolos
```http
GET /api/v1/protocols
```

**Parâmetros:**
- `status`: `aguardando_resposta`, `em_analise`, `deferido`, `indeferido`

#### Criar Protocolo
```http
POST /api/v1/protocols
```

---

## Códigos de Status HTTP

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Token inválido ou ausente
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro no servidor

## Tratamento de Erros

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "O campo 'numero_edital' é obrigatório",
    "details": {
      "field": "numero_edital",
      "issue": "required"
    }
  }
}
```

## Rate Limiting

- **Limite**: 1000 requisições por hora por token
- **Headers de resposta**:
  - `X-RateLimit-Limit`: Limite total
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp do reset

## Webhooks (Futuro)

Suporte planejado para webhooks em:
- Novos editais publicados
- Contratos próximos do vencimento
- Entregas atrasadas
- Protocolos respondidos

## Exemplos de Código

### JavaScript/Node.js
```javascript
const response = await fetch('https://api.licitmind.com/v1/editals', {
  headers: {
    'Authorization': 'Bearer lict_your_token',
    'Content-Type': 'application/json'
  }
})
const data = await response.json()
console.log(data)
```

### Python
```python
import requests

headers = {
    'Authorization': 'Bearer lict_your_token',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.licitmind.com/v1/editals', headers=headers)
data = response.json()
print(data)
```

### cURL
```bash
curl -H "Authorization: Bearer lict_your_token" \
     https://api.licitmind.com/v1/editals
```

## Suporte

Para dúvidas ou problemas, entre em contato:
- Email: api@licitmind.com
- Documentação: https://docs.licitmind.com
- Status da API: https://status.licitmind.com

