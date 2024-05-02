import { Token } from '@/global'
import { Note } from '@prisma/client'
import { atom } from 'jotai'

export const tokensAtom = atom<Token[]>([])
export const notesAtom = atom<Note[]>([])