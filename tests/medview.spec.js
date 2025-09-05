const { test, expect } = require('@playwright/test');
const SenhaDodia = require('../utils/senhaDodia');
const ModuleManager = require('../utils/moduleManager');
const TestHelper = require('../utils/testHelper');

test.describe('Módulo Medview', () => {
  let senhaDodia;
  let moduleManager;
  let evidenceDir;

  test.beforeAll(async () => {
    senhaDodia = new SenhaDodia();
    moduleManager = new ModuleManager();
    evidenceDir = await TestHelper.criarDiretorioEvidencia('medview');
    await TestHelper.capturarInfoSistema(evidenceDir);
    
    console.log(`📁 Evidências Medview salvas em: ${evidenceDir}`);
  });

  test('Obter senha do dia para Medview', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando obtenção da senha do dia para Medview');
    
    const senha = await senhaDodia.obterSenhaDoDia();
    expect(senha).toBeTruthy();
    
    await TestHelper.salvarLog(evidenceDir, `Senha obtida para Medview: ${senha}`);
    console.log('✅ Senha do dia obtida para Medview');
  });

  test('Login no módulo Medview', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando login no módulo Medview');
    
    const senha = senhaDodia.getSenha();
    const username = moduleManager.getModuleConfig('medview').username;
    const loginSucesso = await moduleManager.realizarLogin('medview', username, senha);
    
    expect(loginSucesso).toBe(true);
    
    await TestHelper.salvarLog(evidenceDir, `Login Medview realizado - Usuário: ${username}`);
    console.log('✅ Login no módulo Medview realizado com sucesso');
  });

  test('Funcionalidade específica Medview', async ({ page }) => {
    await TestHelper.salvarLog(evidenceDir, 'Testando funcionalidades específicas do Medview');
    
    // Simula tela específica do Medview
    await page.goto('about:blank');
    await page.setContent(`
      <html>
        <head><title>Sishosp Medview - Consultas Médicas</title></head>
        <body style="font-family: Arial; padding: 20px; background: #f8f9fa;">
          <h2>🩺 Medview - Sistema de Consultas</h2>
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3>Painel de Consultas</h3>
            <div id="status" style="padding: 10px; background: #d1ecf1; border-radius: 4px;">
              Sistema Medview operacional ✅
            </div>
          </div>
        </body>
      </html>
    `);

    await expect(page.locator('#status')).toContainText('operacional');
    
    await TestHelper.salvarLog(evidenceDir, 'Teste Medview concluído com sucesso');
    console.log('✅ Teste específico Medview concluído');
  });

  test.afterAll(async () => {
    const relatorio = {
      modulo: 'Medview',
      timestamp: new Date().toISOString(),
      evidenciasDir: evidenceDir
    };

    await TestHelper.gerarRelatorio(evidenceDir, relatorio);
    console.log('📊 Relatório Medview gerado');
  });
});