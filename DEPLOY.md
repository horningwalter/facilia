# Deploy e estatísticas, Facilia

Checklist pós-deploy. Não vai pro site (gitignored pelo `.vercelignore`).

## 1. Vercel Analytics

Depois do projeto importado na Vercel:

1. Painel do projeto, aba **Analytics**.
2. Clica **Enable Web Analytics**.
3. Confere que o script está no `index.html`, antes do `</body>`:
   ```html
   <script defer src="/_vercel/insights/script.js"></script>
   ```

O wizard da Vercel oferece só opções com build step (`npm i @vercel/analytics` + `inject()`). Esse caminho não serve aqui: o site é HTML estático, sem `package.json` e sem bundler para resolver o import. A tag direta acessa o mesmo endpoint e é o que o pacote acabaria injetando no DOM.

A injeção automática de script só vale para projetos com framework detectado (Next.js e afins). Em site estático, sem a tag no HTML não chega evento nenhum, por mais que o Analytics esteja habilitado no painel.

O caminho `/_vercel/insights/` só existe em deploy na Vercel. Em `localhost` dá 404, é esperado.

Dados aparecem em ~30 segundos depois da primeira visita. Bloqueador de anúncio derruba a coleta: para testar, aba anônima sem extensão.

Plano gratuito: cota mensal de eventos com retenção curta, suficiente para começar. Se passar disso, considerar [Plausible](https://plausible.io) ou Umami.

## 2. Google Search Console

Mostra buscas que levam ao site, status de indexação, problemas técnicos. Grátis, complementa o analytics.

1. Acessa [search.google.com/search-console](https://search.google.com/search-console).
2. Adiciona propriedade do tipo **Prefixo de URL**: `https://facilia.ia.br/`.
3. Escolhe o método **Tag HTML**. Vai mostrar algo como:
   ```html
   <meta name="google-site-verification" content="abc123XYZ...">
   ```
4. Copia o valor de `content="..."`.
5. Edita `index.html`, localiza o comentário marcado e descomenta a linha:
   ```html
   <meta name="google-site-verification" content="abc123XYZ...">
   ```
6. Commit + push. Espera o deploy (≈30s).
7. No Search Console, clica **Verificar**.
8. Depois de verificado, envia o sitemap:
   - Aba **Sitemaps** > adiciona `sitemap.xml`.

Dados começam a aparecer em alguns dias (Google leva tempo para indexar).

## 3. (Opcional, depois) Heatmaps com Microsoft Clarity

Só se quiser ver gravações de sessão e mapas de calor. Adiciona ~30 KB e exige menção na política de privacidade.

Por enquanto, **não recomendado**. Vercel Analytics + Search Console cobrem 95% das perguntas reais.

## DNS no Registro.br

Quando a Vercel pedir DNS para o domínio `facilia.ia.br`:

1. [registro.br](https://registro.br) > Painel > escolhe `facilia.ia.br` > **DNS**.
2. Adiciona os registros que a Vercel mostrar (geralmente um `A 76.76.21.21` e um `CNAME` para `www`).
3. Propagação: minutos a algumas horas.
4. HTTPS é emitido automaticamente pela Vercel.
