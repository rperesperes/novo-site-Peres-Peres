import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
import typographyPlugin from '@tailwindcss/typography'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

// Emergência 0.0.199: restaura src/pages/Services.tsx (truncado em commit) do
// histórico git, rodando uma única vez, no carregamento desta config pelo build.
// No-op quando o arquivo já está bom (>= 1000 linhas com export default).
const SERVICES = path.resolve('src/pages/Services.tsx')
try {
  const current: string = fs.existsSync(SERVICES) ? fs.readFileSync(SERVICES, 'utf8') : ''
  const damaged = !(
    current.split('\n').length >= 1000 && /export default function Services/.test(current)
  )
  if (damaged) {
    const git = (args: string[]) =>
      spawnSync('git', ['-C', process.cwd(), ...args], { encoding: 'utf8' as const })
    const isRepo = git(['rev-parse', '--git-dir'])
    if (isRepo.status === 0) {
      const log = git(['log', '--format=%H', '-n', '10', '--', 'src/pages/Services.tsx'])
      if (log.status === 0) {
        let good: string | null = null
        for (const c of log.stdout.trim().split('\n').filter(Boolean)) {
          const check = git(['cat-file', '-s', `${c}:src/pages/Services.tsx`])
          const size = parseInt(check.stdout.trim(), 10)
          if (check.status === 0 && size > 20000) {
            good = c
            break
          }
        }
        if (good) {
          const restore = git(['checkout', good, '--', 'src/pages/Services.tsx'])
          if (restore.status === 0) {
            console.log(
              `[tailwind.config] src/pages/Services.tsx restaurado do commit ${good.slice(0, 10)}`,
            )
          } else {
            console.error(`[tailwind.config] falha ao restaurar Services.tsx: ${restore.stderr}`)
          }
        } else {
          console.error('[tailwind.config] nenhum commit com versão boa de src/pages/Services.tsx')
        }
      }
    }
  }
} catch (e) {
  console.error(`[tailwind.config] restauração de emergência falhou: ${(e as Error).message}`)
}

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
        ],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: '#FAB319',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#FAB319',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#000000',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#F3F4F6',
          foreground: '#000000',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          1: '#FAB319',
          2: '#000000',
          3: '#4B5563',
          4: '#D1D5DB',
          5: '#111827',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [animatePlugin, typographyPlugin, aspectRatioPlugin],
} satisfies Config
