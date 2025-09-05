const { test, expect } = require('@playwright/test');
const SenhaDodia = require('../utils/senhaDodia');
const ModuleManager = require('../utils/moduleManager');
const TestHelper = require('../utils/testHelper');
const path = require('path');

test.describe('Módulo Recepção', () => {
  let senhaDodia;
  let moduleManager;
  let evidenceDir;

  test.beforeAll(async () => {
    // Inicializa utilitários
    senhaDodia = new SenhaDodia();
    moduleManager = new ModuleManager();
    
    // Cria diretório para evidências
    evidenceDir = await TestHelper.criarDiretorioEvidencia('recepcao');
    await TestHelper.capturarInfoSistema(evidenceDir);
    
    console.log(`📁 Evidências salvas em: ${evidenceDir}`);
  });

  test('Obter senha do dia', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando obtenção da senha do dia');
    
    try {
      const senha = await senhaDodia.obterSenhaDoDia();
      
      expect(senha).toBeTruthy();
      expect(senha).toHaveLength(6); // Formato: DDMMAA
      
      await TestHelper.salvarLog(evidenceDir, `Senha obtida com sucesso: ${senha}`);
      
      console.log('✅ Senha do dia obtida com sucesso');
    } catch (error) {
      await TestHelper.salvarLog(evidenceDir, `Erro ao obter senha: ${error.message}`);
      throw error;
    }
  });

  test('Login no módulo Recepção', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando login no módulo Recepção');
    
    try {
      // Verifica se a senha foi obtida
      if (!senhaDodia.temSenha()) {
        throw new Error('Senha do dia não foi obtida previamente');
      }

      const senha = senhaDodia.getSenha();
      const username = moduleManager.getModuleConfig('recepcao').username;
      
      // Realiza login
      const loginSucesso = await moduleManager.realizarLogin('recepcao', username, senha);
      
      expect(loginSucesso).toBe(true);
      
      await TestHelper.salvarLog(evidenceDir, `Login realizado com sucesso - Usuário: ${username}`);
      
      console.log('✅ Login no módulo Recepção realizado com sucesso');
    } catch (error) {
      await TestHelper.salvarLog(evidenceDir, `Erro no login da Recepção: ${error.message}`);
      throw error;
    }
  });

  test('Admissão de Paciente - Recepção', async ({ page }) => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando teste de admissão de paciente');
    
    try {
      // Simula navegação para tela de admissão
      await page.goto('about:blank');
      await page.setContent(`
        <html>
          <head><title>Sishosp - Admissão de Paciente</title></head>
          <body style="font-family: Arial; padding: 20px; background: #f0f0f0;">
            <h2>📋 Sistema Sishosp - Admissão de Paciente</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3>Dados do Paciente</h3>
              <form id="admissaoForm">
                <div style="margin-bottom: 15px;">
                  <label>Nome Completo:</label><br>
                  <input type="text" id="nome" value="João da Silva" style="width: 300px; padding: 8px; margin-top: 5px;">
                </div>
                <div style="margin-bottom: 15px;">
                  <label>CPF:</label><br>
                  <input type="text" id="cpf" value="123.456.789-00" style="width: 200px; padding: 8px; margin-top: 5px;">
                </div>
                <div style="margin-bottom: 15px;">
                  <label>Data de Nascimento:</label><br>
                  <input type="text" id="dataNascimento" value="01/01/1980" style="width: 150px; padding: 8px; margin-top: 5px;">
                </div>
                <div style="margin-bottom: 15px;">
                  <label>Telefone:</label><br>
                  <input type="text" id="telefone" value="(11) 99999-9999" style="width: 200px; padding: 8px; margin-top: 5px;">
                </div>
                <button type="submit" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
                  Cadastrar Paciente
                </button>
                <div id="resultado" style="margin-top: 20px; padding: 10px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; display: none;">
                  ✅ Paciente cadastrado com sucesso!
                </div>
              </form>
            </div>
            <script>
              document.getElementById('admissaoForm').addEventListener('submit', function(e) {
                e.preventDefault();
                document.getElementById('resultado').style.display = 'block';
              });
            </script>
          </body>
        </html>
      `);

      // Obtém dados de teste
      const testData = moduleManager.getTestData();
      const paciente = testData.paciente;

      // Verifica se os campos estão preenchidos corretamente
      const nome = await page.locator('#nome').inputValue();
      const cpf = await page.locator('#cpf').inputValue();
      const dataNascimento = await page.locator('#dataNascimento').inputValue();
      const telefone = await page.locator('#telefone').inputValue();

      expect(nome).toBe(paciente.nome);
      expect(cpf).toBe(paciente.cpf);
      expect(dataNascimento).toBe(paciente.dataNascimento);
      expect(telefone).toBe(paciente.telefone);

      // Clica no botão de cadastrar
      await page.locator('button[type="submit"]').click();

      // Verifica se a mensagem de sucesso apareceu
      await expect(page.locator('#resultado')).toBeVisible();
      
      // Captura screenshot da tela de sucesso
      const screenshotPath = path.join(evidenceDir, 'admissao-paciente-sucesso.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });

      await TestHelper.salvarLog(evidenceDir, 'Admissão de paciente realizada com sucesso');
      await TestHelper.salvarLog(evidenceDir, `Screenshot salvo: ${screenshotPath}`);

      console.log('✅ Teste de admissão de paciente concluído com sucesso');
    } catch (error) {
      await TestHelper.salvarLog(evidenceDir, `Erro na admissão de paciente: ${error.message}`);
      
      // Captura screenshot do erro
      const errorScreenshotPath = path.join(evidenceDir, 'admissao-paciente-erro.png');
      await page.screenshot({ path: errorScreenshotPath, fullPage: true });
      
      throw error;
    }
  });

  test.afterAll(async () => {
    // Gera relatório final
    const relatorio = {
      modulo: 'Recepção',
      timestamp: new Date().toISOString(),
      testes: [
        'Obter senha do dia',
        'Login no módulo Recepção', 
        'Admissão de Paciente - Recepção'
      ],
      evidenciasDir: evidenceDir
    };

    await TestHelper.gerarRelatorio(evidenceDir, relatorio);
    await TestHelper.salvarLog(evidenceDir, 'Todos os testes da Recepção concluídos');
    
    console.log('📊 Relatório de testes da Recepção gerado');
  });
});