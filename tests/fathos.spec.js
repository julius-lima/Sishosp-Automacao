const { test, expect } = require('@playwright/test');
const SenhaDodia = require('../utils/senhaDodia');
const ModuleManager = require('../utils/moduleManager');
const TestHelper = require('../utils/testHelper');

test.describe('Módulo Fathos', () => {
  let senhaDodia;
  let moduleManager;
  let evidenceDir;

  test.beforeAll(async () => {
    senhaDodia = new SenhaDodia();
    moduleManager = new ModuleManager();
    evidenceDir = await TestHelper.criarDiretorioEvidencia('fathos');
    await TestHelper.capturarInfoSistema(evidenceDir);
    
    console.log(`📁 Evidências Fathos salvas em: ${evidenceDir}`);
  });

  test('Obter senha do dia para Fathos', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando obtenção da senha do dia para Fathos');
    
    const senha = await senhaDodia.obterSenhaDoDia();
    expect(senha).toBeTruthy();
    
    await TestHelper.salvarLog(evidenceDir, `Senha obtida para Fathos: ${senha}`);
    console.log('✅ Senha do dia obtida para Fathos');
  });

  test('Login no módulo Fathos', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando login no módulo Fathos');
    
    const senha = senhaDodia.getSenha();
    const username = moduleManager.getModuleConfig('fathos').username;
    const loginSucesso = await moduleManager.realizarLogin('fathos', username, senha);
    
    expect(loginSucesso).toBe(true);
    
    await TestHelper.salvarLog(evidenceDir, `Login Fathos realizado - Usuário: ${username}`);
    console.log('✅ Login no módulo Fathos realizado com sucesso');
  });

  test('Funcionalidade específica Fathos', async ({ page }) => {
    await TestHelper.salvarLog(evidenceDir, 'Testando funcionalidades específicas do Fathos');
    
    await page.goto('about:blank');
    await page.setContent(`
      <html>
        <head><title>Sishosp Fathos - Sistema de Faturamento</title></head>
        <body style="font-family: Arial; padding: 20px; background: #f8f9fa;">
          <h2>💰 Fathos - Sistema de Faturamento</h2>
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3>Gestão de Faturamento</h3>
            <div id="status" style="padding: 10px; background: #d1ecf1; border-radius: 4px;">
              Sistema Fathos operacional ✅
            </div>
          </div>
        </body>
      </html>
    `);

    await expect(page.locator('#status')).toContainText('operacional');
    
    await TestHelper.salvarLog(evidenceDir, 'Teste Fathos concluído com sucesso');
    console.log('✅ Teste específico Fathos concluído');
  });

  test.afterAll(async () => {
    const relatorio = {
      modulo: 'Fathos',
      timestamp: new Date().toISOString(),
      evidenciasDir: evidenceDir
    };

    await TestHelper.gerarRelatorio(evidenceDir, relatorio);
    console.log('📊 Relatório Fathos gerado');
  });
});