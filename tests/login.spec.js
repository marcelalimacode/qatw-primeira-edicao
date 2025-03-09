import { test, expect } from '@playwright/test';

import { obterCodigo2FA} from '../support/db' ; // funcao que pega o ultimo codigo gerado

import { LoginPage } from '../pages/LoginPage'; // classe que rep pg de login
import { DashPage } from '../pages/DashPage';
import { cleanJobs, getJob } from '../support/redis';

test('Nao deve logar quando o codigo de autenticacao e invalido', async ({ page }) => {
  const loginPage = new LoginPage(page) // intaciar o page obj

  const usuario = {
    cpf: '00000014141',
    senha: '147258',
  }

  await loginPage.acessaPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)
  await loginPage.informa2FA('123456')
  
  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});

test('Deve acessar a conta do usuario', async ({ page }) => {
  
  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)
  
  const usuario = {
    cpf: '00000014141',
    senha: '147258',
  }

  await cleanJobs()

  await loginPage.acessaPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)

  //checkpoint > espera chegar no lugar certo para poder consultar a info no banco / garante percorre caminho certo
  await page.getByRole('heading', {name: 'Verificação em duas etapas'})
    .waitFor({timeout: 3000})

  const codigo = await getJob()

  //const codigo = await obterCodigo2FA(usuario.cpf)

  await loginPage.informa2FA(codigo)
  
  await expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')// ativo timeout implicito playwright

  });