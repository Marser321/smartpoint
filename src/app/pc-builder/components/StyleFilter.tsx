'use client'

import { useBuild, StylePalette } from '../context/BuildContext'

const STYLES: { value: StylePalette | null; label: string; icon: string }[] = [
    { value: null, label: 'Todos', icon: '🎨' },
    { value: 'stealth_black', label: 'Stealth Black', icon: '🖤' },
    { value: 'pure_white', label: 'Pure White', icon: '🤍' },
    { value: 'rgb', label: 'Cyberpunk RGB', icon: '🌈' },
]

export default function StyleFilter() {
    const { styleFilter, setStyleFilter } = useBuild()

    return (
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            {STYLES.map(style => (
                <button
                    key={style.label}
                    onClick={() => setStyleFilter(style.value)}
                    className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${styleFilter === style.value
                            ? 'bg-white/10 text-white'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }
                    `}
                >
                    <span className="mr-1">{style.icon}</span>
                    <span className="hidden sm:inline">{style.label}</span>
                </button>
            ))}
        </div>
    )
}
