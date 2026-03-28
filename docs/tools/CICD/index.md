# CICD

## github action


```yaml
on:
  push:
    branches: ['main']
    paths:
      - 'docs/**'
      - 'package.json'

  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: latest

        # 打包成静态文件
      - name: Build
        run: pnpm install && pnpm build

      # - name: 部署
      #   uses: JamesIves/github-pages-deploy-action@v4
      #   with:
      #     branch: results
      #     folder: dist


      - name: 上传 dist
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          port: ${{ secrets.SERVER_PORT }}
          # 本地要上传的文件夹
          source: "dist/"
          # 服务器 Nginx 网站目录
          target: "/root/www/html/blog"
          # 覆盖旧文件
          strip_components: 1

```

## gitlab runner
