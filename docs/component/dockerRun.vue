<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useMessage, NButton, NSpace, NFormItem, NInput, NSelect, NCard, NConfigProvider, darkTheme } from 'naive-ui'

const message = useMessage()
const { copy, copied } = useClipboard({ source: '' })

const containerTypes = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'Redis', value: 'redis' },
  { label: 'Nginx', value: 'nginx' },
  { label: 'NodeApp', value: 'nodeapp' },
  { label: 'MongoDB', value: 'mongodb' },
  { label: 'MinIO', value: 'minio' }
]

const containerPresets = {
  mysql: {
    image: 'mysql:8.0',
    name: 'mysql8',
    ports: ['3306:3306'],
    envs: [
      { key: 'MYSQL_ROOT_PASSWORD', value: '123456' },
      { key: 'MYSQL_DATABASE', value: 'mydb' },
      { key: 'TZ', value: 'Asia/Shanghai' }
    ]
  },
  redis: {
    image: 'redis:7-alpine',
    name: 'redis',
    ports: ['6379:6379'],
    envs: [{ key: 'TZ', value: 'Asia/Shanghai' }]
  },
  nginx: {
    image: 'nginx:alpine',
    name: 'nginx',
    ports: ['80:80'],
    envs: []
  },
  nodeapp: {
    image: 'node-app:latest',
    name: 'node-app',
    ports: ['3000:3000'],
    envs: [
      { key: 'NODE_ENV', value: 'production' },
      { key: 'PORT', value: '3000' }
    ]
  },
  mongodb: {
    image: 'mongo:latest',
    name: 'mongodb',
    ports: ['27017:27017'],
    envs: []
  },
  minio: {
    image: 'minio/minio:latest',
    name: 'minio',
    ports: ['9000:9000', '9001:9001'],
    envs: [
      { key: 'MINIO_ROOT_USER', value: 'minioadmin' },
      { key: 'MINIO_ROOT_PASSWORD', value: 'minioadmin' }
    ]
  }
}

const restartPolicies = [
  { label: '不设置', value: '' },
  { label: 'always - 总是重启', value: 'always' },
  { label: 'unless-stopped - 除非手动停止', value: 'unless-stopped' },
  { label: 'on-failure - 失败时重启', value: 'on-failure' }
]

const selectedType = ref('mysql')
const config = reactive({
  image: '',
  name: '',
  ports: [''],
  envs: [{ key: '', value: '' }],
  volumes: [{ host: '', container: '' }],
  restart: '',
  network: ''
})

const generatedCommand = ref('')
const dockerComposeYml = ref('')

function loadPreset(type) {
  const preset = containerPresets[type]
  if (preset) {
    config.image = preset.image
    config.name = preset.name
    config.ports = JSON.parse(JSON.stringify(preset.ports))
    config.envs = JSON.parse(JSON.stringify(preset.envs))
    config.volumes = [{ host: '', container: '' }]
    config.restart = ''
    config.network = ''
  }
}

loadPreset('mysql')

watch(selectedType, (newType) => {
  loadPreset(newType)
  message.success(`已切换到 ${containerTypes.find(t => t.value === newType)?.label} 容器配置`)
})

function addEnv() {
  config.envs.push({ key: '', value: '' })
}

function removeEnv(index) {
  if (config.envs.length > 1) {
    config.envs.splice(index, 1)
    message.info('已删除环境变量')
  } else {
    message.warning('至少保留一个环境变量项')
  }
}

function addPort() {
  config.ports.push('')
}

function removePort(index) {
  if (config.ports.length > 1) {
    config.ports.splice(index, 1)
    message.info('已删除端口映射')
  } else {
    message.warning('至少保留一个端口映射')
  }
}

function addVolume() {
  config.volumes.push({ host: '', container: '' })
}

function removeVolume(index) {
  if (config.volumes.length > 1) {
    config.volumes.splice(index, 1)
    message.info('已删除挂载目录')
  } else {
    message.warning('至少保留一个挂载目录项')
  }
}

const dockerRunCommand = computed(() => {
  const parts = ['docker run -d']

  parts.push(`--name ${config.name}`)

  config.ports.forEach(port => {
    if (port && port.trim()) {
      parts.push(`-p ${port}`)
    }
  })

  config.envs.forEach(env => {
    if (env.key && env.key.trim() && env.value !== undefined && env.value !== null) {
      parts.push(`-e ${env.key}=${env.value}`)
    }
  })

  config.volumes.forEach(vol => {
    if (vol.host && vol.host.trim() && vol.container && vol.container.trim()) {
      parts.push(`-v ${vol.host}:${vol.container}`)
    }
  })

  if (config.restart) {
    parts.push(`--restart=${config.restart}`)
  }

  if (config.network && config.network.trim()) {
    parts.push(`--network ${config.network}`)
  }

  parts.push(config.image)

  return parts.join(' \\\n  ')
})

const dockerComposeContent = computed(() => {
  const envVars = {}
  config.envs.forEach(env => {
    if (env.key && env.key.trim()) {
      envVars[env.key] = env.value || ''
    }
  })

  const ports = config.ports.filter(p => p && p.trim())
  const volumes = config.volumes
    .filter(v => v.host && v.host.trim() && v.container && v.container.trim())
    .map(v => `${v.host}:${v.container}`)

  let yml = `version: '3.8'
services:
  ${config.name}:
    image: ${config.image}
    container_name: ${config.name}
    restart: ${config.restart || 'no'}`

  if (ports.length > 0) {
    yml += `
    ports:
${ports.map(p => `      - "${p}"`).join('\n')}`
  }

  if (Object.keys(envVars).length > 0) {
    yml += `
    environment:
${Object.entries(envVars).map(([k, v]) => `      - ${k}=${v}`).join('\n')}`
  }

  if (volumes.length > 0) {
    yml += `
    volumes:
${volumes.map(v => `      - ${v}`).join('\n')}`
  }

  if (config.network && config.network.trim()) {
    yml += `
    networks:
      - ${config.network}

networks:
  ${config.network}:
    external: true`
  }

  return yml
})

