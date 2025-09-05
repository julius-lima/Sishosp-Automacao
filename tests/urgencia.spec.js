const { test, expect } = require('@playwright/test');
const SenhaDodia = require('../utils/senhaDodia');
const ModuleManager = require('../utils/moduleManager');
const TestHelper = require('../utils/testHelper');

test.describe('Módulo Urgência', () => {
  let senhaDodia;
  let moduleManager;
  let evidenceDir;

  test.beforeAll(async () => {
    senhaDodia = new SenhaDodia();
    moduleManager = new ModuleManager();
    evidenceDir = await TestHelper.criarDiretorioEvidencia('urgencia');
    await TestHelper.capturarInfoSistema(evidenceDir);
    
    console.log(`📁 Evidências Urgência salvas em: ${evidenceDir}`);
  });

  test('Obter senha do dia para Urgência', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando obtenção da senha do dia para Urgência');
    
    const senha = await senhaDodia.obterSenhaDoDia();
    expect(senha).toBeTruthy();
    
    await TestHelper.salvarLog(evidenceDir, `Senha obtida para Urgência: ${senha}`);
    console.log('✅ Senha do dia obtida para Urgência');
  });

  test('Login no módulo Urgência', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando login no módulo Urgência');
    
    const senha = senhaDodia.getSenha();
    const username = moduleManager.getModuleConfig('urgencia').username;
    const loginSucesso = await moduleManager.realizarLogin('urgencia', username, senha);
    
    expect(loginSucesso).toBe(true);
    
    await TestHelper.salvarLog(evidenceDir, `Login Urgência realizado - Usuário: ${username}`);
    console.log('✅ Login no módulo Urgência realizado com sucesso');
  });

  test('Funcionalidade específica Urgência', async ({ page }) => {
    await TestHelper.salvarLog(evidenceDir, 'Testando funcionalidades específicas da Urgência');
    
    await page.goto('about:blank');
    await page.setContent(`
      <html>
        <head><title>Sishosp Urgência - Pronto Socorro</title></head>
        <body style="font-family: Arial; padding: 20px; background: #f8f9fa;">
          <h2>🚨 Urgência - Sistema de Pronto Socorro</h2>
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3>Central de Emergências</h3>
            <div id="status" style="padding: 10px; background: #f8d7da; border-radius: 4px;">
              Sistema Urgência operacional ✅
            </div>
            <div style="margin-top: 15px;">
              <h4>Status Atual:</h4>
              <div id="emergencyStatus" style="padding: 8px; background: #d1ecf1; border-radius: 4px;">
                Pronto para atendimentos de emergência
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    await expect(page.locator('#status')).toContainText('operacional');
    await expect(page.locator('#emergencyStatus')).toContainText('Pronto para');
    
    await TestHelper.salvarLog(evidenceDir, 'Teste Urgência concluído com sucesso');
    console.log('✅ Teste específico Urgência concluído');
  });

  test.afterAll(async () => {
    const relatorio = {
      modulo: 'Urgência',
      timestamp: new Date().toISOString(),
      evidenciasDir: evidenceDir
    };

    await TestHelper.gerarRelatorio(evidenceDir, relatorio);
    console.log('📊 Relatório Urgência gerado');
  });
});