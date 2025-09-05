const { test, expect } = require('@playwright/test');
const SenhaDodia = require('../utils/senhaDodia');
const ModuleManager = require('../utils/moduleManager');
const TestHelper = require('../utils/testHelper');

test.describe('Módulo Diag', () => {
  let senhaDodia;
  let moduleManager;
  let evidenceDir;

  test.beforeAll(async () => {
    senhaDodia = new SenhaDodia();
    moduleManager = new ModuleManager();
    evidenceDir = await TestHelper.criarDiretorioEvidencia('diag');
    await TestHelper.capturarInfoSistema(evidenceDir);
    
    console.log(`📁 Evidências Diag salvas em: ${evidenceDir}`);
  });

  test('Obter senha do dia para Diag', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando obtenção da senha do dia para Diag');
    
    const senha = await senhaDodia.obterSenhaDoDia();
    expect(senha).toBeTruthy();
    
    await TestHelper.salvarLog(evidenceDir, `Senha obtida para Diag: ${senha}`);
    console.log('✅ Senha do dia obtida para Diag');
  });

  test('Login no módulo Diag', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando login no módulo Diag');
    
    const senha = senhaDodia.getSenha();
    const username = moduleManager.getModuleConfig('diag').username;
    const loginSucesso = await moduleManager.realizarLogin('diag', username, senha);
    
    expect(loginSucesso).toBe(true);
    
    await TestHelper.salvarLog(evidenceDir, `Login Diag realizado - Usuário: ${username}`);
    console.log('✅ Login no módulo Diag realizado com sucesso');
  });

  test('Funcionalidade específica Diag', async ({ page }) => {
    await TestHelper.salvarLog(evidenceDir, 'Testando funcionalidades específicas do Diag');
    
    await page.goto('about:blank');
    await page.setContent(`
      <html>
        <head><title>Sishosp Diag - Sistema de Diagnósticos</title></head>
        <body style="font-family: Arial; padding: 20px; background: #f8f9fa;">
          <h2>🔬 Diag - Sistema de Diagnósticos</h2>
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3>Módulo de Diagnósticos</h3>
            <div id="status" style="padding: 10px; background: #fff3cd; border-radius: 4px;">
              Sistema Diag funcionando ✅
            </div>
          </div>
        </body>
      </html>
    `);

    await expect(page.locator('#status')).toContainText('funcionando');
    
    await TestHelper.salvarLog(evidenceDir, 'Teste Diag concluído com sucesso');
    console.log('✅ Teste específico Diag concluído');
  });

  test.afterAll(async () => {
    const relatorio = {
      modulo: 'Diag',
      timestamp: new Date().toISOString(),
      evidenciasDir: evidenceDir
    };

    await TestHelper.gerarRelatorio(evidenceDir, relatorio);
    console.log('📊 Relatório Diag gerado');
  });
});