function generateCommand() {
  generatedCommand.value = dockerRunCommand.value
  dockerComposeYml.value = dockerComposeContent.value
  message.success('命令生成成功！')
}

async function copyCommand() {
  await copy(generatedCommand.value)
  if (copied.value) {
    message.success('命令已复制到剪贴板！')
  }
}

async function copyCompose() {
  await copy(dockerComposeYml.value)
  if (copied.value) {
    message.success('docker-compose.yml 已复制到剪贴板！')
  }
}

function downloadCompose() {
  const blob = new Blob([dockerComposeYml.value], { type: 'text/yaml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'docker-compose.yml'
  a.click()
  URL.revokeObjectURL(url)
  message.success('docker-compose.yml 下载成功！')
}
</script>

<template>
  <n-card :bordered="false" class="shadow-lg dark:bg-gray-800 ">
    <template #header>
      <div class="flex items-center gap-3">
        <span class="i-carbon-docker text-2xl text-blue-500"></span>
        <span class="text-xl font-bold">Docker Run 命令生成器</span>
      </div>
    </template>

    <n-space vertical size="large">
      <n-card title="容器类型选择" size="small">
        <n-select v-model:value="selectedType" :options="containerTypes" placeholder="选择容器类型" />
      </n-card>

      <n-card title="基础配置" size="small">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <n-form-item label="镜像名">
            <n-input v-model:value="config.image" placeholder="例如: mysql:8.0" />
          </n-form-item>
          <n-form-item label="容器名">
            <n-input v-model:value="config.name" placeholder="例如: mysql8" />
          </n-form-item>
          <n-form-item label="端口映射" class="md:col-span-2 lg:col-span-1">
            <div class="w-full space-y-2">
              <div v-for="(port, index) in config.ports" :key="index" class="flex gap-2">
                <n-input v-model:value="config.ports[index]" placeholder="主机端口:容器端口" class="flex-1" />
                <n-button v-if="config.ports.length > 1" type="error" size="small" @click="removePort(index)">
                  删除
                </n-button>
              </div>
              <n-button size="small" @click="addPort">
                + 添加端口映射
              </n-button>
            </div>
          </n-form-item>
        </div>
      </n-card>

      <n-card title="环境变量" size="small">
        <div class="space-y-2">
          <div v-for="(env, index) in config.envs" :key="index" class="flex gap-2 items-center">
            <n-input v-model:value="env.key" placeholder="KEY" class="flex-1" />
            <n-input v-model:value="env.value" placeholder="VALUE" class="flex-1" />
            <n-button type="error" size="small" @click="removeEnv(index)">
              删除
            </n-button>
          </div>
          <n-button size="small" @click="addEnv">
            + 添加环境变量
          </n-button>
        </div>
      </n-card>

      <n-card title="挂载目录 (-v)" size="small">
        <div class="space-y-2">
          <div v-for="(vol, index) in config.volumes" :key="index" class="flex gap-2 items-center">
            <n-input v-model:value="vol.host" placeholder="主机目录" class="flex-1" />
            <n-input v-model:value="vol.container" placeholder="容器目录" class="flex-1" />
            <n-button type="error" size="small" @click="removeVolume(index)">
              删除
            </n-button>
          </div>
          <n-button size="small" @click="addVolume">
            + 添加挂载目录
          </n-button>
        </div>
      </n-card>

      <n-card title="高级配置" size="small">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <n-form-item label="重启策略">
            <n-select v-model:value="config.restart" :options="restartPolicies" placeholder="选择重启策略" />
          </n-form-item>
          <n-form-item label="网络配置">
            <n-input v-model:value="config.network" placeholder="指定 Docker 网络（可选）" />
          </n-form-item>
        </div>
      </n-card>

      <n-space>
        <n-button type="primary" size="large" @click="generateCommand">
          生成命令
        </n-button>
        <n-button type="info" size="large" :disabled="!generatedCommand" @click="copyCommand">
          复制 Docker Run 命令
        </n-button>
        <n-button type="success" size="large" :disabled="!dockerComposeYml" @click="copyCompose">
          复制 docker-compose.yml
        </n-button>
        <n-button type="warning" size="large" :disabled="!dockerComposeYml" @click="downloadCompose">
          下载 docker-compose.yml
        </n-button>
      </n-space>

      <n-card v-if="generatedCommand" title="Docker Run 命令" size="small">
        <n-input :value="generatedCommand" type="textarea" readonly :autosize="{ minRows: 5, maxRows: 15 }"
          class="font-mono text-sm" />
      </n-card>

      <n-card v-if="dockerComposeYml" title="docker-compose.yml" size="small">
        <n-input :value="dockerComposeYml" type="textarea" readonly :autosize="{ minRows: 10, maxRows: 25 }"
          class="font-mono text-sm" />
      </n-card>
    </n-space>
  </n-card>
</template>

<style scoped>
.font-mono {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
}
</style>
