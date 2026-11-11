# Como Publicar o SalárioCerto no GitHub Pages

## 📋 Passo a Passo

### 1. Criar Repositório no GitHub
1. Acesse https://github.com
2. Faça login na sua conta
3. Clique no botão **"+"** no canto superior direito
4. Selecione **"New repository"**
5. Preencha:
   - **Repository name:** `salario-certo` (ou outro nome de sua preferência)
   - **Description:** Aplicativo web para educação financeira de jovens
   - **Public:** ✅ Marque como público
   - **Add a README file:** ❌ Não marque (já temos um)
6. Clique em **"Create repository"**

### 2. Fazer Upload dos Arquivos
Após criar o repositório, você verá uma página com instruções. Siga estes passos:

#### Opção A: Via Interface do GitHub (Mais Simples)
1. Na página do repositório, clique em **"uploading an existing file"**
2. Arraste todos os arquivos da pasta para a área de upload:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
   - `APRESENTACAO.md`
   - `.gitignore`
3. No campo **"Commit changes"**, digite: "Adicionando arquivos do projeto SalárioCerto"
4. Clique em **"Commit changes"**

#### Opção B: Via Git (Mais Profissional)
Abra o terminal na pasta do projeto e execute:

```bash
git add .
git commit -m "Adicionando arquivos do projeto SalárioCerto"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/salario-certo.git
git push -u origin main
```

**Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub.**

### 3. Ativar GitHub Pages
1. No repositório, clique na aba **"Settings"**
2. No menu lateral esquerdo, clique em **"Pages"**
3. Em **"Build and deployment"** > **"Source"**, selecione:
   - **Source:** Deploy from a branch
   - **Branch:** main
   - **Folder:** / (root)
4. Clique em **"Save"**

### 4. Aguardar Publicação
- Aguarde cerca de 1-2 minutos
- A página será atualizada automaticamente
- Você verá o link do seu site na seção **"Pages"**

O link será algo como:
```
https://SEU-USUARIO.github.io/salario-certo/
```

---

## 🎯 Alternativa: Netlify (Mais Rápido)

Se preferir uma opção mais rápida sem configurar Git:

### Usando Netlify Drop
1. Acesse https://app.netlify.com/drop
2. Arraste a pasta `Primeiro Salário` para a área indicada
3. Aguarde o upload
4. Pronto! Você receberá um link público instantâneo

### Vantagens do Netlify Drop:
- ✅ Não precisa de conta Git
- ✅ Publicação instantânea
- ✅ HTTPS automático
- ✅ Domínio gratuito

---

## 🔗 Compartilhar o Link

Após publicar, você pode compartilhar o link:
- Em apresentações
- No README do projeto
- Em redes sociais
- Com professores e colegas

---

## 📱 Testar o Site

Antes de publicar, teste localmente:
1. Abra o arquivo `index.html` no navegador
2. Verifique todas as funcionalidades
3. Teste em diferentes navegadores (Chrome, Firefox, Edge)
4. Teste no modo responsivo (F12 → ícone de celular)

---

## ⚠️ Observações Importantes

- O site é **estático**, não requer backend
- Os dados ficam salvos no **localStorage** do navegador do usuário
- Cada usuário terá seus próprios dados (histórico e metas)
- O site funciona **offline** após o primeiro carregamento
- CDN do TailwindCSS e Chart.js precisam de internet para carregar

---

## 🚀 Personalizar o Domínio (Opcional)

Se quiser um domínio personalizado:
- No GitHub Pages: Settings → Pages → Custom domain
- No Netlify: Domain settings → Add custom domain

Exemplos:
- `salariocerto.com` (pago)
- `salariocerto.netlify.app` (gratuito)
