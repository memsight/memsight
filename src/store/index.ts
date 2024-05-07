import { ListNote, Token, WhiteList } from '@/global'
import { atom } from 'jotai'

export const tokensAtom = atom<Token[]>([])
export const notesAtom = atom<ListNote[]>([])
export const whiteListsAtom = atom<WhiteList[]>([])
export const myWhiteListsAtom = atom<WhiteList[]>([])