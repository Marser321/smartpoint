'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, Bot, X, ChevronUp } from 'lucide-react'

export default function AssistanceWidget() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => setIsOpen(!isOpen)

    const socialLinks = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            href: 'https://wa.me/59899123456',
            color: 'bg-[#25D366]',
            delay: 0.1
        },
        {
            name: 'Llamar',
            icon: Phone,
            href: 'tel:+59899123456',
            color: 'bg-blue-500',
            delay: 0.05
        },
        // {
        //     name: 'Asistente AI',
        //     icon: Bot,
        //     href: '#',
        //     color: 'bg-[var(--sp-red)]',
        //     delay: 0
        // }
    ]

    return (
        <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <>
                        {socialLinks.map((link, index) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                transition={{ delay: link.delay }}
                                className={`
                                    flex items-center gap-3 pl-4 pr-3 py-3 rounded-full 
                                    shadow-lg hover:shadow-xl hover:scale-105 transition-all
                                    text-white font-medium
                                    ${link.color}
                                `}
                            >
                                <span className="text-sm shadow-black drop-shadow-md">{link.name}</span>
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <link.icon className="w-5 h-5 text-white" />
                                </div>
                            </motion.a>
                        ))}
                    </>
                )}
            </AnimatePresence>

            <motion.button
                onClick={toggleOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                    w-14 h-14 rounded-full shadow-2xl flex items-center justify-center
                    transition-all duration-300
                    ${isOpen ? 'bg-[var(--cod-gray)] text-white rotate-45' : 'bg-[var(--sp-red)] text-white hover:bg-[var(--sp-red-light)]'}
                `}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-7 h-7" />
                )}
            </motion.button>
        </div>
    )
}
