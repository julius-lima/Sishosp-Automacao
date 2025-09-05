# Automação de Testes de Fumaça para Sistema Sishosp

Este projeto implementa uma automação completa de testes de fumaça para o sistema Sishosp usando JavaScript e Playwright. A automação inclui validação de login e funcionalidades básicas para todos os módulos principais do sistema.

## 🏥 Módulos Suportados

- **Recepção**: Sistema de recepção e admissão de pacientes
- **Medview**: Sistema de consultas médicas
- **Esthos**: Sistema de controle de estoque
- **Diag**: Sistema de diagnósticos
- **Fathos**: Sistema de faturamento
- **WPainel**: Painel web do sistema
- **Urgência**: Sistema de pronto socorro

## 🚀 Funcionalidades

- ✅ Obtenção automática da senha do dia via `SenhaDoDia.exe`
- ✅ Testes de login para todos os módulos
- ✅ Gravação de vídeo automática para cada teste
- ✅ Captura de screenshots em caso de erro
- ✅ Geração de relatórios detalhados
- ✅ Logs completos de execução
- ✅ Teste específico de admissão de paciente na Recepção

## 📁 Estrutura do Projeto

```
📦 Sishosp-Automacao/
├── 📂 resources/              # Recursos de configuração
│   ├── config.json           # Configurações dos módulos
│   └── credentials.json      # Credenciais e dados de teste
├── 📂 tests/                 # Testes automatizados
│   ├── recepcao.spec.js      # Testes da Recepção
│   ├── medview.spec.js       # Testes do Medview
│   ├── esthos.spec.js        # Testes do Esthos
│   ├── diag.spec.js          # Testes do Diag
│   ├── fathos.spec.js        # Testes do Fathos
│   ├── wpainel.spec.js       # Testes do WPainel
│   └── urgencia.spec.js      # Testes da Urgência
├── 📂 utils/                 # Utilitários
│   ├── senhaDodia.js         # Gerenciamento da senha do dia
│   ├── moduleManager.js      # Gerenciamento dos módulos
│   └── testHelper.js         # Funções auxiliares de teste
├── 📂 test-results/          # Resultados dos testes (auto-gerado)
├── package.json              # Dependências do projeto
├── playwright.config.js      # Configuração do Playwright
└── global-setup.js          # Configuração global dos testes
```

## ⚙️ Instalação e Configuração

### Pré-requisitos

1. **Node.js 16+**
2. **Aplicativos Sishosp** nos caminhos especificados em `resources/config.json`

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/julius-lima/Sishosp-Automacao.git
   cd Sishosp-Automacao
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Instale os navegadores do Playwright:
   ```bash
   npm run install-browsers
   ```

4. Configure os caminhos dos aplicativos em `resources/config.json` conforme seu ambiente.

## 🏃‍♂️ Como Executar

### Executar todos os testes
```bash
npm test
```

### Executar testes específicos
```bash
# Teste apenas a Recepção
npm run test:recep

# Teste apenas o Medview
npm run test:medview

# Teste apenas o Esthos
npm run test:esthos

# Teste apenas o Diag
npm run test:diag

# Teste apenas o Fathos
npm run test:fathos

# Teste apenas o WPainel
npm run test:wpainel

# Teste apenas a Urgência
npm run test:urgencia
```

### Executar com interface gráfica
```bash
npm run test:headed
```

### Executar em modo debug
```bash
npm run test:debug
```

## 📊 Evidências e Relatórios

Cada execução de teste gera automaticamente:

- **📹 Vídeos**: Gravação completa da execução
- **📸 Screenshots**: Capturas de tela em caso de erro
- **📋 Logs**: Logs detalhados de cada operação
- **📄 Relatórios**: Relatórios em JSON com resumo dos testes
- **ℹ️ Informações do Sistema**: Dados do ambiente de execução

Os arquivos são salvos em `test-results/` organizados por módulo e timestamp.

## 🔧 Configuração

### Configuração dos Módulos (`resources/config.json`)

```json
{
  "senhaDodia": {
    "appPath": "C:/WPD/SenhaDoDia.exe",
    "timeout": 10000
  },
  "modules": {
    "recepcao": {
      "appPath": "C:/WPD/Recep.exe",
      "username": "admin",
      "timeout": 15000
    }
    // ... outros módulos
  }
}
```

### Credenciais e Dados de Teste (`resources/credentials.json`)

```json
{
  "users": {
    "admin": {
      "username": "admin",
      "description": "Usuário administrador padrão"
    }
  },
  "testData": {
    "paciente": {
      "nome": "João da Silva",
      "cpf": "123.456.789-00",
      // ... outros dados
    }
  }
}
```

## 🧪 Testes Implementados

### Recepção
- ✅ Obtenção da senha do dia
- ✅ Login no módulo
- ✅ Admissão de paciente (fluxo completo)

### Demais Módulos
- ✅ Obtenção da senha do dia
- ✅ Login no módulo
- ✅ Validação de funcionalidade básica

## 📝 Logs e Debugging

Os logs são salvos automaticamente em cada teste e incluem:
- Timestamp de cada operação
- Status de sucesso/erro
- Mensagens detalhadas
- Informações do sistema

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
1. Abra uma [issue](https://github.com/julius-lima/Sishosp-Automacao/issues)
2. Consulte a documentação do [Playwright](https://playwright.dev/)
3. Verifique os logs em `test-results/`